import type { Metadata } from "next";

import { BandeauPaysage } from "@/components/rgm/bandeau";
import { FOND_TEXTURE, Marqueur } from "@/components/rgm/blocs-service";
import { CarteArticle } from "@/components/rgm/blog";
import { listerArticles } from "@/lib/donnees";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Blog — sites web et automatisation IA",
  description:
    "Conseils concrets pour les entreprises de Lyon : référencement local, sites web qui convertissent, automatisation des tâches répétitives avec l'IA.",
  chemin: "/blog",
});

export const revalidate = 300;

const A_LA_UNE = "automatiser-taches-repetitives-ia";

export default async function PageBlog() {
  const articles = await listerArticles();
  const une = articles.find((a) => a.slug === A_LA_UNE) ?? articles[0];
  const autres = articles.filter((a) => a !== une);

  return (
    <>
      <BandeauPaysage paysage="nuages" decalage={-106} hauteur={390} hauteurMobile={310} voile="clair">
        <h1 className="flex flex-col items-center gap-3 text-center text-white">
          <span className="font-titre text-[56px] leading-[1.05] font-bold tracking-[-2.24px] md:text-[96px] md:tracking-[-3.84px]">Le blog</span>
          <span className="font-marqueur text-[40px] leading-[1.05] md:text-[69px]">Web &amp; IA</span>
        </h1>
      </BandeauPaysage>

      <div className="px-2 pt-3.5 md:px-3">
        <section className="flex flex-col gap-[26px] rounded-[24px] px-4 pt-12 pb-12 md:px-[calc((100%-1200px)/2)] md:pt-[76px] md:pb-[74px]" style={FOND_TEXTURE}>
          <h2 className="text-[34px] font-bold md:text-[42px]">
            À <Marqueur taille={39}>lire</Marqueur>
          </h2>
          {une ? (
            <div className="flex flex-col gap-4 md:flex-row">
              <CarteArticle article={une} grande className="md:w-[575px] md:shrink-0" />
              <div className="flex flex-1 flex-col gap-3">
                {autres.map((a) => (
                  <CarteArticle key={a.id} article={a} className="flex-1" />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-base">Les premiers articles arrivent.</p>
          )}
        </section>
      </div>
    </>
  );
}
