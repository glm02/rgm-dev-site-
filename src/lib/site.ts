/**
 * Les constantes du site : identité, contact, navigation.
 *
 * Un seul endroit, parce que ces valeurs se répètent partout — entête, pied de
 * page, balises méta, JSON-LD, emails. Les voir diverger entre deux fichiers
 * est une erreur qu'on ne remarque que quand un client appelle le mauvais
 * numéro.
 */

/**
 * L'URL canonique du site.
 *
 * Attention au piège : Next remplace `process.env.NEXT_PUBLIC_*` par sa valeur
 * littérale au build, et une variable absente devient la **chaîne vide**, pas
 * `undefined`. Un `??` ne la rattrape donc pas, et `new URL("")` fait échouer
 * tout le build — c'est exactement ce qui est arrivé au premier déploiement
 * Vercel. On teste le contenu, pas la nullité.
 */
function urlDuSite(): string {
  const explicite = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicite) return explicite.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;

  // Les déploiements de prévisualisation n'ont que celle-ci.
  const apercu = process.env.VERCEL_URL?.trim();
  if (apercu) return `https://${apercu}`;

  return "http://localhost:3000";
}

export const SITE = {
  nom: "RGM Dev",
  slogan: "Développeur freelance à Lyon",
  /**
   * La promesse du site, en une phrase. Sert de `description` par défaut et
   * de résumé partout où il en faut un.
   */
  promesse:
    "Sites web et automatisation IA pour les entreprises de Lyon et de la région. Les prix sont affichés, les réalisations aussi.",
  url: urlDuSite(),
  email: "glm07rafael@gmail.com",
  ville: "Lyon",
  region: "Auvergne-Rhône-Alpes",
  pays: "FR",
  /** Rayon d'intervention affiché, en km autour de Lyon. */
  rayonKm: 80,
  github: "https://github.com/glm02",
} as const;

export const NAVIGATION = [
  { libelle: "Services", href: "/services" },
  { libelle: "Réalisations", href: "/realisations" },
  { libelle: "Tarifs", href: "/tarifs" },
  { libelle: "Avis", href: "/avis" },
  { libelle: "Contact", href: "/contact" },
] as const;

export const NAVIGATION_PIED = {
  Services: [
    { libelle: "Création de sites web", href: "/services/sites-web" },
    { libelle: "Automatisation et agents IA", href: "/services/automatisation-ia" },
    { libelle: "Maintenance et supervision", href: "/services/maintenance-supervision" },
  ],
  Découvrir: [
    { libelle: "Réalisations", href: "/realisations" },
    { libelle: "Tarifs", href: "/tarifs" },
    { libelle: "Avis clients", href: "/avis" },
    { libelle: "Blog", href: "/blog" },
  ],
  Compte: [
    { libelle: "Espace client", href: "/compte" },
    { libelle: "Connexion", href: "/connexion" },
    { libelle: "Demander un devis", href: "/contact" },
  ],
  Légal: [
    { libelle: "Mentions légales", href: "/mentions-legales" },
    { libelle: "Confidentialité", href: "/confidentialite" },
  ],
} as const;

/**
 * Les villes visées par le référencement local.
 *
 * Elles apparaissent dans la zone de chalandise du JSON-LD et dans le pied de
 * page. Rester honnête : ce sont des villes où Rafael intervient réellement,
 * pas une liste de mots-clés.
 */
export const VILLES = [
  "Lyon",
  "Villeurbanne",
  "Vénissieux",
  "Caluire-et-Cuire",
  "Bron",
  "Saint-Priest",
  "Vaulx-en-Velin",
  "Écully",
  "Oullins",
  "Givors",
] as const;
