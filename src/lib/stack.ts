import "server-only";

import {
  siAnthropic,
  siArduino,
  siBaseui,
  siBlender,
  siBrevo,
  siCaddy,
  siClaude,
  siCloudflare,
  siContabo,
  siCss,
  siDocker,
  siElevenlabs,
  siEslint,
  siEspressif,
  siFigma,
  siGit,
  siGithub,
  siGmail,
  siGnubash,
  siGoogle,
  siGoogleanalytics,
  siGooglecalendar,
  siGooglechrome,
  siGooglecloud,
  siGoogledrive,
  siGooglemaps,
  siGooglephotos,
  siGooglesearchconsole,
  siGooglesheets,
  siGsap,
  siHtml5,
  siIntel,
  siJavascript,
  siKicad,
  siLetsencrypt,
  siLinear,
  siLucide,
  siMarkdown,
  siMeta,
  siModelcontextprotocol,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siNpm,
  siObsidian,
  siPostgresql,
  siPython,
  siRadixui,
  siReact,
  siResend,
  siShadcnui,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTelegram,
  siThreedotjs,
  siTiktok,
  siTypescript,
  siUbuntu,
  siUpstash,
  siUptimekuma,
  siVercel,
  siVite,
  siWhatsapp,
  siZod,
  type SimpleIcon,
} from "simple-icons";

import { siOpenai, siPlaywright, siSlack } from "@/lib/logos-supplementaires";

/**
 * Le contenu de la page « Ma stack » : ce que j'utilise réellement, et
 * comment les agents IA s'en servent.
 *
 * Règle d'honnêteté : rien ici n'est décoratif. Chaque outil apparaît parce
 * que je m'en sers ; pas de logo ajouté pour remplir une grille. Les logos
 * viennent de Simple Icons, ou du compte officiel de la marque quand elle n'y
 * figure pas (`public/logos/`).
 */

export type Outil = {
  nom: string;
  usage: string;
  icone?: SimpleIcon;
  /** Logo officiel en image, quand la marque n'est pas dans Simple Icons. */
  image?: string;
  /** Dernier recours, sans logo disponible. */
  monogramme?: string;
};

const ORCA: Omit<Outil, "usage"> = { nom: "Orca", image: "/logos/orca.png" };
const HERMES_AGENT: Omit<Outil, "usage"> = { nom: "Hermes Agent", image: "/logos/hermes.png" };
const HYPERFRAMES: Omit<Outil, "usage"> = { nom: "HyperFrames", image: "/logos/hyperframes.png" };

export const DEPOT_SKILLS = "https://github.com/glm02/skills-claude-code";

export const CHIFFRES = [
  { valeur: "40", libelle: "skills écrites" },
  { valeur: "56", libelle: "skills d'agents en production" },
  { valeur: "6", libelle: "étapes vérifiées" },
] as const;

export const REGLES = [
  {
    titre: "Rien n'est annoncé sans preuve",
    texte: "Capture, test ou mesure à chaque fin de tâche.",
  },
  {
    titre: "Aucun secret dans la conversation",
    texte: "Les clés se posent par saisie masquée. L'agent ne les voit jamais.",
  },
  {
    titre: "L'humain valide ce qui sort",
    texte: "Email client, dépense, suppression : l'agent prépare, je décide.",
  },
] as const;

