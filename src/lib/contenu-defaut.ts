import type { Avis, Offre, Projet, Service } from "./types";

/**
 * Le contenu du site avant Supabase.
 *
 * Pourquoi ce fichier existe : le projet Supabase n'est pas encore créé. Sans
 * repli, toutes les pages seraient vides et on ne pourrait ni juger le design
 * ni déployer. Ce contenu est le miroir exact de
 * `supabase/migrations/0003_donnees_initiales.sql` — si l'un change, l'autre
 * change.
 *
 * Ce n'est pas du faux contenu : ce sont les vrais projets de Rafael. En
 * revanche il n'y a **aucun avis** ici, et c'est délibéré : un témoignage
 * affiché doit être un vrai témoignage. Ils arriveront par l'admin.
 *
 * Le jour où Supabase répond, `donnees.ts` cesse de lire ce fichier. Il pourra
 * alors être supprimé.
 */

const idFactice = (prefixe: string, n: number) => `${prefixe}-defaut-${n}`;

export const SERVICES_DEFAUT: Service[] = [
  {
    id: idFactice("service", 1),
    slug: "sites-web",
    titre: "Création de sites web",
    accroche:
      "Un site rapide, trouvable sur Google, et que vous pouvez modifier vous-même.",
    description:
      "Site vitrine, e-commerce, application métier ou refonte. Je conçois, je développe et je mets en ligne — puis je vous laisse un back-office pour que vous ne dépendiez de personne au quotidien. Rendu serveur, temps de chargement mesurés, référencement local travaillé dès la structure des pages.",
    icone: "layout-template",
    image: "/images/creation-sites-web.jpg",
    ordre: 1,
    actif: true,
    seo_titre: "Création de site web à Lyon — développeur freelance",
    seo_description:
      "Développeur freelance à Lyon : sites vitrines, e-commerce et applications métier. Site rapide, référencé, avec back-office. Devis sous 48 h.",
  },
  {
    id: idFactice("service", 2),
    slug: "automatisation-ia",
    titre: "Automatisation et agents IA",
    accroche:
      "Les tâches qui vous prennent des heures chaque semaine peuvent disparaître.",
    description:
      "Je repère les tâches longues et répétitives de votre entreprise — relances, devis, saisie, reporting, tri des mails, réponses clients — et je les automatise avec des agents IA et des workflows n8n branchés sur vos outils existants. On commence par un audit : ce qui prend du temps, combien, et ce qui est automatisable pour de vrai.",
    icone: "bot",
    image: "/images/automatisation-ia.jpg",
    ordre: 2,
    actif: true,
    seo_titre: "Automatisation IA pour entreprises à Lyon",
    seo_description:
      "Agents IA et workflows n8n pour automatiser les tâches répétitives de votre entreprise. Audit, mise en place et suivi. Freelance à Lyon.",
  },
  {
    id: idFactice("service", 3),
    slug: "maintenance-supervision",
    titre: "Maintenance et supervision",
    accroche:
      "Votre site est surveillé. Si quelque chose casse, je le sais avant vous.",
    description:
      "Contrôle automatique de la disponibilité, du temps de réponse et du certificat TLS. Alerte immédiate en cas de problème, mises à jour de sécurité, sauvegardes, petites évolutions incluses. Un forfait mensuel, sans engagement long.",
    icone: "activity",
    image: "/images/supervision.jpg",
    ordre: 3,
    actif: true,
    seo_titre: "Maintenance de site web à Lyon",
    seo_description:
      "Supervision 24/7, mises à jour de sécurité, sauvegardes et évolutions. Forfait mensuel sans engagement.",
  },
];

