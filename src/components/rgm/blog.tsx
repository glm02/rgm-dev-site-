import Link from "next/link";
import { cn } from "cn";

import type { Article } from "@/lib/types";
import type { NomPaysage } from "./bandeau";
import { Icone } from "./icones";
import { LIENS } from "./liens";

type HeroArticle = { paysage: NomPaysage; decalage: number; debut: string; marqueur: string; fin: string; categorie: string; google?: boolean };

export const HEROS_ARTICLES: Record<string, HeroArticle> = {
  "prix-site-internet-lyon": {
    paysage: "chaine-alpine",
    decalage: -96,
    debut: "Combien coûte un site internet",
    marqueur: "à Lyon",
    fin: " ?",
    categorie: "Sites web",
  },
  "automatiser-taches-repetitives-ia": {
    paysage: "sommet-et-nuages",
    decalage: -96,
    debut: "Quelles tâches automatiser",
    marqueur: "avec l’IA",
    fin: " ?",
    categorie: "Automatisation IA",
  },
  "referencement-local-artisan-commerce": {
    paysage: "sommet-enneige",
    decalage: -93,
    debut: "Comment remonter sur Google",
    marqueur: "près de chez vous",
    fin: " ?",
    categorie: "Référencement local",
    google: true,
  },
};

export function libelleArticle(article: Article) {
  const hero = HEROS_ARTICLES[article.slug];
  const categorie = hero?.categorie ?? article.tags[0] ?? "Article";
  return article.temps_lecture && categorie === "Sites web" ? `${categorie} · ${article.temps_lecture} min` : categorie;
}

export function titreCourt(article: Article) {
  const hero = HEROS_ARTICLES[article.slug];
  return hero ? `${hero.debut} ${hero.marqueur}${hero.fin}` : article.titre;
}

export function CarteArticle({ article, grande, className }: { article: Article; grande?: boolean; className?: string }) {
  const hero = HEROS_ARTICLES[article.slug];
  return (
    <Link
      href={`${LIENS.blog}/${article.slug}`}
      className={cn("group flex rounded-[16px] border border-border bg-white p-5 hover:border-primary/40 transition-[transform,border-color] duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none", className)}
    >
      <span className="flex w-full items-center gap-3.5">
        <span className={cn("flex flex-1 flex-col", grande ? "gap-2" : "gap-[5px]")}>
          <span className="text-xs font-medium">{libelleArticle(article)}</span>
          <span className={cn("flex items-center gap-[5px] font-semibold", grande ? "text-[26px] leading-[1.2] md:text-[34px]" : "text-[19px] leading-[1.2] md:text-[21px]")}>
            {hero?.google ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/figma/logos/google.svg" alt="" width={17} height={17} className="size-[17px] shrink-0" />
            ) : null}
            {titreCourt(article)}
          </span>
        </span>
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-[#f4f7fd]">
          <Icone nom="fleche-droite" taille={16} className="transition-transform duration-150 group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}