/** Le tuto : le parcours d'une demande, du brief à la production. */
export const ETAPES_AGENTS: {
  numero: string;
  titre: string;
  texte: string;
  outils: Outil[];
}[] = [
  {
    numero: "01",
    titre: "Le brief",
    texte: "Un AGENTS.md par dépôt : quoi, pour qui, avec quoi. Chaque agent le lit d'abord.",
    outils: [
      { nom: "GitHub", icone: siGithub, usage: "" },
      { nom: "Claude Code", icone: siClaude, usage: "" },
    ],
  },
  {
    numero: "02",
    titre: "Le découpage",
    texte: "Orca répartit le chantier entre Claude et Codex, chacun sur sa branche. Je relis, je fusionne.",
    outils: [
      { ...ORCA, usage: "" },
      { nom: "Codex", icone: siOpenai, usage: "" },
      { nom: "Git", icone: siGit, usage: "" },
    ],
  },
  {
    numero: "03",
    titre: "Les skills",
    texte: "L'agent suit la procédure écrite : étapes, pièges connus, preuve attendue.",
    outils: [
      { nom: "Skills Claude", icone: siClaude, usage: "" },
      { nom: "Obsidian", icone: siObsidian, usage: "" },
    ],
  },
  {
    numero: "04",
    titre: "La preuve",
    texte: "Build, tests, captures téléphone et ordinateur. Pentest léger avant livraison.",
    outils: [
      { nom: "Playwright", icone: siPlaywright, usage: "" },
      { nom: "ESLint", icone: siEslint, usage: "" },
    ],
  },
  {
    numero: "05",
    titre: "La livraison",
    texte: "Poussé, déployé, vérifié en ligne. Le lien arrive sur Telegram.",
    outils: [
      { nom: "Vercel", icone: siVercel, usage: "" },
      { nom: "Telegram", icone: siTelegram, usage: "" },
    ],
  },
  {
    numero: "06",
    titre: "La production",
    texte: "Les agents Hermes prennent le relais chez le client. La supervision veille.",
    outils: [
      { ...HERMES_AGENT, usage: "" },
      { nom: "Google Cloud", icone: siGooglecloud, usage: "" },
      { nom: "Uptime Kuma", icone: siUptimekuma, usage: "" },
    ],
  },
];

export const HERMES = [
  { titre: "Sur Telegram", texte: "Chaque collaborateur parle à son agent depuis son téléphone." },
  { titre: "Branché sur Google", texte: "OAuth Google Cloud et pont MCP : l'agent pose les rendez-vous." },
  { titre: "56 skills métier", texte: "Devis, planning, relances, comptes rendus : écrits pour le métier." },
  { titre: "Cloisonné", texte: "Une instance par client, des outils en liste blanche." },
] as const;

export const TELEGRAM = [
  { titre: "Livraison", texte: "Vidéos, liens et captures arrivent dès qu'ils sont prêts." },
  { titre: "Supervision", texte: "Site en panne, certificat expiré : alerte immédiate et résumé du matin." },
  { titre: "Agents et objets", texte: "Les agents Hermes y répondent, les ESP32 y envoient leurs mesures." },
] as const;