/** ⚠️ Fourchettes indicatives, à valider par Rafael avant la mise en ligne. */
export const OFFRES_DEFAUT: Offre[] = [
  {
    id: idFactice("offre", 1),
    service_id: SERVICES_DEFAUT[0].id,
    nom: "Site vitrine",
    description:
      "Pour une entreprise qui a besoin d'exister sur Google et de recevoir des demandes.",
    prix_min: 1500,
    prix_max: 3000,
    unite: "forfait",
    delai: "2 à 3 semaines",
    inclus: [
      "Jusqu'à 8 pages",
      "Design sur mesure, pas un thème",
      "Référencement local (Lyon et alentours)",
      "Formulaire de contact et de devis",
      "Back-office pour modifier les textes",
      "Hébergement la première année",
    ],
    en_vedette: false,
    ordre: 1,
    actif: true,
  },
  {
    id: idFactice("offre", 2),
    service_id: SERVICES_DEFAUT[0].id,
    nom: "Site sur mesure",
    description:
      "Réservation, catalogue, espace client, connexion à vos outils — dès que le site doit faire quelque chose.",
    prix_min: 3500,
    prix_max: 9000,
    unite: "forfait",
    delai: "4 à 8 semaines",
    inclus: [
      "Cahier des charges et maquettes",
      "Fonctionnalités métier sur mesure",
      "Espace client ou back-office complet",
      "Base de données et comptes utilisateurs",
      "Connexion à vos outils existants",
      "Formation à la prise en main",
    ],
    en_vedette: true,
    ordre: 2,
    actif: true,
  },
  {
    id: idFactice("offre", 3),
    service_id: SERVICES_DEFAUT[0].id,
    nom: "Refonte",
    description:
      "Le site existe mais il est lent, illisible sur mobile, ou invisible sur Google.",
    prix_min: 2000,
    prix_max: 5000,
    unite: "forfait",
    delai: "3 à 5 semaines",
    inclus: [
      "Audit technique et SEO de l'existant",
      "Reprise du contenu sans perdre le référencement",
      "Redirections des anciennes URL",
      "Nouveau design, mobile d'abord",
      "Gains de vitesse mesurés avant / après",
    ],
    en_vedette: false,
    ordre: 3,
    actif: true,
  },
  {
    id: idFactice("offre", 4),
    service_id: SERVICES_DEFAUT[1].id,
    nom: "Audit d'automatisation",
    description:
      "Deux jours pour cartographier ce qui vous coûte du temps et chiffrer ce qui peut être automatisé.",
    prix_min: 600,
    prix_max: 900,
    unite: "forfait",
    delai: "1 semaine",
    inclus: [
      "Entretiens avec vos équipes",
      "Cartographie des tâches répétitives",
      "Estimation du temps récupérable",
      "Plan d'automatisation chiffré et priorisé",
      "Déduit du projet si vous le lancez",
    ],
    en_vedette: false,
    ordre: 1,
    actif: true,
  },
  {
    id: idFactice("offre", 5),
    service_id: SERVICES_DEFAUT[1].id,
    nom: "Automatisation d'un processus",
    description:
      "Un processus complet, de bout en bout, mis en production et documenté.",
    prix_min: 1200,
    prix_max: 4000,
    unite: "forfait",
    delai: "2 à 4 semaines",
    inclus: [
      "Workflow n8n ou agent IA sur mesure",
      "Connexion à vos outils (mail, CRM, tableur, ERP)",
      "Tableau de bord de suivi",
      "Documentation et passation",
      "Un mois d'ajustements inclus",
    ],
    en_vedette: true,
    ordre: 2,
    actif: true,
  },
  {
    id: idFactice("offre", 6),
    service_id: SERVICES_DEFAUT[1].id,
    nom: "Agent IA sur mesure",
    description:
      "Un assistant branché sur vos données, qui répond, qualifie ou rédige à votre place.",
    prix_min: 2500,
    prix_max: 8000,
    unite: "forfait",
    delai: "4 à 6 semaines",
    inclus: [
      "Agent connecté à vos documents et à vos outils",
      "Garde-fous et validation humaine là où il en faut",
      "Interface web ou intégration Telegram / WhatsApp / mail",
      "Suivi des coûts d'usage",
      "Trois mois de suivi",
    ],
    en_vedette: false,
    ordre: 3,
    actif: true,
  },
  {
    id: idFactice("offre", 7),
    service_id: SERVICES_DEFAUT[2].id,
    nom: "Sérénité",
    description:
      "Le site tourne, il est surveillé, et il évolue un peu chaque mois.",
    prix_min: 90,
    prix_max: 250,
    unite: "mois",
    delai: "sans engagement",
    inclus: [
      "Supervision 24/7 et alerte immédiate",
      "Mises à jour de sécurité",
      "Sauvegardes quotidiennes",
      "Une heure d'évolutions par mois",
      "Rapport mensuel de fréquentation",
    ],
    en_vedette: false,
    ordre: 1,
    actif: true,
  },
];

