import "server-only";

import {
  siArduino,
  siBaseui,
  siBlender,
  siCaddy,
  siClaude,
  siCloudflare,
  siContabo,
  siDocker,
  siElevenlabs,
  siEspressif,
  siEslint,
  siFigma,
  siGit,
  siGithub,
  siGmail,
  siGooglecalendar,
  siGooglecloud,
  siGooglesearchconsole,
  siGooglesheets,
  siGsap,
  siKicad,
  siLetsencrypt,
  siLucide,
  siMeta,
  siModelcontextprotocol,
  siN8n,
  siNextdotjs,
  siNodedotjs,
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
  siTypescript,
  siUbuntu,
  siUpstash,
  siUptimekuma,
  siVercel,
  siWhatsapp,
  siZod,
  type SimpleIcon,
} from "simple-icons";

/**
 * Le contenu de la page « Ma stack » : ce que j'utilise réellement, et
 * comment les agents IA s'en servent.
 *
 * Règle d'honnêteté : rien ici n'est décoratif. Chaque outil apparaît parce
 * qu'il tourne dans un projet livré ou dans un skill écrit ; pas de logo
 * ajouté pour remplir une grille. Les outils absents de Simple Icons (Orca,
 * Hermes, Codex…) gardent un monogramme plutôt qu'un faux logo.
 */

export type Outil = {
  nom: string;
  usage: string;
  icone?: SimpleIcon;
  /** Deux lettres affichées quand la marque n'a pas de logo libre. */
  monogramme?: string;
};

export const DEPOT_SKILLS = "https://github.com/glm02/skills-claude-code";

export const CHIFFRES = [
  { valeur: "39", libelle: "skills Claude Code écrites et versionnées" },
  { valeur: "56", libelle: "skills métier pour les agents en production" },
  { valeur: "6", libelle: "étapes, chacune vérifiée avant la suivante" },
] as const;

export const REGLES = [
  {
    titre: "Rien n'est annoncé sans preuve",
    texte:
      "Chaque tâche se termine sur une capture téléphone et ordinateur, un code HTTP, un test vert ou une mesure. « C'est fait » veut dire « c'est vérifié ».",
  },
  {
    titre: "Aucun secret dans la conversation",
    texte:
      "Les clés d'API se posent par un script à saisie masquée, testées avant d'être écrites dans un fichier lisible par un seul compte. L'agent ne les voit jamais.",
  },
  {
    titre: "L'humain valide ce qui sort",
    texte:
      "Un email à un client, une dépense, une suppression : l'agent prépare, je décide. Les agents sont rapides parce qu'ils savent où s'arrêter.",
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
    texte:
      "Chaque dépôt commence par un AGENTS.md : ce qu'on construit, pour qui, la stack imposée et ce qu'on ne fait pas. Tout agent — Claude, Codex ou Hermes — le lit avant de toucher une ligne.",
    outils: [
      { nom: "GitHub", icone: siGithub, usage: "Un dépôt par projet, avec son brief" },
      { nom: "Claude Code", icone: siClaude, usage: "L'environnement de travail principal" },
    ],
  },
  {
    numero: "02",
    titre: "Le découpage",
    texte:
      "Un chantier se découpe en tâches indépendantes. Orca les confie à des workers Claude et Codex en parallèle, chacun dans son propre worktree git. Aucun ne pousse sur la branche principale : je relis et je fusionne.",
    outils: [
      { nom: "Orca", monogramme: "Or", usage: "Orchestration des sous-agents" },
      { nom: "Codex", monogramme: "Cx", usage: "Workers en parallèle" },
      { nom: "Git", icone: siGit, usage: "Un worktree par worker" },
    ],
  },
  {
    numero: "03",
    titre: "Les skills",
    texte:
      "L'agent charge la procédure adaptée : les étapes, les pièges déjà rencontrés, et la preuve attendue. Chaque erreur qui a coûté du temps finit dans une skill — c'est ce qui rend les agents fiables d'un projet à l'autre.",
    outils: [
      { nom: "Skills", monogramme: "Sk", usage: "39 procédures écrites" },
      { nom: "Obsidian", icone: siObsidian, usage: "Le coffre qui documente les skills" },
    ],
  },
  {
    numero: "04",
    titre: "La preuve",
    texte:
      "Build, lint, tests, puis des captures automatiques sur téléphone et ordinateur pour traquer débordements et textes qui se chevauchent. Un pentest léger avant toute livraison avec espace admin.",
    outils: [
      { nom: "Playwright", monogramme: "Pw", usage: "Captures téléphone et ordinateur" },
      { nom: "ESLint", icone: siEslint, usage: "Le code relu à chaque passage" },
    ],
  },
  {
    numero: "05",
    titre: "La livraison",
    texte:
      "Poussé sur GitHub, déployé par Vercel, vérifié en ligne — pas seulement en local. L'agent m'envoie lui-même le lien, la vidéo ou les captures sur Telegram.",
    outils: [
      { nom: "Vercel", icone: siVercel, usage: "Mise en ligne à chaque poussée" },
      { nom: "Telegram", icone: siTelegram, usage: "Le livrable arrive sur mon téléphone" },
    ],
  },
  {
    numero: "06",
    titre: "La production",
    texte:
      "Chez le client, des agents Hermes prennent le relais : joignables sur Telegram, branchés sur l'agenda Google, cadrés par des garde-fous. La supervision me prévient avant que le client ne s'en aperçoive.",
    outils: [
      { nom: "Hermes Agent", monogramme: "He", usage: "Agents en production" },
      { nom: "Google Cloud", icone: siGooglecloud, usage: "OAuth et API Google" },
      { nom: "Uptime Kuma", icone: siUptimekuma, usage: "Supervision des sites" },
    ],
  },
];