export const CATEGORIES_STACK: { titre: string; texte: string; outils: Outil[] }[] = [
  {
    titre: "IA et agents",
    texte: "",
    outils: [
      { nom: "Claude Code", icone: siClaude, usage: "Environnement principal" },
      { nom: "API Claude", icone: siAnthropic, usage: "Agents sur mesure" },
      { nom: "Codex", icone: siOpenai, usage: "Sous-agents" },
      { ...ORCA, usage: "Orchestration" },
      { ...HERMES_AGENT, usage: "Agents en production" },
      { nom: "MCP", icone: siModelcontextprotocol, usage: "Agents ↔ outils" },
      { nom: "n8n", icone: siN8n, usage: "Workflows" },
      { nom: "ElevenLabs", icone: siElevenlabs, usage: "Voix off" },
      { nom: "Higgsfield", image: "/logos/higgsfield.png", usage: "Images et vidéos IA" },
    ],
  },
  {
    titre: "Bibliothèques de composants",
    texte: "",
    outils: [
      { nom: "shadcn/ui", icone: siShadcnui, usage: "Base des composants" },
      { nom: "Appica UI", image: "/logos/appica.png", usage: "Composants et effets" },
      { nom: "Spell UI", image: "/logos/spell.png", usage: "Effets d'interface" },
      { nom: "Base UI", icone: siBaseui, usage: "Primitives" },
      { nom: "Radix UI", icone: siRadixui, usage: "Primitives" },
      { nom: "21st.dev", image: "/logos/21st.png", usage: "Composants" },
      { nom: "Bklit UI", image: "/logos/bklit.png", usage: "Graphiques" },
    ],
  },
  {
    titre: "Interface",
    texte: "",
    outils: [
      { nom: "Next.js", icone: siNextdotjs, usage: "Rendu serveur" },
      { nom: "React", icone: siReact, usage: "React 19" },
      { nom: "TypeScript", icone: siTypescript, usage: "Strict" },
      { nom: "Tailwind CSS", icone: siTailwindcss, usage: "v4" },
      { nom: "Vite", icone: siVite, usage: "Back-offices" },
      { nom: "Motion", image: "/logos/motion.png", usage: "Animations" },
      { nom: "GSAP", icone: siGsap, usage: "Animations vidéo" },
      { nom: "Three.js", icone: siThreedotjs, usage: "3D" },
      { nom: "Zod", icone: siZod, usage: "Validation" },
      { nom: "Lucide", icone: siLucide, usage: "Icônes" },
      { nom: "HTML", icone: siHtml5, usage: "Sites sans framework" },
      { nom: "CSS", icone: siCss, usage: "Animations natives" },
      { nom: "JavaScript", icone: siJavascript, usage: "Vanilla" },
    ],
  },
  {
    titre: "Données et serveur",
    texte: "",
    outils: [
      { nom: "Supabase", icone: siSupabase, usage: "Base, comptes, fichiers" },
      { nom: "PostgreSQL", icone: siPostgresql, usage: "Migrations SQL" },
      { nom: "Node.js", icone: siNodedotjs, usage: "API et scripts" },
      { nom: "Python", icone: siPython, usage: "Scripts et ponts MCP" },
      { nom: "Upstash", icone: siUpstash, usage: "Limitation de débit" },
      { nom: "Stripe", icone: siStripe, usage: "Paiement" },
    ],
  },
  {
    titre: "Emails et messages",
    texte: "",
    outils: [
      { nom: "Resend", icone: siResend, usage: "Emails transactionnels" },
      { nom: "Brevo", icone: siBrevo, usage: "SMS et campagnes" },
      { nom: "Slack", icone: siSlack, usage: "Notifications d'équipe" },
      { nom: "Telegram", icone: siTelegram, usage: "Bots et alertes" },
      { nom: "WhatsApp", icone: siWhatsapp, usage: "Échanges clients" },
    ],
  },
  {
    titre: "Google",
    texte: "",
    outils: [
      { nom: "Google Cloud", icone: siGooglecloud, usage: "OAuth et API" },
      { nom: "Google Agenda", icone: siGooglecalendar, usage: "API Calendar" },
      { nom: "Gmail", icone: siGmail, usage: "API Gmail" },
      { nom: "Search Console", icone: siGooglesearchconsole, usage: "SEO" },
      { nom: "Google Analytics", icone: siGoogleanalytics, usage: "Audience" },
      { nom: "Google Sheets", icone: siGooglesheets, usage: "Tableaux" },
      { nom: "Google Maps", icone: siGooglemaps, usage: "Cartes" },
    ],
  },
  {
    titre: "Infrastructure",
    texte: "",
    outils: [
      { nom: "Vercel", icone: siVercel, usage: "Production" },
      { nom: "GitHub", icone: siGithub, usage: "Code" },
      { nom: "Git", icone: siGit, usage: "Une branche par chantier" },
      { nom: "Contabo", icone: siContabo, usage: "Serveur des agents" },
      { nom: "Ubuntu", icone: siUbuntu, usage: "Services" },
      { nom: "Docker", icone: siDocker, usage: "Conteneurs" },
      { nom: "Caddy", icone: siCaddy, usage: "HTTPS" },
      { nom: "Cloudflare", icone: siCloudflare, usage: "DNS" },
      { nom: "Uptime Kuma", icone: siUptimekuma, usage: "Supervision" },
      { nom: "Playwright", icone: siPlaywright, usage: "Captures et tests" },
    ],
  },
  {
    titre: "Création et matériel",
    texte: "",
    outils: [
      { ...HYPERFRAMES, usage: "Vidéos en HTML" },
      { nom: "Figma", icone: siFigma, usage: "Maquettes" },
      { nom: "Blender", icone: siBlender, usage: "3D" },
      { nom: "KiCad", icone: siKicad, usage: "Cartes électroniques" },
      { nom: "Arduino", icone: siArduino, usage: "Microcontrôleurs" },
      { nom: "ESP32", icone: siEspressif, usage: "Objets connectés" },
      { nom: "Obsidian", icone: siObsidian, usage: "Notes" },
      { nom: "Meta", icone: siMeta, usage: "Publicité" },
      { nom: "TikTok", icone: siTiktok, usage: "Vidéos courtes" },
    ],
  },
  {
    titre: "Connecteurs MCP",
    texte: "",
    outils: [
      { nom: "Supabase", icone: siSupabase, usage: "Base de données" },
      { nom: "Vercel", icone: siVercel, usage: "Déploiements" },
      { nom: "GitHub", icone: siGithub, usage: "Dépôts" },
      { nom: "Gmail", icone: siGmail, usage: "Emails" },
      { nom: "Google Agenda", icone: siGooglecalendar, usage: "Rendez-vous" },
      { nom: "Google Drive", icone: siGoogledrive, usage: "Documents" },
      { nom: "Figma", icone: siFigma, usage: "Maquettes" },
      { nom: "Linear", icone: siLinear, usage: "Tâches" },
      { nom: "n8n", icone: siN8n, usage: "Workflows" },
      { nom: "Chrome", icone: siGooglechrome, usage: "Navigation" },
      { nom: "21st.dev", image: "/logos/21st.png", usage: "Composants" },
      { nom: "Higgsfield", image: "/logos/higgsfield.png", usage: "Génération" },
    ],
  },
];

