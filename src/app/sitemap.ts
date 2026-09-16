import type { MetadataRoute } from "next";

import { listerArticles, listerProjets, listerServices } from "@/lib/donnees";
import { SITE } from "@/lib/site";

/**
 * Le plan du site.
 *
 * Il ne liste que ce qui doit être indexé : pas `/connexion`, pas `/compte`,
 * pas `/admin`. Les priorités décroissent selon l'intention commerciale —
 * l'accueil et les tarifs d'abord, parce que ce sont les pages qui convertissent.
 *
 * `force-static` : le plan est calculé au build, comme le reste du site public.
 */
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projets, articles] = await Promise.all([
    listerServices(),
    listerProjets(),
    listerArticles(),
  ]);

  const maintenant = new Date();

  const pagesFixes: Omit<MetadataRoute.Sitemap[number], "lastModified">[] = [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/tarifs`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/realisations`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/contact`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE.url}/avis`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE.url}/blog`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE.url}/mentions-legales`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${SITE.url}/confidentialite`, changeFrequency: "yearly", priority: 0.1 },
  ];

  const fixes: MetadataRoute.Sitemap = pagesFixes.map((entree) => ({
    ...entree,
    lastModified: maintenant,
  }));

  return [
    ...fixes,
    ...services.map((service) => ({
      url: `${SITE.url}/services/${service.slug}`,
      lastModified: maintenant,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projets.map((projet) => ({
      url: `${SITE.url}/realisations/${projet.slug}`,
      lastModified: maintenant,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: `${SITE.url}/blog/${article.slug}`,
      lastModified: article.publie_le ? new Date(article.publie_le) : maintenant,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
