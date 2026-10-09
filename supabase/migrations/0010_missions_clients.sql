-- ===========================================================================
-- 0010 — Une mission peut appartenir à un client qui n'a pas (encore) de compte
-- ===========================================================================
--
-- Jusqu'ici, une mission exigeait un compte client (`profil_id not null`) :
-- tant qu'un client ne s'était pas connecté une fois, impossible de suivre son
-- projet dans l'admin. Or la plupart des clients de RGM Dev n'ont jamais eu
-- besoin de se connecter. La page Clients restait vide alors qu'il y en a six.
--
-- Désormais une mission se rattache à un client du pipeline (`prospect_id`),
-- à un compte (`profil_id`), ou aux deux. Le client ne voit sa mission dans son
-- espace que lorsqu'un compte y est rattaché : la politique RLS existante
-- (`profil_id = auth.uid()`) ne change pas, une mission sans compte reste
-- invisible pour tout le monde sauf l'admin.
--
-- Rejouable sans doublon.

alter table missions alter column profil_id drop not null;

alter table missions
  add column if not exists prospect_id uuid references prospects (id) on delete set null;

create index if not exists missions_par_prospect_idx on missions (prospect_id);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'mission_a_un_client') then
    alter table missions
      add constraint mission_a_un_client check (profil_id is not null or prospect_id is not null);
  end if;
end $$;

comment on column missions.prospect_id is
  'Le client côté pipeline. Suffit pour suivre la mission dans l''admin ; le client ne la voit qu''une fois un compte (profil_id) rattaché.';

-- ---------------------------------------------------------------------------
-- Les missions des clients actuels, à partir de leur fiche réalisation
-- ---------------------------------------------------------------------------
--
-- Statut « livré » pour les sites en ligne chez le client, « revue » pour les
-- refontes prêtes mais pas encore sur le domaine du client (Liccia, La Santon).
-- Montant, dates et jalons restent vides : ils se renseignent dans l'admin,
-- on ne les invente pas.

with a_creer as (
  select
    pr.id as prospect_id,
    p.titre,
    p.resume,
    p.url_live,
    case when p.slug in ('liccia-immo', 'la-santon') then 'revue' else 'livre' end::statut_mission as statut
  from prospects pr
  join projets p on p.client_nom = pr.entreprise
  where pr.statut = 'gagne'
    and pr.mission_id is null
    and not exists (select 1 from missions m where m.prospect_id = pr.id)
),
creees as (
  insert into missions (prospect_id, titre, description, statut, avancement, url_live)
  select prospect_id, 'Site ' || titre, resume, statut,
         case when statut = 'livre' then 100 else 90 end,
         url_live
  from a_creer
  returning id, prospect_id
)
update prospects pr
set mission_id = c.id
from creees c
where pr.id = c.prospect_id;

-- ---------------------------------------------------------------------------
-- Messages lus
-- ---------------------------------------------------------------------------
--
-- `messages.lu_le` n'était jamais rempli : l'espace client ne pouvait pas
-- distinguer un message nouveau d'un ancien. Plutôt que d'ouvrir l'update de
-- la table aux clients (qui pourraient alors réécrire un message), une
-- fonction étroite : elle ne fait que dater la lecture des messages écrits par
-- **l'autre** partie, et seulement sur une mission que l'appelant a le droit
-- de voir (la sienne, ou toutes pour l'admin).

create or replace function public.marquer_messages_lus(p_mission uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update messages
  set lu_le = now()
  where mission_id = p_mission
    and lu_le is null
    and auteur_id <> auth.uid()
    and exists (
      select 1 from missions m
      where m.id = p_mission
        and (m.profil_id = auth.uid() or public.est_admin())
    );
$$;

revoke all on function public.marquer_messages_lus(uuid) from public, anon;
grant execute on function public.marquer_messages_lus(uuid) to authenticated;