/** Tous les outils, sans doublon : la bande défilante de l'accueil. */
export const TOUS_LES_OUTILS: Outil[] = [
  ...new Map(CATEGORIES_STACK.flatMap((c) => c.outils).map((o) => [o.nom, o])).values(),
];

/** Les outils de l'orbite du haut de page : les plus parlants d'abord. */
export const ORBITE_INTERIEURE: Outil[] = [
  { nom: "Claude Code", icone: siClaude, usage: "" },
  { nom: "Telegram", icone: siTelegram, usage: "" },
  { nom: "Google Cloud", icone: siGooglecloud, usage: "" },
  { nom: "GitHub", icone: siGithub, usage: "" },
  { nom: "n8n", icone: siN8n, usage: "" },
  { nom: "Supabase", icone: siSupabase, usage: "" },
];

export const ORBITE_EXTERIEURE: Outil[] = [
  { nom: "Next.js", icone: siNextdotjs, usage: "" },
  { nom: "React", icone: siReact, usage: "" },
  { nom: "Google Agenda", icone: siGooglecalendar, usage: "" },
  { nom: "Vercel", icone: siVercel, usage: "" },
  { nom: "MCP", icone: siModelcontextprotocol, usage: "" },
  { nom: "Gmail", icone: siGmail, usage: "" },
  { nom: "Tailwind CSS", icone: siTailwindcss, usage: "" },
  { nom: "ElevenLabs", icone: siElevenlabs, usage: "" },
  { nom: "Docker", icone: siDocker, usage: "" },
  { nom: "TypeScript", icone: siTypescript, usage: "" },
];

/** Le schéma Hermes : d'où viennent les demandes, où l'agent agit. */
export const SCHEMA_HERMES = {
  entrees: [
    { nom: "Telegram", icone: siTelegram, usage: "" },
    { nom: "Gmail", icone: siGmail, usage: "" },
  ] as Outil[],
  sorties: [
    { nom: "Agenda", icone: siGooglecalendar, usage: "" },
    { nom: "Tableur", icone: siGooglesheets, usage: "" },
    { nom: "Site", icone: siSupabase, usage: "" },
  ] as Outil[],
};

export type CategorieSkill =
  | "Agents"
  | "Web"
  | "Sécurité"
  | "Automatisation"
  | "Clients"
  | "Génie électrique"
  | "Poste";

