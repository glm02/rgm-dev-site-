import { LIENS } from "./liens";

export type Outil = { nom: string; logo?: string };

export type FicheProjet = {
  sousTitre: string;
  resume: string;
  secteur: string;
  budget?: string;
  duree?: string;
  besoin: string;
  solution: string;
  resultat?: string;
  livrables: [string, string, string];
  outils: Outil[];
  apercu3d?: boolean;
  service: { libelle: string; href: string };
  suivant: string;
};

const O = {
  vercel: { nom: "Vercel", logo: "/figma/logos/vercel.svg" },
  upstash: { nom: "Upstash", logo: "/figma/logos/upstash.svg" },
  resend: { nom: "Resend", logo: "/figma/logos/resend.svg" },
  hermes: { nom: "Hermes", logo: "/figma/logos/hermes.png" },
  telegram: { nom: "Telegram", logo: "/figma/logos/telegram.svg" },
  whatsapp: { nom: "WhatsApp", logo: "/figma/logos/whatsapp.svg" },
  nextjs: { nom: "Next.js", logo: "/figma/logos/nextjs.svg" },
  supabase: { nom: "Supabase", logo: "/figma/logos/supabase.svg" },
  tailwind: { nom: "Tailwind CSS", logo: "/figma/logos/tailwind.svg" },
  stripe: { nom: "Stripe", logo: "/figma/logos/stripe.svg" },
  javascript: { nom: "JavaScript" },
} satisfies Record<string, Outil>;

const SITES_WEB = { libelle: "Sites web", href: LIENS.sitesWeb };

export const FICHES: Record<string, FicheProjet> = {
  "atout-travaux": {
    sousTitre: "Ramonage, chauffage et plomberie.",
    resume: "Un site de devis et des agents IA pour un artisan chauffagiste et ramoneur.",
    secteur: "Artisanat · La Ciotat",
    budget: "2 000 – 4 000 €",
    duree: "25 jours",
    besoin:
      "L’entreprise recevait surtout ses demandes par bouche-à-oreille. Les particuliers qui cherchaient un ramoneur ou un chauffagiste en ligne la trouvaient difficilement.",
    solution: "Chaque métier a sa page. Les demandes alimentent un back-office et les relances partent automatiquement par e-mail.",
    resultat:
      "Les clients peuvent demander un devis sur le site. L’équipe suit ces demandes au même endroit et peut préparer ses devis et interventions avec ses agents.",
    livrables: ["Pages par métier et par zone", "Formulaire et suivi des devis", "Agents pour les devis, le planning et les relances"],
    outils: [O.vercel, O.upstash, O.resend, O.hermes, O.telegram],
    apercu3d: true,
    service: { libelle: "Sites web et automatisation IA", href: LIENS.services },
    suivant: "campagne-vallauris",
  },
  "campagne-vallauris": {
    sousTitre: "Réservation directe et espace voyageur",
    resume: "Réservation directe, calendrier et espace voyageur pour un domaine de chambres d’hôtes.",
    secteur: "Hébergement · Vaumeilh",
    budget: "1 500 – 3 000 €",
    duree: "30 jours",
    besoin: "Les voyageurs réservaient via des plateformes, avec des commissions et moins de contact direct avec les hôtes.",
    solution: "Le site réunit les disponibilités, la réservation et les confirmations. Les hôtes mettent à jour les photos depuis leur espace.",
    resultat: "Une réservation prise sur le site passe directement entre les hôtes et le voyageur, sans commission de plateforme.",
    livrables: ["Calendrier des disponibilités", "Espace voyageur et confirmations automatiques", "Galerie modifiable par les hôtes"],
    outils: [O.vercel, O.resend, O.whatsapp],
    service: SITES_WEB,
    suivant: "liccia-immo",
  },
  "liccia-immo": {
    sousTitre: "Un site immobilier plus facile à parcourir",
    resume: "Refonte d’agence immobilière avec annonces, recherche et espace de gestion.",
    secteur: "Immobilier · La Ciotat",
    besoin: "Les anciennes annonces étaient difficiles à parcourir sur mobile, avec des images lourdes et des informations parfois incomplètes.",
    solution:
      "La refonte conserve les adresses des pages. La recherche vente et location arrive dès l’accueil, avec les diagnostics et honoraires dans les annonces.",
    livrables: ["Recherche vente et location", "Annonces avec diagnostics et honoraires", "Espace de gestion des biens et demandes"],
    outils: [O.nextjs, O.supabase, O.tailwind],
    service: SITES_WEB,
    suivant: "le-k-repare",
  },
  "le-k-repare": {
    sousTitre: "Un site vitrine pensé pour le téléphone",
    resume: "Site vitrine mobile pour un atelier de réparation à la Croix-Rousse.",
    secteur: "Réparation · Lyon",
    besoin: "Sans site, les clients devaient se déplacer pour découvrir les réparations proposées, la méthode ou les horaires.",
    solution:
      "Une page présente les appareils pris en charge et les étapes de réparation. Les visiteurs peuvent appeler ou envoyer une demande depuis leur téléphone.",
    livrables: ["Catalogue des réparations par appareil", "Diagnostic, réparation et test expliqués", "Appel direct, carte et formulaire"],
    outils: [O.tailwind, O.vercel, O.resend, O.javascript],
    service: SITES_WEB,
    suivant: "la-santon",
  },
  "la-santon": {
    sousTitre: "Disponibilités, réservation et paiement en ligne",
    resume: "Réservation et paiement en ligne pour une maison d’hôtes et ses gîtes.",
    secteur: "Hébergement · Vif",
    besoin: "Le site ne montrait ni les disponibilités ni les options de réservation. Les séjours passaient surtout par les plateformes.",
    solution:
      "Les voyageurs choisissent leurs dates, paient en ligne et retrouvent leur séjour dans leur compte. Les hôtes gèrent les réservations depuis leur espace.",
    livrables: ["Calendrier synchronisé via iCal", "Paiement et confirmation en ligne", "Gestion des séjours, des photos et des statistiques"],
    outils: [O.vercel, O.stripe, O.resend, O.whatsapp],
    service: SITES_WEB,
    suivant: "atout-travaux",
  },
};
