import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

/**
 * Le manifeste : nom et icônes quand le site est ajouté à l'écran d'accueil
 * d'un téléphone. Icônes générées à partir du logo de Rafael.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.nom} — ${SITE.slogan}`,
    short_name: SITE.nom,
    description: SITE.promesse,
    start_url: "/",
    display: "standalone",
    lang: "fr",
    background_color: "#ffffff",
    theme_color: "#1b17ff",
    icons: [
      { src: "/icone-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icone-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