export const SKILLS: { nom: string; categorie: CategorieSkill; role: string }[] = [
  { nom: "orca-agents", categorie: "Agents", role: "Piloter des workers Claude et Codex en parallèle, trier et fusionner leur travail." },
  { nom: "reprendre-projet", categorie: "Agents", role: "Reprendre un projet là où il s'était arrêté et dire ce qui reste." },
  { nom: "bilan-activite", categorie: "Agents", role: "Temps passé par projet, calculé sur les sessions et les commits." },
  { nom: "idees-fonctionnalites", categorie: "Agents", role: "Trouver des idées, les noter par utilité et effort, construire les retenues." },
  { nom: "jev", categorie: "Agents", role: "Noter des options en pourcentage pour trancher vite." },
  { nom: "prof-code", categorie: "Agents", role: "Mode apprentissage : l'agent explique au lieu d'écrire." },
  { nom: "site-a-z", categorie: "Web", role: "Livrer un site Next.js de A à Z : admin, SEO, checklist de lancement." },
  { nom: "demarrer-projet", categorie: "Web", role: "Dépôt, variables, AGENTS.md et premier déploiement en quelques minutes." },
  { nom: "supabase-projet", categorie: "Web", role: "Tables, migrations SQL, RLS et connexion." },
  { nom: "vercel-prod", categorie: "Web", role: "Mettre en production et prouver que c'est en ligne." },
  { nom: "domaine-dns", categorie: "Web", role: "Brancher un domaine : Vercel, Resend, Cloudflare, Search Console." },
  { nom: "audit-mobile", categorie: "Web", role: "Captures automatiques téléphone et ordinateur, puis corrections." },
  { nom: "seo-local", categorie: "Web", role: "Audit et campagne SEO mesurés sur les vraies données." },
  { nom: "nettoyer-projet", categorie: "Web", role: "Retirer fichiers, dépendances et composants inutilisés." },
  { nom: "portfolio-projet", categorie: "Web", role: "Ajouter un projet au portfolio." },
  { nom: "photos-web", categorie: "Web", role: "Retirer le GPS des photos, redimensionner, convertir en WebP." },
  { nom: "ui-rgm", categorie: "Web", role: "Reproduire l'interface de ce site : composants, fond animé, verre dépoli et liquide." },
  { nom: "analyser-repo", categorie: "Sécurité", role: "Quarantaine et analyse de tout dépôt externe avant de l'exécuter." },
  { nom: "alerte-securite", categorie: "Sécurité", role: "Une faille circule : sommes-nous concernés ? Vérifier, corriger." },
  { nom: "audit-securite-site", categorie: "Sécurité", role: "Pentest léger : admin, API, Supabase, en-têtes, secrets." },
  { nom: "audit-projets", categorie: "Sécurité", role: "Travail non poussé, secrets suivis par git, failles npm." },
  { nom: "poser-secret", categorie: "Sécurité", role: "Poser une clé sans qu'elle passe par la conversation." },
  { nom: "vps-sante", categorie: "Sécurité", role: "Bilan du serveur : services, ports, mises à jour, pare-feu." },
  { nom: "bot-telegram", categorie: "Automatisation", role: "Créer ou dépanner un bot Telegram, en webhook ou en service." },
  { nom: "envoyer-telegram", categorie: "Automatisation", role: "L'agent envoie lui-même les livrables sur Telegram." },
  { nom: "video-rgm", categorie: "Automatisation", role: "Vidéos verticales : HyperFrames, composants React, voix ElevenLabs." },
  { nom: "devis-freelance", categorie: "Clients", role: "Chiffrer un devis ou une facture." },
  { nom: "message-client", categorie: "Clients", role: "Rédiger un message client clair, au vouvoiement." },
  { nom: "retours-client", categorie: "Clients", role: "Transformer des retours en liste de tâches." },
  { nom: "signature-mail", categorie: "Clients", role: "Signature HTML pour Gmail et Outlook." },
  { nom: "courrier-officiel", categorie: "Clients", role: "Réclamation, résiliation, demande au support." },
  { nom: "esp32-arduino", categorie: "Génie électrique", role: "Compiler, téléverser, lire des capteurs, envoyer sur Telegram." },
  { nom: "kicad-projet", categorie: "Génie électrique", role: "Contrôles ERC/DRC et dossier de fabrication." },
  { nom: "dimensionnement-pv", categorie: "Génie électrique", role: "Photovoltaïque : production, onduleur, câbles, rentabilité." },
  { nom: "blender-solaire", categorie: "Génie électrique", role: "Modéliser une maison et poser les panneaux à l'échelle." },
  { nom: "rapport-tp", categorie: "Génie électrique", role: "Comptes rendus de TP et rapports de projet." },
  { nom: "fiche-revision", categorie: "Génie électrique", role: "Fiches, méthodes et QCM à partir d'un cours." },
  { nom: "candidature-stage", categorie: "Génie électrique", role: "Recherche d'entreprise, lettre, relance." },
  { nom: "depannage-pc", categorie: "Poste", role: "Diagnostiquer et réparer un problème Windows." },
  { nom: "menage-disque", categorie: "Poste", role: "Libérer de la place sans rien casser." },
];

