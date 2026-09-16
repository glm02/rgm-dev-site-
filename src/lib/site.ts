/**
 * Les constantes du site : identité, contact, navigation.
 *
 * Un seul endroit, parce que ces valeurs se répètent partout — entête, pied de
 * page, balises méta, JSON-LD, emails. Les voir diverger entre deux fichiers
 * est une erreur qu'on ne remarque que quand un client appelle le mauvais
 * numéro.
 */

export const SITE = {
  nom: "RGM Dev",
  slogan: "Développeur freelance à Lyon",
  /**
   * La promesse du site, en une phrase. Sert de `description` par défaut et
   * de résumé partout où il en faut un.
   */
  promesse:
    "Sites web et automatisation IA pour les entreprises de Lyon et de la région. Les prix sont affichés, les réalisations aussi.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
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
