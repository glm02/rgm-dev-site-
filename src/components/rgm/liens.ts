export const LIENS = {
  accueil: "/",
  services: "/services",
  sitesWeb: "/services/sites-web",
  automatisation: "/services/automatisation-ia",
  lyon: "/developpeur-web-lyon",
  realisations: "/realisations",
  tarifs: "/tarifs",
  avis: "/avis",
  methode: "/methode",
  blog: "/blog",
  contact: "/contact",
  espaceClient: "/compte",
  mentions: "/mentions-legales",
  confidentialite: "/confidentialite",
} as const;

export const MENU = [
  { libelle: "Réalisations", href: LIENS.realisations },
  { libelle: "Tarifs", href: LIENS.tarifs },
  { libelle: "Méthode", href: LIENS.methode },
  { libelle: "Blog", href: LIENS.blog },
] as const;

export const COLONNES_PIED = [
  {
    titre: "Services",
    liens: [
      { libelle: "Sites web", href: LIENS.sitesWeb },
      { libelle: "Automatisation IA", href: LIENS.automatisation },
      { libelle: "Développeur web à Lyon", href: LIENS.lyon },
    ],
  },
  {
    titre: "Ressources",
    liens: [
      { libelle: "Réalisations", href: LIENS.realisations },
      { libelle: "Tarifs", href: LIENS.tarifs },
      { libelle: "Avis", href: LIENS.avis },
      { libelle: "Méthode", href: LIENS.methode },
      { libelle: "Blog", href: LIENS.blog },
    ],
  },
  {
    titre: "RGM Dev",
    liens: [
      { libelle: "Contact", href: LIENS.contact },
      { libelle: "Demander un devis", href: LIENS.contact },
      { libelle: "Espace client", href: LIENS.espaceClient },
    ],
  },
  {
    titre: "Légal",
    liens: [
      { libelle: "Mentions légales", href: LIENS.mentions },
      { libelle: "Confidentialité", href: LIENS.confidentialite },
    ],
  },
] as const;
