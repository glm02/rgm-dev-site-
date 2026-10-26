-- RGM Dev — données de départ
--
-- Ce que contient ce fichier : les services, les offres et les réalisations.
-- Ce qu'il ne contient pas : des avis clients. Un témoignage affiché est un
-- vrai témoignage — ils s'ajoutent depuis l'espace admin quand ils existent.
--
-- ⚠️ LES PRIX SONT À RELIRE. Ce sont des fourchettes plausibles pour un
-- freelance sur Lyon, pas les tarifs de Rafael. Ils s'ajustent depuis
-- /admin/offres avant la mise en ligne.

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------

insert into services (slug, titre, accroche, description, icone, image, ordre, seo_titre, seo_description) values
(
  'sites-web',
  'Création de sites web',
  'Un site rapide, trouvable sur Google, et que vous pouvez modifier vous-même.',
  'Site vitrine, e-commerce, application métier ou refonte. Je conçois, je développe et je mets en ligne — puis je vous laisse un back-office pour que vous ne dépendiez de personne au quotidien. Rendu serveur, temps de chargement mesurés, référencement local travaillé dès la structure des pages.',
  'layout-template',
  '/images/creation-sites-web.jpg',
  1,
  'Création de site web à Lyon — développeur freelance',
  'Développeur freelance à Lyon : sites vitrines, e-commerce et applications métier. Site rapide, référencé, avec back-office. Devis sous 48 h.'
),
(
  'automatisation-ia',
  'Automatisation et agents IA',
  'Les tâches qui vous prennent des heures chaque semaine peuvent disparaître.',
  'Je repère les tâches longues et répétitives de votre entreprise — relances, devis, saisie, reporting, tri des mails, réponses clients — et je les automatise avec des agents IA et des workflows n8n branchés sur vos outils existants. On commence par un audit : ce qui prend du temps, combien, et ce qui est automatisable pour de vrai.',
  'bot',
  '/images/automatisation-ia.jpg',
  2,
  'Automatisation IA pour entreprises à Lyon',
  'Agents IA et workflows n8n pour automatiser les tâches répétitives de votre entreprise. Audit, mise en place et suivi. Freelance à Lyon.'
),
(
  'maintenance-supervision',
  'Maintenance et supervision',
  'Votre site est surveillé. Si quelque chose casse, je le sais avant vous.',
  'Contrôle automatique de la disponibilité, du temps de réponse et du certificat TLS. Alerte immédiate en cas de problème, mises à jour de sécurité, sauvegardes, petites évolutions incluses. Un forfait mensuel, sans engagement long.',
  'activity',
  '/images/supervision.jpg',
  3,
  'Maintenance de site web à Lyon',
  'Supervision 24/7, mises à jour de sécurité, sauvegardes et évolutions. Forfait mensuel sans engagement.'
);

-- ---------------------------------------------------------------------------
-- Offres — ⚠️ fourchettes à valider par Rafael
-- ---------------------------------------------------------------------------

insert into offres (service_id, nom, description, prix_min, prix_max, unite, delai, inclus, en_vedette, ordre)
select id, 'Site vitrine',
  'Pour une entreprise qui a besoin d''exister sur Google et de recevoir des demandes.',
  1500, 3000, 'forfait', '2 à 3 semaines',
  array[
    'Jusqu''à 8 pages',
    'Design sur mesure, pas un thème',
    'Référencement local (Lyon et alentours)',
    'Formulaire de contact et de devis',
    'Back-office pour modifier les textes',
    'Hébergement la première année'
  ], false, 1
from services where slug = 'sites-web';

insert into offres (service_id, nom, description, prix_min, prix_max, unite, delai, inclus, en_vedette, ordre)
select id, 'Site sur mesure',
  'Réservation, catalogue, espace client, connexion à vos outils — dès que le site doit faire quelque chose.',
  3500, 9000, 'forfait', '4 à 8 semaines',
  array[
    'Cahier des charges et maquettes',
    'Fonctionnalités métier sur mesure',
    'Espace client ou back-office complet',
    'Base de données et comptes utilisateurs',
    'Connexion à vos outils existants',
    'Formation à la prise en main'
  ], true, 2
