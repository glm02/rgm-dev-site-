import type { Metadata } from "next";

import { SITE, VILLES } from "./site";
import type { Article, Avis, Offre, Projet, Service } from "./types";

/**
 * Métadonnées et données structurées.
 *
 * Le référencement local est la raison n°1 d'existence du site (AGENTS.md §2).
 * Ce fichier est donc à prendre au sérieux : c'est lui qui décide de ce que
 * Google comprend de chaque page.
 */

type OptionsMeta = {
  titre: string;
  description: string;
  chemin: string;
  image?: string | null;
  /** Un article : Google le date et l'attribue différemment d'une page. */
  article?: { publieLe: string | null; tags: string[] };
  /** Une page volontairement hors index (espace client, admin). */
  horsIndex?: boolean;
};

export function metadonnees({
  titre,
  description,
  chemin,
  image,
  article,
  horsIndex,
}: OptionsMeta): Metadata {
  const url = new URL(chemin, SITE.url).toString();
  const titreComplet = titre.includes(SITE.nom) ? titre : `${titre} — ${SITE.nom}`;

  return {
    title: titreComplet,
    description,
    alternates: { canonical: url },
    robots: horsIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: article ? "article" : "website",
      url,
      title: titreComplet,
      description,
      siteName: SITE.nom,
      locale: "fr_FR",
      images: [{ url: image ?? "/images/og-banner.jpg" }],
      publishedTime: article?.publieLe ?? undefined,
      tags: article?.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: titreComplet,
      description,
      images: [image ?? "/images/og-banner.jpg"],
    },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

/**
 * L'entreprise. `ProfessionalService` plutôt que `Organization` : c'est ce qui
 * déclenche l'affichage local (zone d'intervention, avis) dans Google.
 *
 * `aggregateRating` n'est présent que s'il y a de vrais avis derrière. Un
 * balisage inventé fait sauter les données structurées de tout le domaine.
 */
export function jsonLdEntreprise(note: { moyenne: number; nombre: number } | null) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#entreprise`,
    name: SITE.nom,
    description: SITE.promesse,
    url: SITE.url,
    email: SITE.email,
    image: `${SITE.url}/images/og-banner.jpg`,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.ville,
      addressRegion: SITE.region,
      addressCountry: SITE.pays,
    },
    areaServed: VILLES.map((ville) => ({ "@type": "City", name: ville })),
    knowsAbout: [
      "Création de site web",
      "Développement Next.js",
      "Automatisation IA",
      "Agents IA",
      "Workflows n8n",
      "Référencement local",
    ],
    sameAs: [SITE.github],
    ...(note
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: note.moyenne,
            reviewCount: note.nombre,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

export function jsonLdService(service: Service, offres: Offre[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.titre,
    description: service.description ?? service.accroche,
    provider: { "@id": `${SITE.url}/#entreprise` },
    areaServed: { "@type": "City", name: SITE.ville },
    url: `${SITE.url}/services/${service.slug}`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: service.titre,
      itemListElement: offres.map((offre) => ({
        "@type": "Offer",
        name: offre.nom,
        description: offre.description ?? undefined,
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: offre.prix_min,
          maxPrice: offre.prix_max ?? undefined,
          priceCurrency: "EUR",
          valueAddedTaxIncluded: false,
        },
      })),
    },
  };
}

/**
 * Une réalisation. `CreativeWork` et non `Product` : on ne vend pas le site
 * d'un client, on le montre.
 */
export function jsonLdProjet(projet: Projet, avis: Avis[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: projet.titre,
    abstract: projet.resume,
    url: `${SITE.url}/realisations/${projet.slug}`,
    creator: { "@id": `${SITE.url}/#entreprise` },
    about: projet.secteur ?? undefined,
    keywords: projet.stack.join(", "),
    ...(avis.length
      ? {
          review: avis.map((un) => ({
            "@type": "Review",
            author: { "@type": "Person", name: un.auteur_nom },
            datePublished: un.cree_le,
            reviewBody: un.contenu,
            reviewRating: {
              "@type": "Rating",
              ratingValue: un.note,
              bestRating: 5,
              worstRating: 1,
            },
          })),
        }
      : {}),
  };
}

export function jsonLdArticle(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.titre,
    description: article.chapo ?? undefined,
    datePublished: article.publie_le ?? undefined,
    author: { "@id": `${SITE.url}/#entreprise` },
    publisher: { "@id": `${SITE.url}/#entreprise` },
    url: `${SITE.url}/blog/${article.slug}`,
    image: article.image ?? undefined,
    keywords: article.tags.join(", "),
  };
}

/** Le fil d'Ariane, qui remplace l'URL sous le titre dans les résultats Google. */
export function jsonLdFilAriane(etapes: { nom: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: etapes.map((etape, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: etape.nom,
      item: new URL(etape.href, SITE.url).toString(),
    })),
  };
}

export function jsonLdFaq(questions: { question: string; reponse: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((entree) => ({
      "@type": "Question",
      name: entree.question,
      acceptedAnswer: { "@type": "Answer", text: entree.reponse },
    })),
  };
}