export const HERMES = [
  {
    titre: "Joignable sur Telegram",
    texte:
      "Chaque collaborateur parle à son agent depuis son téléphone. La passerelle Telegram tourne en service système sur un serveur Linux, redémarrée seule en cas de panne.",
  },
  {
    titre: "Branché sur Google",
    texte:
      "Une application OAuth créée dans la Google Cloud Console, et un pont MCP qui donne à l'agent l'accès à l'agenda : il lit les disponibilités et pose les rendez-vous.",
  },
  {
    titre: "56 skills métier",
    texte:
      "Préparer un devis, planifier une intervention, relancer un client, rédiger un compte rendu, repérer un email d'arnaque : des procédures écrites pour le métier du client, pas des prompts génériques.",
  },
  {
    titre: "Cloisonné par conception",
    texte:
      "Une instance par client, un compte système dédié, des outils autorisés en liste blanche et vérifiés sur la liste réellement chargée — pas sur le fichier de configuration.",
  },
] as const;

export const TELEGRAM = [
  {
    titre: "Livraison",
    texte: "Les vidéos rendues, les liens de production et les captures d'audit arrivent sur Telegram dès qu'ils sont prêts.",
  },
  {
    titre: "Supervision",
    texte: "Un site tombe, un certificat expire, une erreur se répète : l'alerte part tout de suite, et un résumé chaque matin.",
  },
  {
    titre: "Agents et objets",
    texte: "Les agents Hermes répondent sur Telegram, et des cartes ESP32 y envoient leurs mesures.",
  },
] as const;