from services where slug = 'sites-web';

insert into offres (service_id, nom, description, prix_min, prix_max, unite, delai, inclus, en_vedette, ordre)
select id, 'Refonte',
  'Le site existe mais il est lent, illisible sur mobile, ou invisible sur Google.',
  2000, 5000, 'forfait', '3 à 5 semaines',
  array[
    'Audit technique et SEO de l''existant',
    'Reprise du contenu sans perdre le référencement',
    'Redirections des anciennes URL',
    'Nouveau design, mobile d''abord',
    'Gains de vitesse mesurés avant / après'
  ], false, 3
from services where slug = 'sites-web';

insert into offres (service_id, nom, description, prix_min, prix_max, unite, delai, inclus, en_vedette, ordre)
select id, 'Audit d''automatisation',
  'Deux jours pour cartographier ce qui vous coûte du temps et chiffrer ce qui peut être automatisé.',
  600, 900, 'forfait', '1 semaine',
  array[
    'Entretiens avec vos équipes',
    'Cartographie des tâches répétitives',
    'Estimation du temps récupérable',
    'Plan d''automatisation chiffré et priorisé',
    'Déduit du projet si vous le lancez'
  ], false, 1
from services where slug = 'automatisation-ia';

insert into offres (service_id, nom, description, prix_min, prix_max, unite, delai, inclus, en_vedette, ordre)
select id, 'Automatisation d''un processus',
  'Un processus complet, de bout en bout, mis en production et documenté.',
  1200, 4000, 'forfait', '2 à 4 semaines',
  array[
    'Workflow n8n ou agent IA sur mesure',
    'Connexion à vos outils (mail, CRM, tableur, ERP)',
    'Tableau de bord de suivi',
    'Documentation et passation',
    'Un mois d''ajustements inclus'
  ], true, 2
from services where slug = 'automatisation-ia';

insert into offres (service_id, nom, description, prix_min, prix_max, unite, delai, inclus, en_vedette, ordre)
select id, 'Agent IA sur mesure',
  'Un assistant branché sur vos données, qui répond, qualifie ou rédige à votre place.',
  2500, 8000, 'forfait', '4 à 6 semaines',
  array[
    'Agent connecté à vos documents et à vos outils',
    'Garde-fous et validation humaine là où il en faut',
    'Interface web ou intégration Telegram / WhatsApp / mail',
    'Suivi des coûts d''usage',
    'Trois mois de suivi'
  ], false, 3
from services where slug = 'automatisation-ia';

insert into offres (service_id, nom, description, prix_min, prix_max, unite, delai, inclus, en_vedette, ordre)
select id, 'Sérénité',
  'Le site tourne, il est surveillé, et il évolue un peu chaque mois.',
  90, 250, 'mois', 'sans engagement',
  array[
    'Supervision 24/7 et alerte immédiate',
    'Mises à jour de sécurité',
    'Sauvegardes quotidiennes',
    'Une heure d''évolutions par mois',
    'Rapport mensuel de fréquentation'
  ], false, 1
from services where slug = 'maintenance-supervision';

-- ---------------------------------------------------------------------------
-- Réalisations
-- ---------------------------------------------------------------------------
-- Les captures d'écran sont des vraies : elles ont été prises sur les sites en
-- production et vivent dans `public/realisations/`. Socle n'en a pas, son
-- déploiement ayant été retiré.
--
-- Les fourchettes de prix sont indicatives, à corriger d'après les vrais devis.

