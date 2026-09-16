import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

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
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/compte", "/connexion", "/auth", "/api"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