export const CATEGORIES_STACK: { titre: string; texte: string; outils: Outil[] }[] = [
  {
    titre: "IA et agents",
    texte: "Les agents qui écrivent, vérifient et travaillent en production.",
    outils: [
      { nom: "Claude Code", icone: siClaude, usage: "Environnement principal, 39 skills maison" },
      { nom: "Codex", monogramme: "Cx", usage: "Sous-agents en parallèle" },
      { nom: "Orca", monogramme: "Or", usage: "Orchestration des workers" },
      { nom: "Hermes Agent", monogramme: "He", usage: "Agents en production (Nous Research)" },
      { nom: "MCP", icone: siModelcontextprotocol, usage: "Ponts entre agents et outils" },
      { nom: "n8n", icone: siN8n, usage: "Workflows d'automatisation" },
      { nom: "ElevenLabs", icone: siElevenlabs, usage: "Voix off des vidéos" },
    ],
  },
  {
    titre: "Interface",
    texte: "Des sites rendus côté serveur, rapides et soignés au détail.",
    outils: [
      { nom: "Next.js", icone: siNextdotjs, usage: "App Router, rendu serveur" },
      { nom: "React", icone: siReact, usage: "React 19" },
      { nom: "TypeScript", icone: siTypescript, usage: "Strict partout" },
      { nom: "Tailwind CSS", icone: siTailwindcss, usage: "Tailwind v4" },
      { nom: "shadcn/ui", icone: siShadcnui, usage: "Composants qu'on possède" },
      { nom: "Base UI", icone: siBaseui, usage: "Primitives accessibles" },
      { nom: "Radix UI", icone: siRadixui, usage: "Primitives accessibles" },
      { nom: "Motion", monogramme: "Mo", usage: "Animations d'interface" },
      { nom: "Three.js", icone: siThreedotjs, usage: "Scènes 3D" },
      { nom: "GSAP", icone: siGsap, usage: "Animations des vidéos" },
      { nom: "Zod", icone: siZod, usage: "Validation des formulaires" },
      { nom: "Lucide", icone: siLucide, usage: "Icônes" },
    ],
  },
  {
    titre: "Données et serveur",
    texte: "Des données dans des bases standard, jamais enfermées.",
    outils: [
      { nom: "Supabase", icone: siSupabase, usage: "Base, comptes, fichiers, RLS" },
      { nom: "PostgreSQL", icone: siPostgresql, usage: "Migrations SQL versionnées" },
      { nom: "Node.js", icone: siNodedotjs, usage: "API et scripts" },
      { nom: "Python", icone: siPython, usage: "Données, audits, ponts MCP" },
      { nom: "Resend", icone: siResend, usage: "Emails transactionnels" },
      { nom: "Upstash", icone: siUpstash, usage: "Limitation de débit" },
      { nom: "Stripe", icone: siStripe, usage: "Paiement en ligne" },
    ],
  },
  {
    titre: "Infrastructure",
    texte: "Hébergé, supervisé et sécurisé — sans dépendre d'une seule plateforme.",
    outils: [
      { nom: "Vercel", icone: siVercel, usage: "Sites en production" },
      { nom: "GitHub", icone: siGithub, usage: "Code et historique" },
      { nom: "Contabo", icone: siContabo, usage: "Serveur des agents" },
      { nom: "Ubuntu", icone: siUbuntu, usage: "Services systemd" },
      { nom: "Docker", icone: siDocker, usage: "Services isolés" },
      { nom: "Caddy", icone: siCaddy, usage: "Proxy HTTPS" },
      { nom: "Let's Encrypt", icone: siLetsencrypt, usage: "Certificats" },
      { nom: "Cloudflare", icone: siCloudflare, usage: "DNS" },
      { nom: "Uptime Kuma", icone: siUptimekuma, usage: "Supervision" },
    ],
  },
  {
    titre: "Google et messageries",
    texte: "Les outils où travaillent déjà les clients, branchés par API.",
    outils: [
      { nom: "Google Cloud", icone: siGooglecloud, usage: "Applications OAuth, clés d'API" },
      { nom: "Google Agenda", icone: siGooglecalendar, usage: "API Calendar" },
      { nom: "Gmail", icone: siGmail, usage: "Lecture et tri des demandes" },
      { nom: "Search Console", icone: siGooglesearchconsole, usage: "Données SEO réelles" },
      { nom: "Google Sheets", icone: siGooglesheets, usage: "Tableaux partagés" },
      { nom: "Telegram", icone: siTelegram, usage: "Bots et passerelle des agents" },
      { nom: "WhatsApp", icone: siWhatsapp, usage: "Échanges clients" },
      { nom: "Meta", icone: siMeta, usage: "Campagnes publicitaires" },
    ],
  },
  {
    titre: "Création et matériel",
    texte: "Vidéo, design et électronique : la formation de génie électrique sert aussi.",
    outils: [
      { nom: "HyperFrames", monogramme: "Hf", usage: "Vidéos en HTML" },
      { nom: "Figma", icone: siFigma, usage: "Maquettes" },
      { nom: "Blender", icone: siBlender, usage: "Modélisation 3D" },
      { nom: "KiCad", icone: siKicad, usage: "Cartes électroniques" },
      { nom: "Arduino", icone: siArduino, usage: "arduino-cli" },
      { nom: "ESP32", icone: siEspressif, usage: "Objets connectés" },
    ],
  },
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