insert into projets (
  slug, titre, client_nom, secteur, resume, probleme, solution, resultat,
  stack, url_live, image_couverture, prix_min, prix_max, duree_jours,
  en_vedette, publie, ordre
) values
(
  'atout-travaux',
  'Atout Travaux',
  'Atout Travaux',
  'Artisanat du bâtiment',
  'Site et moteur de demandes de devis pour un artisan chauffagiste-ramoneur installé à La Ciotat depuis 1984.',
  'Une entreprise familiale de quarante ans, invisible sur Google là où ses clients la cherchent : « ramonage La Ciotat », « chaudière Aubagne ». Les demandes arrivaient par le bouche-à-oreille uniquement.',
  'Un site volontairement sans framework — du HTML, du CSS et du JavaScript lisibles, qui resteront modifiables dans cinq ans. Une page par métier, un blog généré à partir de fragments, des données structurées, et un back-office de suivi des demandes. Relances par email automatisées via un cron quotidien.',
  'Le site se charge quasi instantanément et chaque métier a sa page indexée. Les demandes de devis arrivent désormais par le site.',
  array['HTML', 'CSS', 'JavaScript', 'Vercel Functions', 'Upstash Redis', 'Resend'],
  'https://atout-travaux.vercel.app',
  '/realisations/atout-travaux.webp',
  1500, 3000, 25, true, true, 1
),
(
  'campagne-vallauris',
  'Campagne Vallauris',
  'Campagne Vallauris',
  'Hébergement touristique',
  'Site et moteur de réservation en direct pour des chambres d''hôtes et un gîte familial, à Vaumeilh près de Sisteron.',
  'Les réservations passaient par les plateformes, qui prennent leur commission et s''intercalent entre les hôtes et leurs voyageurs. Une ancienne ferme restaurée dans les Alpes-de-Haute-Provence méritait mieux qu''une fiche standardisée parmi des milliers.',
  'Un site de réservation en direct : calendrier de disponibilités, espace « Mon compte » pour les voyageurs, galerie alimentée depuis le back-office, emails de confirmation automatiques et contact WhatsApp. Les hôtes gèrent tout eux-mêmes, sans intermédiaire.',
  'Les réservations en direct ne passent plus par une commission, et le domaine a enfin un site à la hauteur du lieu.',
  array['HTML', 'JavaScript', 'Vercel KV', 'Vercel Blob', 'Nodemailer', 'Resend'],
  'https://www.campagne-vallauris.fr',
  '/realisations/campagne-vallauris.webp',
  2000, 4000, 30, true, true, 2
),
(
  'socle',
  'Socle',
  'Projet interne',
  'Data et énergie',
  'Cartographie ouverte du foncier raccordable en France : où peut-on encore brancher un data center de 100 MW ?',
  'Le facteur limitant d''un data center d''IA n''est plus le silicium, c''est le mégawatt. Mais la donnée de raccordement est éclatée entre quatre sources publiques incompatibles.',
  'Croisement de quatre jeux de données publiques, calcul de la distance de chaque friche industrielle au poste 225 kV le plus proche, et score explicite sur quatre critères pondérés. Carte choroplèthe par département et classement filtrable de près de 3 000 sites.',
  'Une liste courte de sites candidats, avec le détail du score et les limites de la méthode affichées franchement.',
  array['Next.js', 'React', 'TypeScript', 'Supabase', 'visx', 'Tailwind CSS'],
  -- Le déploiement a été retiré : mieux vaut pas de lien qu'un lien mort.
  null,
  null,
  null, null, 40, true, true, 3
),
(
  'boreal',
  'Boréal',
  'Boréal',
  'Événementiel',
  'Site événementiel.',
  null,
  null,
  null,
  array['HTML', 'CSS', 'JavaScript'],
  null,
  null,
  null, null, null, false, false, 4
);

-- ---------------------------------------------------------------------------
-- Supervision — les sites déjà en production
-- ---------------------------------------------------------------------------

insert into sites_supervises (projet_id, nom, url, statut_attendu, seuil_lenteur_ms)
select id, titre, url_live, 200, 3000
from projets
where url_live is not null;