/** Le logo de l'outil au cœur de chaque skill : on reconnaît le sujet d'un coup d'œil. */
const LOGO_SKILL: Record<string, Pick<Outil, "icone" | "image">> = {
  "orca-agents": { image: ORCA.image },
  "reprendre-projet": { icone: siGit },
  "bilan-activite": { icone: siClaude },
  "idees-fonctionnalites": { icone: siClaude },
  jev: { icone: siClaude },
  "prof-code": { icone: siTypescript },
  "site-a-z": { icone: siNextdotjs },
  "demarrer-projet": { icone: siGithub },
  "supabase-projet": { icone: siSupabase },
  "vercel-prod": { icone: siVercel },
  "domaine-dns": { icone: siCloudflare },
  "audit-mobile": { icone: siPlaywright },
  "seo-local": { icone: siGooglesearchconsole },
  "nettoyer-projet": { icone: siNpm },
  "portfolio-projet": { icone: siReact },
  "photos-web": { icone: siGooglephotos },
  "ui-rgm": { icone: siTailwindcss },
  "analyser-repo": { icone: siGithub },
  "alerte-securite": { icone: siNodedotjs },
  "audit-securite-site": { icone: siLetsencrypt },
  "audit-projets": { icone: siGit },
  "poser-secret": { icone: siGnubash },
  "vps-sante": { icone: siUbuntu },
  "bot-telegram": { icone: siTelegram },
  "envoyer-telegram": { icone: siTelegram },
  "video-rgm": { image: HYPERFRAMES.image },
  "devis-freelance": { icone: siGooglesheets },
  "message-client": { icone: siWhatsapp },
  "retours-client": { icone: siLinear },
  "signature-mail": { icone: siGmail },
  "courrier-officiel": { icone: siGmail },
  "esp32-arduino": { icone: siEspressif },
  "kicad-projet": { icone: siKicad },
  "dimensionnement-pv": { icone: siPython },
  "blender-solaire": { icone: siBlender },
  "rapport-tp": { icone: siMarkdown },
  "fiche-revision": { icone: siObsidian },
  "candidature-stage": { icone: siGoogle },
  "depannage-pc": { icone: siIntel },
  "menage-disque": { icone: siPython },
};

/** Ce que le catalogue (composant client) reçoit : des tracés, pas la bibliothèque. */
export type LogoLeger = { d?: string; couleur?: string; image?: string };

function logoLeger(outil?: Pick<Outil, "icone" | "image">): LogoLeger {
  if (outil?.icone) return { d: outil.icone.path, couleur: `#${outil.icone.hex}` };
  return { image: outil?.image ?? undefined };
}

export const SKILLS_AFFICHAGE = SKILLS.map((skill) => ({ ...skill, logo: logoLeger(LOGO_SKILL[skill.nom]) }));

/**
 * Les skills écrites par d'autres que j'utilise au quotidien. Le lien n'est
 * donné que lorsque la source a été vérifiée. Pour un auteur seul, le logo de
 * GitHub plutôt que sa photo de profil.
 */
