-- RGM Dev — CRM commercial
--
-- Les demandes de devis disent ce qui est arrivé ; le CRM dit ce qu'on en
-- fait. Deux tables seulement :
--
--   prospects   une affaire en cours, avec sa valeur, sa probabilité et sa
--               prochaine relance ;
--   activites   le journal de ce qui a été dit et quand — un appel, un mail,
--               un rendez-vous. C'est lui qui fait foi, pas la mémoire.
--
-- Une demande reçue depuis le site crée son prospect toute seule : sans ça, il
-- faudrait recopier à la main ce que le formulaire sait déjà.

-- ---------------------------------------------------------------------------
-- Énumérations
-- ---------------------------------------------------------------------------

create type statut_prospect as enum (
  'nouveau',       -- arrivé, pas encore qualifié
  'qualifie',      -- le besoin est compris et le budget plausible
  'devis_envoye',
  'negociation',
  'gagne',
  'perdu'
);

create type type_activite as enum ('appel', 'email', 'rdv', 'devis', 'relance', 'note');

-- ---------------------------------------------------------------------------
-- Prospects
-- ---------------------------------------------------------------------------

create table prospects (
  id             uuid primary key default gen_random_uuid(),
  entreprise     text,
  contact        text not null,
  email          text,
  telephone      text,
  ville          text,
  secteur        text,
  -- D'où vient l'affaire : 'site', 'google-ads', 'recommandation',
  -- 'prospection', 'linkedin'… Texte libre : la liste bougera plus vite que
  -- les migrations.
  source         text,
  besoin         text,
  statut         statut_prospect not null default 'nouveau',
  -- Montant HT espéré. `numeric` et pas `float` : on parle d'euros.
  valeur_estimee numeric(10, 2),
  probabilite    smallint not null default 20 check (probabilite between 0 and 100),
  relance_le     date,
  note           text,
  etiquettes     text[] not null default '{}',
  -- Les trois fils qui relient le CRM au reste : la demande d'origine, le
  -- compte client une fois l'affaire gagnée, et la mission ouverte pour lui.
  demande_id     uuid references demandes_devis (id) on delete set null,
  profil_id      uuid references profils (id) on delete set null,
  mission_id     uuid references missions (id) on delete set null,
  derniere_activite_le timestamptz not null default now(),
  cree_le        timestamptz not null default now(),
  maj_le         timestamptz not null default now()
);

comment on table prospects is 'Une affaire commerciale en cours. Le pipeline.';
comment on column prospects.probabilite is 'Chance de signer, en %. Sert à pondérer la valeur du pipeline.';

create index prospects_statut_idx on prospects (statut, derniere_activite_le desc);
create index prospects_relance_idx on prospects (relance_le) where relance_le is not null;

-- Une demande ne crée qu'un prospect : l'index rend le `on conflict` du
-- rattrapage ci-dessous fiable, et empêche un doublon si le déclencheur
-- tournait deux fois.
create unique index prospects_demande_idx on prospects (demande_id) where demande_id is not null;

-- ---------------------------------------------------------------------------
-- Activités
-- ---------------------------------------------------------------------------

create table activites (
  id          uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references prospects (id) on delete cascade,
  type        type_activite not null default 'note',
  resume      text not null,
  fait_le     timestamptz not null default now(),
  cree_le     timestamptz not null default now()
);

comment on table activites is 'Journal des échanges avec un prospect.';

create index activites_prospect_idx on activites (prospect_id, fait_le desc);

-- ---------------------------------------------------------------------------
-- Déclencheurs
-- ---------------------------------------------------------------------------

create function public.prospect_touche()
returns trigger
language plpgsql
as $$
begin
  new.maj_le := now();
  return new;
end;
$$;

create trigger prospects_maj
  before update on prospects
  for each row execute function public.prospect_touche();

-- La date de dernière activité est calculée, jamais saisie : c'est elle qui
-- trie le pipeline et qui répond à « qui n'a pas eu de nouvelles depuis un
-- mois ? ».
create function public.activite_rafraichit_prospect()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.prospects
     set derniere_activite_le = greatest(derniere_activite_le, new.fait_le)
   where id = new.prospect_id;
  return new;
end;
$$;

create trigger activites_rafraichit_prospect
  after insert on activites
  for each row execute function public.activite_rafraichit_prospect();

-- Une demande de devis entre dans le pipeline sans recopie. `security definer`
-- est indispensable : l'insertion est faite par le visiteur anonyme, qui n'a
-- aucun droit sur `prospects`.
create function public.demande_cree_prospect()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  prospect_id uuid;
begin
  insert into public.prospects (
    entreprise, contact, email, telephone, source, besoin, note, demande_id
  ) values (
    new.entreprise,
    new.nom,
    new.email,
    new.telephone,
    coalesce(new.utm_source, 'site'),
    new.type_projet,
    new.message,
    new.id
  )
  returning id into prospect_id;

  insert into public.activites (prospect_id, type, resume)
  values (
    prospect_id,
    'note',
    'Demande de devis reçue depuis ' || coalesce(new.page_origine, 'le site') || '.'
  );

  return new;
end;
$$;

create trigger demandes_devis_vers_crm
  after insert on demandes_devis
  for each row execute function public.demande_cree_prospect();

-- ---------------------------------------------------------------------------
-- Droits
-- ---------------------------------------------------------------------------
-- Le CRM est interne : rien n'en sort, ni vers le visiteur, ni vers le client.

alter table prospects enable row level security;
alter table activites enable row level security;

create policy "prospects reserves a l'admin"
  on prospects for all
  using (public.est_admin()) with check (public.est_admin());

create policy "activites reservees a l'admin"
  on activites for all
  using (public.est_admin()) with check (public.est_admin());

grant all on table prospects, activites to service_role;
grant select, insert, update, delete on table prospects, activites to authenticated;

-- ---------------------------------------------------------------------------
-- Rattrapage : les demandes déjà reçues entrent dans le pipeline
-- ---------------------------------------------------------------------------

insert into prospects (
  entreprise, contact, email, telephone, source, besoin, note, demande_id,
  statut, cree_le, derniere_activite_le
)
select
  d.entreprise,
  d.nom,
  d.email,
  d.telephone,
  coalesce(d.utm_source, 'site'),
  d.type_projet,
  d.message,
  d.id,
  case d.statut
    when 'nouveau'      then 'nouveau'
    when 'contacte'     then 'qualifie'
    when 'devis_envoye' then 'devis_envoye'
    when 'gagne'        then 'gagne'
    else 'perdu'
  end::statut_prospect,
  d.cree_le,
  d.cree_le
from demandes_devis d
on conflict do nothing;
