-- ===========================================================================
-- 0007 — Les clients de RGM Dev : portfolio, supervision et pipeline
-- ===========================================================================
--
-- Branche les quatre clients actuels (Atout Travaux, Campagne Vallauris,
-- Le K Répare, Liccia Immo) partout où l'admin en a besoin.
--
-- Rejouable : chaque insertion vérifie d'abord que la ligne n'existe pas, et
-- les fiches projet passent par `on conflict (slug)`. On peut la relancer
-- sans créer de doublon.
--
-- Rien d'inventé : prix, durée et date de livraison restent vides quand on ne
-- les connaît pas. Ils se complètent depuis /admin/realisations.

-- ---------------------------------------------------------------------------
-- Portfolio
-- ---------------------------------------------------------------------------

-- Atout Travaux a désormais son propre domaine.
update projets
set url_live = 'https://www.atout-travaux-83.fr', modifie_le = now()
where slug = 'atout-travaux';

insert into projets (
  slug, titre, client_nom, secteur, resume, probleme, solution, resultat,
  stack, url_live, url_depot, image_couverture, en_vedette, publie, ordre
) values (
  'le-k-repare',
  'Le K Répare',
  'Le K Répare',
  'Réparation téléphonie et informatique',
  'Site vitrine pour un atelier de réparation de téléphones, tablettes et ordinateurs à la Croix-Rousse, à Lyon.',
  'Une boutique de quartier très bien notée par ses clients, mais sans site : impossible de comprendre ce qu''elle répare, comment elle travaille ou comment la joindre sans passer devant la vitrine.',
  'Une page unique, rapide et lisible sur téléphone : les réparations par type d''appareil, la méthode en trois étapes (diagnostic et devis, réparation, test et remise), les avis Google, l''adresse avec la carte, un bouton d''appel toujours visible et un formulaire de contact qui arrive directement par email. Bandeau cookies conforme, avec la possibilité de continuer sans accepter.',
  null,
  array['HTML', 'Tailwind CSS', 'JavaScript', 'Vercel Functions', 'Resend'],
  null,
  null,
  '/realisations/le-k-repare.webp',
  false,
  true,
  4
)
on conflict (slug) do nothing;

-- Liccia Immo : la refonte n'est pas encore en ligne sur liccia-immo.fr (le
-- domaine sert toujours l'ancien WordPress). La fiche reste en brouillon tant
-- que la cliente n'a pas validé la mise en ligne ; un clic sur « publié » dans
-- l'admin suffit ensuite.
insert into projets (
  slug, titre, client_nom, secteur, resume, probleme, solution, resultat,
  stack, url_live, url_depot, image_couverture, en_vedette, publie, ordre
) values (
  'liccia-immo',
  'Liccia Immo',
  'Liccia Immo',
  'Immobilier',
  'Refonte complète du site d''une agence immobilière familiale à La Ciotat : vente, location, estimation et gestion locative.',
  'L''ancien site WordPress n''avait ni meta description ni données structurées, des annonces sans DPE, des photos de plusieurs mégaoctets, et des mentions légales incomplètes pour une agence (carte professionnelle, garant financier, barème d''honoraires).',
  'Un site Next.js reconstruit à partir de l''existant : mêmes adresses de pages pour ne rien perdre en référencement, identité de l''agence conservée, annonces avec DPE, GES et honoraires affichés, photos optimisées, recherche vente / location dès l''accueil, et un espace d''administration pour gérer les biens et les demandes.',
  null,
  array['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Motion', 'Supabase'],
  'https://liccia-immo.vercel.app',
  null,
  '/realisations/liccia-immo.webp',
  false,
  false,
  5
)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Supervision
-- ---------------------------------------------------------------------------

-- Atout Travaux : on surveille le vrai domaine, plus l'adresse Vercel.
update sites_supervises s
set url = 'https://www.atout-travaux-83.fr'
from projets p
where s.projet_id = p.id and p.slug = 'atout-travaux'
  and s.url <> 'https://www.atout-travaux-83.fr';

insert into sites_supervises (projet_id, nom, url, statut_attendu, seuil_lenteur_ms)
select p.id, 'Liccia Immo (refonte)', 'https://liccia-immo.vercel.app', 200, 3000
from projets p
where p.slug = 'liccia-immo'
  and not exists (select 1 from sites_supervises where url = 'https://liccia-immo.vercel.app');

-- Le K Répare n'est pas ajouté : son site ne répond plus (404 au 2026-10-08).
-- Le surveiller déclencherait une alerte immédiate sur un problème déjà connu.
-- À ajouter depuis /admin/supervision une fois le site remis en ligne.

-- ---------------------------------------------------------------------------
-- Pipeline commercial : les clients signés
-- ---------------------------------------------------------------------------

insert into prospects (entreprise, contact, email, telephone, ville, secteur, source, besoin, statut, probabilite, etiquettes)
select v.entreprise, v.contact, v.email, v.telephone, v.ville, v.secteur, 'Client existant', v.besoin, 'gagne', 100, v.etiquettes
from (values
  ('Atout Travaux', 'Atout Travaux', null, null, 'La Ciotat', 'Artisanat du bâtiment',
   'Site, demandes de devis et référencement local.', array['site', 'seo']),
  ('Campagne Vallauris', 'Campagne Vallauris', null, null, 'Vaumeilh', 'Hébergement touristique',
   'Site et réservation en direct.', array['site', 'reservation']),
  ('Le K Répare', 'Le K Répare', null, '06 59 31 72 74', 'Lyon', 'Réparation téléphonie et informatique',
   'Site vitrine. Site hors ligne au 2026-10-08 : à redéployer.', array['site']),
  ('Liccia Immo', 'Isabelle Arvin-Berod', 'licciaimmo@gmail.com', '06 32 08 31 47', 'La Ciotat', 'Immobilier',
   'Refonte du site et espace admin. Mise en ligne sur liccia-immo.fr à valider.', array['site', 'refonte'])
) as v(entreprise, contact, email, telephone, ville, secteur, besoin, etiquettes)
where not exists (select 1 from prospects p where p.entreprise = v.entreprise);
