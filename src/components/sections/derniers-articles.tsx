import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { TitreSection } from "@/components/commun/titre-section";
import { listerArticles } from "@/lib/donnees";
import { dateLongue } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Les derniers articles du blog, en fin d'accueil.
 *
 * Deux raisons : un visiteur qui hésite encore trouve des réponses concrètes
 * (prix, méthode, référencement) avant de demander un devis ; et chaque
 * article reçoit un lien depuis la page la plus forte du site, ce qui aide
 * Google à le découvrir et à le classer. Sans article publié, rien ne s'affiche.
 */
export async function DerniersArticles() {
  const articles = await listerArticles(3);
  if (articles.length === 0) return null;

  return (
    <section className="conteneur py-20 sm:py-28">
      <TitreSection
        surtitre="Le blog"
        titre="Des réponses avant le devis"
        sousTitre="Ce que coûte un site, comment automatiser sans risque, comment remonter sur Google : écrit pour les dirigeants, pas pour les développeurs."
      />

      <ul className="mt-14 grid gap-5 md:grid-cols-3">
        {articles.map((article, index) => (
          <li key={article.id}>
            <Apparait delai={index * 70} className="h-full">
              <Link
                href={`/blog/${article.slug}`}
                className={cn(
                  "group flex h-full flex-col rounded-2xl border border-border bg-card p-6",
                  "transition-[border-color,translate] duration-200 ease-out",
                  "hover:-translate-y-0.5 hover:border-bleu-200 dark:hover:border-bleu-800",
                  "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                )}
              >
                <p className="text-sm tabular-nums">
                  {dateLongue(article.publie_le)}
                  {article.temps_lecture ? ` · ${article.temps_lecture} min` : ""}
                </p>
                <h3 className="mt-3 text-lg leading-snug font-semibold text-balance">{article.titre}</h3>
                {article.chapo && <p className="mt-3 line-clamp-3 text-sm leading-relaxed">{article.chapo}</p>}
                <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-bleu-700 dark:text-bleu-300">
                  Lire l&apos;article
                  <ArrowRight
                    className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Apparait>
          </li>
        ))}
      </ul>
    </section>
  );
}
