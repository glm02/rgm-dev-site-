-- RGM Dev — schéma initial
--
-- Tout vit dans `public` : ce projet Supabase lui est dédié, il n'est pas
-- partagé avec d'autres applications. Les noms de tables sont en français,
-- comme le reste du domaine.
--
-- Trois familles de tables :
--   1. le site public       (services, offres, projets, avis, articles)
--   2. la relation client   (demandes_devis, missions, jalons, documents, messages)
--   3. la supervision       (sites_supervises, controles, alertes)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. Comptes
-- ---------------------------------------------------------------------------

create type role_utilisateur as enum ('admin', 'client');

-- Miroir applicatif de `auth.users`. Le rôle vit ici et nulle part ailleurs :
-- les politiques RLS s'y réfèrent, donc il ne doit jamais être modifiable par
-- le client (voir 0002_rls.sql).
create table profils (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  nom         text,
  entreprise  text,
  telephone   text,
  avatar_url  text,
  role        role_utilisateur not null default 'client',
  cree_le     timestamptz not null default now()
);

comment on table profils is 'Profil applicatif adossé à auth.users. Porte le rôle.';

-- Crée le profil à l'inscription, quel que soit le fournisseur (OAuth ou lien
-- magique). Sans ce déclencheur, un utilisateur authentifié n'aurait aucun
-- rôle et serait invisible des politiques RLS.
create function public.creer_profil_a_inscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profils (id, email, nom, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger sur_inscription_creer_profil
  after insert on auth.users
  for each row execute function public.creer_profil_a_inscription();

-- Raccourci utilisé par presque toutes les politiques. `security definer` pour
-- qu'il puisse lire `profils` sans être bloqué par la RLS de `profils`
-- lui-même — sinon on obtient une récursion infinie.
create function public.est_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profils
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. Le site public
-- ---------------------------------------------------------------------------

-- Les deux métiers : sites web et automatisation IA. Une ligne par page service.
create table services (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  titre       text not null,
  accroche    text not null,
  description text,
  icone       text,
  image       text,
  ordre       int not null default 0,
  actif       boolean not null default true,
  seo_titre       text,
  seo_description text,
  cree_le     timestamptz not null default now(),
  modifie_le  timestamptz not null default now()
);

create type unite_prix as enum ('forfait', 'mois', 'jour', 'heure');

-- Les prix affichés publiquement. Une fourchette plutôt qu'un prix sec :
-- ça qualifie le prospect sans enfermer le devis.
create table offres (
  id          uuid primary key default gen_random_uuid(),
  service_id  uuid references services (id) on delete cascade,
  nom         text not null,
  description text,
  prix_min    integer not null,
  prix_max    integer,
  unite       unite_prix not null default 'forfait',
  delai       text,
  inclus      text[] not null default '{}',
  en_vedette  boolean not null default false,
  ordre       int not null default 0,
  actif       boolean not null default true,
  cree_le     timestamptz not null default now(),
  modifie_le  timestamptz not null default now(),
  constraint fourchette_coherente check (prix_max is null or prix_max >= prix_min)
);

comment on column offres.prix_min is 'En euros HT. Entier : pas de centimes sur une fourchette.';

-- Les réalisations. `publie` sépare le brouillon du visible ; `en_vedette`
-- choisit ce qui remonte en page d'accueil.
create table projets (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  titre            text not null,
  client_nom       text,
  secteur          text,
  resume           text not null,
  probleme         text,
  solution         text,
  resultat         text,
  stack            text[] not null default '{}',
  url_live         text,
  url_depot        text,
  image_couverture text,
  images           text[] not null default '{}',
  prix_min         integer,
  prix_max         integer,
  duree_jours      integer,
  livre_le         date,
  en_vedette       boolean not null default false,
  publie           boolean not null default false,
  ordre            int not null default 0,
  seo_titre        text,
  seo_description  text,
  cree_le          timestamptz not null default now(),
  modifie_le       timestamptz not null default now()
);

create index projets_publies_idx on projets (publie, ordre) where publie;

-- Les avis clients. Deux origines : saisis par l'admin (import d'un avis
-- Google, d'un mail) ou déposés par le client depuis son espace.
create table avis (
  id               uuid primary key default gen_random_uuid(),
  projet_id        uuid references projets (id) on delete set null,
  profil_id        uuid references profils (id) on delete set null,
  auteur_nom       text not null,
  auteur_role      text,
  auteur_entreprise text,
  auteur_avatar    text,
  note             smallint not null,
  contenu          text not null,
  source           text not null default 'site',
  publie           boolean not null default false,
  en_vedette       boolean not null default false,
  cree_le          timestamptz not null default now(),
  constraint note_sur_cinq check (note between 1 and 5)
);

create index avis_publies_idx on avis (publie, cree_le desc) where publie;

comment on table avis is 'Un avis affiché est un vrai avis. `publie` est une modération, pas une invention.';

-- Le blog : il sert le référencement, c'est sa seule raison d'être.
create table articles (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  titre           text not null,
  chapo           text,
  contenu         text not null default '',
  image           text,
  tags            text[] not null default '{}',
  temps_lecture   int,
  publie          boolean not null default false,
  publie_le       timestamptz,
  seo_titre       text,
  seo_description text,
  cree_le         timestamptz not null default now(),
  modifie_le      timestamptz not null default now()
);

create index articles_publies_idx on articles (publie, publie_le desc) where publie;

-- ---------------------------------------------------------------------------
-- 3. La relation client
-- ---------------------------------------------------------------------------

create type statut_demande as enum ('nouveau', 'contacte', 'devis_envoye', 'gagne', 'perdu');

-- Le formulaire de devis. `utm_*` est là pour mesurer Google Ads : sans ça on
-- dépense sans savoir ce qui convertit.
create table demandes_devis (
  id           uuid primary key default gen_random_uuid(),
  nom          text not null,
  email        text not null,
  telephone    text,
  entreprise   text,
  type_projet  text,
  budget       text,
  echeance     text,
  message      text not null,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  page_origine text,
  statut       statut_demande not null default 'nouveau',
  note_interne text,
  cree_le      timestamptz not null default now()
);

create index demandes_devis_statut_idx on demandes_devis (statut, cree_le desc);

create type statut_mission as enum ('cadrage', 'en_cours', 'revue', 'livre', 'maintenance', 'suspendu');

-- Une mission = un projet client en cours, ce que le client suit depuis son
-- espace. À ne pas confondre avec `projets`, qui est la vitrine.
create table missions (
  id             uuid primary key default gen_random_uuid(),
  profil_id      uuid not null references profils (id) on delete cascade,
  titre          text not null,
  description    text,
  statut         statut_mission not null default 'cadrage',
  avancement     smallint not null default 0,
  montant        integer,
  debut_le       date,
  fin_prevue_le  date,
  url_live       text,
  cree_le        timestamptz not null default now(),
  modifie_le     timestamptz not null default now(),
  constraint avancement_en_pourcent check (avancement between 0 and 100)
);

create index missions_par_client_idx on missions (profil_id, cree_le desc);

create type statut_jalon as enum ('a_faire', 'en_cours', 'fait', 'bloque');

create table jalons (
  id          uuid primary key default gen_random_uuid(),
  mission_id  uuid not null references missions (id) on delete cascade,
  titre       text not null,
  description text,
  statut      statut_jalon not null default 'a_faire',
  ordre       int not null default 0,
  prevu_le    date,
  fait_le     date,
  cree_le     timestamptz not null default now()
);

create index jalons_par_mission_idx on jalons (mission_id, ordre);

create type type_document as enum ('devis', 'facture', 'livrable', 'contrat', 'autre');
create type statut_document as enum ('brouillon', 'envoye', 'accepte', 'refuse', 'paye');

create table documents (
  id          uuid primary key default gen_random_uuid(),
  mission_id  uuid not null references missions (id) on delete cascade,
  type        type_document not null,
  titre       text not null,
  url         text,
  reference   text,
  montant     integer,
  statut      statut_document not null default 'brouillon',
  echeance_le date,
  cree_le     timestamptz not null default now()
);

create index documents_par_mission_idx on documents (mission_id, cree_le desc);

-- Messagerie simple entre le client et RGM Dev, rattachée à une mission.
create table messages (
  id          uuid primary key default gen_random_uuid(),
  mission_id  uuid not null references missions (id) on delete cascade,
  auteur_id   uuid not null references profils (id) on delete cascade,
  contenu     text not null,
  lu_le       timestamptz,
  cree_le     timestamptz not null default now()
);

create index messages_par_mission_idx on messages (mission_id, cree_le);

-- ---------------------------------------------------------------------------
-- 4. Supervision des sites livrés
-- ---------------------------------------------------------------------------
-- Demande explicite : être prévenu quand un site client tombe, sans avoir à
-- le découvrir par le client. Un cron Vercel appelle la route de contrôle,
-- qui écrit ici et déclenche une alerte au passage en échec.

create table sites_supervises (
  id                  uuid primary key default gen_random_uuid(),
  projet_id           uuid references projets (id) on delete set null,
  nom                 text not null,
  url                 text not null,
  actif               boolean not null default true,
  statut_attendu      int not null default 200,
  seuil_lenteur_ms    int not null default 3000,
  tls_expire_le       date,
  dernier_controle_le timestamptz,
  dernier_ok          boolean,
  cree_le             timestamptz not null default now()
);

create table controles (
  id           uuid primary key default gen_random_uuid(),
  site_id      uuid not null references sites_supervises (id) on delete cascade,
  ok           boolean not null,
  statut_http  int,
  temps_ms     int,
  erreur       text,
  verifie_le   timestamptz not null default now()
);

create index controles_par_site_idx on controles (site_id, verifie_le desc);

create type type_alerte as enum ('hors_ligne', 'lenteur', 'erreur_http', 'tls_bientot_expire', 'retour_en_ligne');

create table alertes (
  id          uuid primary key default gen_random_uuid(),
  site_id     uuid not null references sites_supervises (id) on delete cascade,
  type        type_alerte not null,
  message     text not null,
  notifiee_le timestamptz,
  resolue_le  timestamptz,
  cree_le     timestamptz not null default now()
);

create index alertes_ouvertes_idx on alertes (cree_le desc) where resolue_le is null;

-- ---------------------------------------------------------------------------
-- 5. `modifie_le` tenu à jour automatiquement
-- ---------------------------------------------------------------------------

create function public.touche_modifie_le()
returns trigger
language plpgsql
as $$
begin
  new.modifie_le = now();
  return new;
end;
$$;

create trigger services_modifie_le before update on services
  for each row execute function public.touche_modifie_le();
create trigger offres_modifie_le before update on offres
  for each row execute function public.touche_modifie_le();
create trigger projets_modifie_le before update on projets
  for each row execute function public.touche_modifie_le();
create trigger articles_modifie_le before update on articles
  for each row execute function public.touche_modifie_le();
create trigger missions_modifie_le before update on missions
  for each row execute function public.touche_modifie_le();
