import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { AppelAction } from "@/components/sections/appel-action";
import { listerArticles } from "@/lib/donnees";
import { dateLongue } from "@/lib/format";
import { metadonnees } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = metadonnees({
  titre: "Blog — sites web et automatisation IA",
  description:
    "Conseils concrets pour les entreprises de Lyon : référencement local, sites web qui convertissent, automatisation des tâches répétitives avec l'IA.",
  chemin: "/blog",
});

export default async function PageBlog() {
  const articles = await listerArticles();

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="halo-bleu pointer-events-none absolute inset-x-0 top-0 h-80"
        />
        <div className="conteneur relative pt-14 sm:pt-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-semibold sm:text-5xl">Blog</h1>
            <p className="mt-5 text-lg leading-relaxed text-balance text-muted-foreground">
              Ce que j&apos;apprends en construisant des sites et des automatisations
              pour des entreprises — écrit pour être utile, pas pour remplir.
            </p>
          </div>
        </div>
      </section>

      <section className="conteneur py-16 sm:py-20">
        {articles.length > 0 ? (
          <ul className="mx-auto grid max-w-4xl gap-4">
            {articles.map((article, index) => (
              <Apparait key={article.id} as="li" delai={Math.min(index, 4) * 50}>
                <article
                  className={cn(
                    "group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8",
                    "transition-[border-color,translate] duration-200 ease-out",
                    "hover:-translate-y-0.5 hover:border-bleu-200 dark:hover:border-bleu-800",
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground tabular-nums">
                      {dateLongue(article.publie_le)}
                      {article.temps_lecture ? ` · ${article.temps_lecture} min de lecture` : ""}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                      >
                        {article.titre}
                      </Link>
                    </h2>
                    {article.chapo && (
                      <p className="mt-2.5 leading-relaxed text-muted-foreground">
                        {article.chapo}
                      </p>
                    )}
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 shrink-0 text-muted-foreground transition-[color,translate] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bleu-600"
                    strokeWidth={1.75}
                  />
                </article>
              </Apparait>
            ))}
          </ul>
        ) : (
          <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-border bg-secondary/30 p-10 text-center">
            <h2 className="text-xl font-semibold">Les premiers articles arrivent</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Ils sont en cours d&apos;écriture. En attendant, les fiches projet racontent
              déjà le problème de départ, la solution et ce qu&apos;elle a coûté.
            </p>
            <Link
              href="/realisations"
              className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-[background-color,scale] duration-150 ease-out hover:bg-bleu-700 active:scale-96"
            >
              Voir les réalisations
            </Link>
          </div>
        )}
      </section>

      <AppelAction />
    </>
  );
}