export const COLLECTIONS_TIERS: {
  nom: string;
  auteur: string;
  source: string | null;
  outil: Outil;
  role: string;
  skills: string[];
}[] = [
  {
    nom: "HyperFrames",
    auteur: "HeyGen",
    source: null,
    outil: { ...HYPERFRAMES, usage: "" },
    role: "Vidéos en HTML, rendues en MP4.",
    skills: ["hyperframes", "hyperframes-cli", "hyperframes-registry", "media-use"],
  },
  {
    nom: "brag",
    auteur: "Latent Spaces",
    source: "https://github.com/latent-spaces/brag",
    outil: { nom: "Latent Spaces", image: "/logos/brag.png", usage: "" },
    role: "Une vidéo de lancement tirée du code.",
    skills: ["brag", "brag-slim"],
  },
  {
    nom: "Taste Skill",
    auteur: "Leonxlnx",
    source: "https://github.com/Leonxlnx/taste-skill",
    outil: { nom: "GitHub", icone: siGithub, usage: "" },
    role: "Directions de design et refontes.",
    skills: ["design-taste-frontend", "high-end-visual-design", "minimalist-ui", "redesign-existing-projects", "brandkit", "image-to-code"],
  },
  {
    nom: "Skills de Matt Pocock",
    auteur: "Matt Pocock",
    source: "https://github.com/mattpocock/skills",
    outil: { nom: "TypeScript", icone: siTypescript, usage: "" },
    role: "Tests d'abord, diagnostic, revue de code.",
    skills: ["tdd", "diagnosing-bugs", "code-review", "prototype", "domain-modeling", "grilling", "writing-for-agents"],
  },
  {
    nom: "n8n skills",
    auteur: "Romuald Członkowski",
    source: "https://github.com/czlonkowski/n8n-skills",
    outil: { nom: "n8n", icone: siN8n, usage: "" },
    role: "Des workflows n8n sans erreur.",
    skills: ["n8n-workflow-patterns", "n8n-node-configuration", "n8n-expression-syntax", "n8n-code-javascript", "n8n-code-python", "n8n-validation-expert", "n8n-mcp-tools-expert"],
  },
  {
    nom: "Design engineering",
    auteur: "Emil Kowalski",
    source: "https://github.com/emilkowalski/skills",
    outil: { nom: "GitHub", icone: siGithub, usage: "" },
    role: "Le détail des animations et des composants.",
    skills: ["emil-design-eng"],
  },
  {
    nom: "Better UI",
    auteur: "Jakub Krehel",
    source: "https://github.com/jakubkrehel/skills",
    outil: { nom: "GitHub", icone: siGithub, usage: "" },
    role: "Rayons, alignement optique, profondeur.",
    skills: ["better-ui"],
  },
  {
    nom: "Plugins officiels",
    auteur: "Anthropic",
    source: "https://github.com/anthropics/claude-plugins-official",
    outil: { nom: "Anthropic", icone: siAnthropic, usage: "" },
    role: "Sécurité, design, documents, création de skills.",
    skills: ["frontend-design", "security-guidance", "skill-creator", "code-review", "docx", "pdf", "xlsx", "pptx"],
  },
  {
    nom: "Figma",
    auteur: "Figma",
    source: null,
    outil: { nom: "Figma", icone: siFigma, usage: "" },
    role: "De la maquette au code.",
    skills: ["figma-use", "figma-design-to-code", "figma-code-connect", "figma-generate-library"],
  },
  {
    nom: "Motion et transitions",
    auteur: "transitions.dev et la communauté",
    source: null,
    outil: { nom: "Motion", image: "/logos/motion.png", usage: "" },
    role: "Durées, courbes, audit des animations.",
    skills: ["transitions-dev", "transitions-polish", "design-motion-principles", "motion-design"],
  },
  {
    nom: "Stripe Projects",
    auteur: "Stripe",
    source: null,
    outil: { nom: "Stripe", icone: siStripe, usage: "" },
    role: "Provisionner des services depuis le terminal.",
    skills: ["stripe-projects"],
  },
  {
    nom: "Bklit UI",
    auteur: "Bklit",
    source: null,
    outil: { nom: "Bklit", image: "/logos/bklit.png", usage: "" },
    role: "Graphiques des tableaux de bord.",
    skills: ["bklit-ui"],
  },
];

export const NOMBRE_SKILLS_TIERS = COLLECTIONS_TIERS.reduce((n, c) => n + c.skills.length, 0);
