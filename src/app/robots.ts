import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

/** Ce qu'aucun robot n'a à explorer : les espaces privés et l'API. */
const PRIVE = ["/admin", "/compte", "/connexion", "/acces-admin", "/auth", "/api"];

/**
 * Les robots des moteurs génératifs (GEO).
 *
 * Être cité par ChatGPT, Perplexity, Claude ou les réponses IA de Google est
 * le nouveau référencement : quand quelqu'un demande « un développeur
 * freelance à Lyon », l'assistant ne peut recommander que ce que son robot a
 * pu lire. On les nomme un par un plutôt que de compter sur la règle `*` :
 * certains ne lisent que leur propre bloc, et ça rend le choix explicite.
 *
 * Les robots d'entraînement (GPTBot, ClaudeBot, Google-Extended…) sont admis
 * aussi : pour un site vitrine, figurer dans ce que les modèles savent est un
 * avantage, pas une fuite. Le contenu privé reste exclu pour tous.
 */
const ROBOTS_IA = [
  // OpenAI : recherche ChatGPT, navigation à la demande, entraînement.
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  // Anthropic.
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  // Perplexity.
  "PerplexityBot",
  "Perplexity-User",
  // Google (Gemini, AI Overviews) et Apple (Apple Intelligence).
  "Google-Extended",
  "Applebot-Extended",
  // Mistral (Le Chat).
  "MistralAI-User",
];

/**
 * Les consignes aux robots.
 *
 * Les espaces privés sont exclus : ils redirigent de toute façon vers la
 * connexion, mais les faire explorer gaspillerait le budget de crawl que Google
 * accorde à un petit site — budget qu'on veut entièrement sur les pages qui
 * vendent.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVE },
      { userAgent: ROBOTS_IA, allow: "/", disallow: PRIVE },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
