-- RGM Dev — droits d'accès des rôles de l'API
--
-- Pourquoi ce fichier existe : sur les projets Supabase récents, une table
-- créée en SQL n'est plus automatiquement accessible aux rôles de l'API
-- (`anon`, `authenticated`, `service_role`). Sans ces GRANT, toute requête
-- répond « permission denied » (42501) — même avec la clé service_role — et
-- la RLS n'est jamais consultée.
--
-- Deux couches, à ne pas confondre :
--   1. GRANT  : le rôle a-t-il le droit de toucher cette table ? (ici)
--   2. RLS    : quelles lignes ce rôle peut-il voir ou modifier ? (0002_rls.sql)
-- Les GRANT sont donc larges pour `authenticated` : c'est la RLS qui filtre.

grant usage on schema public to anon, authenticated, service_role;

-- --- service_role : les travaux de fond (supervision) ----------------------
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;

-- --- anon : le visiteur non connecté ----------------------------------------
-- Il lit le contenu public et dépose une demande de devis. Rien d'autre : pas
-- même la lecture des demandes, ni aucune table de l'espace client.
grant select on public.services, public.offres, public.projets, public.avis, public.articles to anon;
grant insert on public.demandes_devis to anon;

-- --- authenticated : clients et admin ---------------------------------------
-- Droits complets au niveau de la table ; la RLS décide ligne par ligne.
grant select, insert, update, delete on all tables in schema public to authenticated;

grant execute on function public.est_admin() to anon, authenticated;

-- Les tables ajoutées plus tard héritent des mêmes droits : sans ces lignes,
-- chaque nouvelle migration reproduirait le « permission denied ».
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant all on sequences to service_role;

-- ---------------------------------------------------------------------------
-- Correctif : le verrou du rôle bloquait aussi l'éditeur SQL
-- ---------------------------------------------------------------------------
-- La version de 0002 refusait tout changement de rôle hors admin connecté.
-- Or dans l'éditeur SQL ou avec la clé service_role, `auth.uid()` est nul :
-- `est_admin()` renvoie faux et même le propriétaire du projet ne pouvait plus
-- promouvoir un compte. Le verrou vise les utilisateurs connectés ; un
-- visiteur anonyme ne peut de toute façon pas modifier `profils` (RLS).
create or replace function public.role_non_modifiable_par_le_client()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.est_admin() then
    raise exception 'Le rôle ne peut être changé que par un administrateur.';
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Le compte de Rafael devient admin à sa première connexion
-- ---------------------------------------------------------------------------
-- Évite l'étape manuelle « se connecter, puis lancer un UPDATE » : quel que
-- soit le fournisseur (GitHub, Google, lien magique), cette adresse ouvre
-- directement l'administration.
create or replace function public.creer_profil_a_inscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profils (id, email, nom, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    case when lower(new.email) = 'glm07rafael@gmail.com' then 'admin'::role_utilisateur
         else 'client'::role_utilisateur end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Si le compte existe déjà (connexion faite avant cette migration).
update public.profils set role = 'admin' where lower(email) = 'glm07rafael@gmail.com';
