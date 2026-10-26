import "server-only";

import { siGithub } from "simple-icons";

import type { Outil } from "@/lib/stack";

/**
 * Les dépôts que je suis sur GitHub (mes étoiles), classés par thème.
 *
 * Écartés volontairement : un projet politique (une opinion n'a rien à faire
 * sur un site professionnel), des outils de nuisance Bluetooth et un pack
 * offensif, et mon propre dépôt. Le logo est celui du compte propriétaire ;
 * quand ce compte affiche la photo d'une personne, le logo GitHub la remplace.
 */

type Etoile = { depot: string; texte: string; logo: boolean };

const e = (depot: string, texte: string, logo = true): Etoile => ({ depot, texte, logo });

export const ETOILES: { titre: string; depots: Etoile[] }[] = [
  {
    titre: "Agents IA et skills",
    depots: [
      e("NousResearch/hermes-agent", "L'agent qui tourne chez mes clients."),
      e("nesquena/hermes-webui", "Hermes depuis le web ou le téléphone.", false),
      e("paperclipai/paperclip", "Piloter des agents au travail."),
      e("cloudflare/computer", "Un ordinateur pour son agent."),
      e("cloudflare/agentic-inbox", "Une boîte mail tenue par un agent."),
      e("NangoHQ/nango", "Brancher un agent sur 1 000 API."),
      e("alibaba/open-code-review", "Revue de code par agent."),
      e("unclecode/crawl4ai", "Le web en Markdown pour les LLM.", false),
      e("Leonxlnx/taste-skill", "Du goût pour les agents qui codent."),
      e("heygen-com/hyperframes", "Du HTML rendu en vidéo."),
      e("latent-spaces/brag", "Une vidéo de lancement en une commande."),
      e("czlonkowski/n8n-skills", "Des workflows n8n sans erreur.", false),
      e("tamaratran/fast-jev-compaction", "Un contexte plus léger pour Claude Code."),
      e("cathrynlavery/diagram-design", "Des schémas propres pour les agents.", false),
      e("aklofas/kicad-happy", "Des skills d'agent pour KiCad.", false),
      e("romainsimon/paperasse", "Skills pour la paperasse française.", false),
      e("oso95/scroll-world", "Une marque en monde 3D au défilement."),
      e("JCodesMore/ai-website-cloner-template", "Cloner un site avec un agent."),
    ],
  },
  {
    titre: "Composants et design",
    depots: [
      e("xxtomm/spell-ui", "Spell UI, composants à copier."),
      e("Atharvsinh-codez/ObsidianUI", "Composants React et Tailwind."),
      e("preetsuthar17/hextaui", "Composants shadcn sur Base UI."),
      e("irsyadadl/intentui", "Composants React Aria et Tailwind.", false),
      e("Jakubantalik/transitions.dev", "43 transitions soignées.", false),
      e("cruip/open-react-template", "Landing page Next.js."),
      e("nextjs/saas-starter", "Base SaaS : Next.js, Postgres, Stripe."),
      e("gr8rstudio/gr8r-studio", "Gestion de projet sobre."),
    ],
  },
  {
    titre: "n8n",
    depots: [
      e("enescingoz/awesome-n8n-templates", "280 workflows prêts à l'emploi.", false),
      e("abdurrahmanrahat/n8n-workflows", "Workflows d'exemple.", false),
      e("giorgoskoufos/n8n-analytics", "Statistiques d'exécution n8n.", false),
    ],
  },
  {
    titre: "Open source à héberger",
    depots: [
      e("chatwoot/chatwoot", "Support client omnicanal."),
      e("medusajs/medusa", "E-commerce sur mesure."),
      e("dubinc/dub", "Liens courts et attribution."),
      e("plausible/analytics", "Statistiques sans cookies."),
      e("paperless-ngx/paperless-ngx", "Documents scannés et classés."),
      e("AdguardTeam/AdGuardHome", "Bloqueur de pubs pour tout le réseau."),
      e("keycloak/keycloak", "Comptes et connexion unique."),
      e("macro-inc/macro", "Mail, chat, docs et CRM réunis."),
      e("strelov1/freehire", "Moteur de recherche d'emploi.", false),
    ],
  },
  {
    titre: "Vidéo et voix",
    depots: [
      e("OpenCut-app/OpenCut", "L'alternative libre à CapCut."),
      e("openai/whisper", "Transcription de la voix."),
      e("Zackriya-Solutions/meetily", "Notes de réunion en local."),
      e("soyAkil/plume", "Dictée vocale sur Mac."),
      e("yt-dlp/yt-dlp", "Récupérer audio et vidéo."),
    ],
  },
  {
    titre: "Sécurité et curiosités",
    depots: [
      e("NationalSecurityAgency/ghidra", "Rétro-ingénierie logicielle."),
      e("usestrix/strix", "Tests d'intrusion par IA."),
      e("smicallef/spiderfoot", "Renseignement en sources ouvertes."),
      e("morluto/rea", "Rétro-ingénierie avec des agents."),
      e("ruvnet/RuView", "Le Wi-Fi comme capteur de présence.", false),
      e("jeetrex17/TDrive", "Telegram comme espace de stockage.", false),
    ],
  },
];

/** Le logo de la tuile : celui du propriétaire, sinon GitHub. */
export function logoEtoile(etoile: Etoile): Outil {
  const proprietaire = etoile.depot.split("/")[0];
  if (etoile.depot === "NousResearch/hermes-agent") return { nom: "Hermes Agent", image: "/logos/hermes.png", usage: "" };
  return etoile.logo
    ? { nom: proprietaire, image: `/logos/github/${proprietaire}.png`, usage: "" }
    : { nom: proprietaire, icone: siGithub, usage: "" };
}

export const NOMBRE_ETOILES = ETOILES.reduce((n, c) => n + c.depots.length, 0);
