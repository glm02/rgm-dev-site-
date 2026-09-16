-- RGM Dev — Row Level Security
--
-- Principe : la base est la dernière ligne de défense, pas la première. Un
-- Server Action est joignable par POST direct et la clé anon est publique par
-- construction — donc tout passe par ces politiques, et rien ne repose sur une
-- vérification faite côté interface.
--
-- Trois publics :
--   anon          le visiteur   → lit ce qui est publié, écrit une demande de devis
--   authenticated le client     → lit et écrit ce qui lui appartient
--   admin         Rafael        → tout, via public.est_admin()

alter table profils           enable row level security;
alter table services          enable row level security;
alter table offres            enable row level security;
alter table projets           enable row level security;
alter table avis              enable row level security;
alter table articles          enable row level security;
alter table demandes_devis    enable row level security;
alter table missions          enable row level security;
alter table jalons            enable row level security;
alter table documents         enable row level security;
alter table messages          enable row level security;
alter table sites_supervises  enable row level security;
alter table controles         enable row level security;
alter table alertes           enable row level security;

-- ---------------------------------------------------------------------------
-- Profils
-- ---------------------------------------------------------------------------

create policy "profil lisible par son titulaire"
  on profils for select
  using (id = auth.uid() or public.est_admin());

create policy "profil modifiable par son titulaire"
  on profils for update
  using (id = auth.uid() or public.est_admin())
  with check (id = auth.uid() or public.est_admin());

create policy "profils administrables"
  on profils for all
  using (public.est_admin())
  with check (public.est_admin());

-- La politique `update` ci-dessus laisserait un client se promouvoir admin en
-- changeant sa propre colonne `role`. Un `with check` ne peut pas comparer à
-- l'ancienne valeur : il faut un déclencheur.
create function public.role_non_modifiable_par_le_client()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.est_admin() then
    raise exception 'Le rôle ne peut être changé que par un administrateur.';
  end if;
  return new;
end;
$$;

create trigger profils_role_verrouille
  before update on profils
  for each row execute function public.role_non_modifiable_par_le_client();

-- ---------------------------------------------------------------------------
-- Le site public : lecture libre de ce qui est publié, écriture réservée
-- ---------------------------------------------------------------------------

create policy "services actifs publics"
  on services for select
  using (actif or public.est_admin());

create policy "services administrables"
  on services for all
  using (public.est_admin()) with check (public.est_admin());

create policy "offres actives publiques"
  on offres for select
  using (actif or public.est_admin());

create policy "offres administrables"
  on offres for all
  using (public.est_admin()) with check (public.est_admin());

create policy "projets publies publics"
  on projets for select
  using (publie or public.est_admin());

create policy "projets administrables"
  on projets for all
  using (public.est_admin()) with check (public.est_admin());

create policy "articles publies publics"
  on articles for select
  using ((publie and publie_le <= now()) or public.est_admin());

create policy "articles administrables"
  on articles for all
  using (public.est_admin()) with check (public.est_admin());

-- ---------------------------------------------------------------------------
-- Avis
-- ---------------------------------------------------------------------------

create policy "avis publies publics"
  on avis for select
  using (publie or profil_id = auth.uid() or public.est_admin());

-- Un client dépose son avis sous son propre nom, et il arrive non publié :
-- la mise en ligne est une décision de Rafael.
create policy "client depose son avis"
  on avis for insert
  to authenticated
  with check (profil_id = auth.uid() and not publie and not en_vedette);

create policy "avis administrables"
  on avis for all
  using (public.est_admin()) with check (public.est_admin());

-- ---------------------------------------------------------------------------
-- Demandes de devis
-- ---------------------------------------------------------------------------
-- N'importe qui peut en déposer une — c'est le formulaire de contact. Personne
-- ne peut les relire : elles contiennent les coordonnées des prospects.

create policy "tout le monde peut demander un devis"
  on demandes_devis for insert
  to anon, authenticated
  with check (true);

create policy "demandes lisibles par l'admin"
  on demandes_devis for select
  using (public.est_admin());

create policy "demandes administrables"
  on demandes_devis for all
  using (public.est_admin()) with check (public.est_admin());

-- ---------------------------------------------------------------------------
-- Espace client
-- ---------------------------------------------------------------------------

create policy "client voit ses missions"
  on missions for select
  to authenticated
  using (profil_id = auth.uid() or public.est_admin());

create policy "missions administrables"
  on missions for all
  using (public.est_admin()) with check (public.est_admin());

create policy "client voit les jalons de ses missions"
  on jalons for select
  to authenticated
  using (
    exists (
      select 1 from missions m
      where m.id = jalons.mission_id and m.profil_id = auth.uid()
    )
    or public.est_admin()
  );

create policy "jalons administrables"
  on jalons for all
  using (public.est_admin()) with check (public.est_admin());

-- Les brouillons de devis restent invisibles tant qu'ils ne sont pas envoyés.
create policy "client voit ses documents envoyes"
  on documents for select
  to authenticated
  using (
    (
      statut <> 'brouillon'
      and exists (
        select 1 from missions m
        where m.id = documents.mission_id and m.profil_id = auth.uid()
      )
    )
    or public.est_admin()
  );

create policy "documents administrables"
  on documents for all
  using (public.est_admin()) with check (public.est_admin());

create policy "client lit la conversation de ses missions"
  on messages for select
  to authenticated
  using (
    exists (
      select 1 from missions m
      where m.id = messages.mission_id and m.profil_id = auth.uid()
    )
    or public.est_admin()
  );

create policy "client ecrit dans ses missions"
  on messages for insert
  to authenticated
  with check (
    auteur_id = auth.uid()
    and (
      exists (
        select 1 from missions m
        where m.id = messages.mission_id and m.profil_id = auth.uid()
      )
      or public.est_admin()
    )
  );

create policy "messages administrables"
  on messages for all
  using (public.est_admin()) with check (public.est_admin());

-- ---------------------------------------------------------------------------
-- Supervision : interne, rien n'en sort
-- ---------------------------------------------------------------------------
-- La route de contrôle tourne côté serveur avec la clé service role, qui
-- contourne la RLS. Aucune politique d'écriture n'est donc nécessaire ici.

create policy "supervision reservee a l'admin"
  on sites_supervises for all
  using (public.est_admin()) with check (public.est_admin());

create policy "controles reserves a l'admin"
  on controles for select
  using (public.est_admin());

create policy "alertes reservees a l'admin"
  on alertes for all
  using (public.est_admin()) with check (public.est_admin());