export const PROJETS_DEFAUT: Projet[] = [
  {
    id: idFactice("projet", 1),
    slug: "atout-travaux",
    titre: "Atout Travaux",
    client_nom: "Atout Travaux",
    secteur: "Artisanat du bâtiment",
    resume:
      "Site et moteur de demandes de devis pour un artisan chauffagiste-ramoneur installé à La Ciotat depuis 1984.",
    probleme:
      "Une entreprise familiale de quarante ans, invisible sur Google là où ses clients la cherchent : « ramonage La Ciotat », « chaudière Aubagne ». Les demandes arrivaient par le bouche-à-oreille uniquement.",
    solution:
      "Un site volontairement sans framework — du HTML, du CSS et du JavaScript lisibles, qui resteront modifiables dans cinq ans. Une page par métier, un blog généré à partir de fragments, des données structurées, et un back-office de suivi des demandes. Relances par email automatisées via un cron quotidien.",
    resultat:
      "Le site se charge quasi instantanément et chaque métier a sa page indexée. Les demandes de devis arrivent désormais par le site.",
    stack: ["HTML", "CSS", "JavaScript", "Vercel Functions", "Upstash Redis", "Resend"],
    url_live: "https://atout-travaux.vercel.app",
    url_depot: null,
    image_couverture: "/realisations/atout-travaux.webp",
    images: [],
    prix_min: 1500,
    prix_max: 3000,
    duree_jours: 25,
    livre_le: null,
    en_vedette: true,
    publie: true,
    ordre: 1,
    seo_titre: null,
    seo_description: null,
  },
  {
    id: idFactice("projet", 2),
    slug: "campagne-vallauris",
    titre: "Campagne Vallauris",
    client_nom: "Campagne Vallauris",
    secteur: "Hébergement touristique",
    resume:
      "Site et moteur de réservation en direct pour des chambres d'hôtes et un gîte familial, à Vaumeilh près de Sisteron.",
    probleme:
      "Les réservations passaient par les plateformes, qui prennent leur commission et s'intercalent entre les hôtes et leurs voyageurs. Une ancienne ferme restaurée dans les Alpes-de-Haute-Provence méritait mieux qu'une fiche standardisée parmi des milliers.",
    solution:
      "Un site de réservation en direct : calendrier de disponibilités, espace « Mon compte » pour les voyageurs, galerie alimentée depuis le back-office, emails de confirmation automatiques et contact WhatsApp. Les hôtes gèrent tout eux-mêmes, sans intermédiaire.",
    resultat:
      "Les réservations en direct ne passent plus par une commission, et le domaine a enfin un site à la hauteur du lieu.",
    stack: ["HTML", "JavaScript", "Vercel KV", "Vercel Blob", "Nodemailer", "Resend"],
    url_live: "https://www.campagne-vallauris.fr",
    url_depot: null,
    image_couverture: "/realisations/campagne-vallauris.webp",
    images: [],
    prix_min: 2000,
    prix_max: 4000,
    duree_jours: 30,
    livre_le: null,
    en_vedette: true,
    publie: true,
    ordre: 2,
    seo_titre: null,
    seo_description: null,
  },
  {
    id: idFactice("projet", 3),
    slug: "socle",
    titre: "Socle",
    client_nom: "Projet interne",
    secteur: "Data et énergie",
    resume:
      "Cartographie ouverte du foncier raccordable en France : où peut-on encore brancher un data center de 100 MW ?",
    probleme:
      "Le facteur limitant d'un data center d'IA n'est plus le silicium, c'est le mégawatt. Mais la donnée de raccordement est éclatée entre quatre sources publiques incompatibles.",
    solution:
      "Croisement de quatre jeux de données publiques, calcul de la distance de chaque friche industrielle au poste 225 kV le plus proche, et score explicite sur quatre critères pondérés. Carte choroplèthe par département et classement filtrable de près de 3 000 sites.",
    resultat:
      "Une liste courte de sites candidats, avec le détail du score et les limites de la méthode affichées franchement.",
    stack: ["Next.js", "React", "TypeScript", "Supabase", "visx", "Tailwind CSS"],
    // Le déploiement a été retiré (l'ancienne adresse renvoie une 404). Mieux
    // vaut pas de lien qu'un lien mort sur une page de portfolio.
    url_live: null,
    url_depot: null,
    image_couverture: null,
    images: [],
    prix_min: null,
    prix_max: null,
    duree_jours: 40,
    livre_le: null,
    en_vedette: true,
    publie: true,
    ordre: 3,
    seo_titre: null,
    seo_description: null,
  },
];

/**
 * Vide, et ça reste vide.
 *
 * Inventer un témoignage pour remplir la page serait le seul mensonge visible
 * du site. Tant qu'il n'y a pas de vrai avis, la section le dit et propose au
 * visiteur de regarder les réalisations à la place.
 */
export const AVIS_DEFAUT: Avis[] = [];
