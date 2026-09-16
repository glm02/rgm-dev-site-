import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { FilAriane } from "@/components/commun/fil-ariane";
import { JsonLd } from "@/components/commun/json-ld";
import { Markdown } from "@/components/commun/markdown";
import { AppelAction } from "@/components/sections/appel-action";
import { articleParSlug, listerArticles } from "@/lib/donnees";
import { dateLongue } from "@/lib/format";
import { jsonLdArticle, jsonLdFilAriane, metadonnees } from "@/lib/seo";

export async function generateStaticParams() {
  const articles = await listerArticles();
  // Au moins un paramètre factice : sans aucun article, Next refuse de
  // construire une route dynamique vide en `generateStaticParams`. La page
  // correspondante répond simplement 404.
  return articles.length
    ? articles.map((article) => ({ slug: article.slug }))
    : [{ slug: "bientot" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await articleParSlug(slug);

  if (!article) {
    return metadonnees({ titre: "Article introuvable", description: "", chemin: `/blog/${slug}`, horsIndex: true });
  }

  return metadonnees({
    titre: article.seo_titre ?? article.titre,
    description: article.seo_description ?? article.chapo ?? "",
    chemin: `/blog/${article.slug}`,
    image: article.image,
    article: { publieLe: article.publie_le, tags: article.tags },
  });
}

export default async function PageArticle({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = await articleParSlug(slug);

  if (!article) notFound();

  const etapes = [
    { nom: "Accueil", href: "/" },
    { nom: "Blog", href: "/blog" },
    { nom: article.titre, href: `/blog/${article.slug}` },
  ];

  return (
    <>
      <JsonLd donnees={jsonLdArticle(article)} />
      <JsonLd donnees={jsonLdFilAriane(etapes)} />

      <article className="conteneur pt-8 pb-16">
        <div className="mx-auto max-w-3xl">
          <FilAriane etapes={etapes} />

          <header className="mt-10">
            <p className="text-sm text-muted-foreground tabular-nums">
              {dateLongue(article.publie_le)}
              {article.temps_lecture ? ` · ${article.temps_lecture} min de lecture` : ""}
            </p>
            <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{article.titre}</h1>
            {article.chapo && (
              <p className="mt-5 text-xl leading-relaxed text-balance text-muted-foreground">
                {article.chapo}
              </p>
            )}
          </header>

          {article.image && (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-secondary outline outline-black/10 dark:outline-white/10">
              <Image
                src={article.image}
                alt=""
                fill
                priority
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          )}

          {/* Mesure de lecture : 68 caractères environ. Au-delà, l'œil perd la
              ligne suivante en revenant à gauche. */}
          <Markdown contenu={article.contenu} className="mt-10 max-w-[68ch]" />

          {article.tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
              {article.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>

      <AppelAction />
    </>
  );
}
