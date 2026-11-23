import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/commun/json-ld";
import { Markdown } from "@/components/commun/markdown";
import { BandeauPaysage } from "@/components/rgm/bandeau";
import { Marqueur } from "@/components/rgm/blocs-service";
import { CarteArticle, HEROS_ARTICLES, libelleArticle } from "@/components/rgm/blog";
import { Icone } from "@/components/rgm/icones";
import { LIENS } from "@/components/rgm/liens";
import { articleParSlug, listerArticles } from "@/lib/donnees";
import { jsonLdArticle, jsonLdFilAriane, metadonnees } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  const articles = await listerArticles();
  // Sans aucun article, Next refuse une route dynamique vide : un slug factice répond 404.
  return articles.length ? articles.map((article) => ({ slug: article.slug })) : [{ slug: "bientot" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await articleParSlug(slug);
  if (!article) return metadonnees({ titre: "Article introuvable", description: "", chemin: `/blog/${slug}`, horsIndex: true });
  return metadonnees({
    titre: article.seo_titre ?? article.titre,
    description: article.seo_description ?? article.chapo ?? "",
    chemin: `/blog/${article.slug}`,
    image: article.image,
    article: { publieLe: article.publie_le, tags: article.tags },
  });
}

const STYLE_CORPS =
  "max-w-[720px] text-[18px] leading-[1.45] [&_h2]:mt-9 [&_h2]:mb-[7px] [&_h2]:text-[24px] [&_h2]:leading-[1.3] md:[&_h2]:text-[27px] [&_h3]:text-[21px] [&_p]:my-3 [&_a]:text-primary [&_li]:marker:text-primary [&>div>h2:first-child]:mt-0";

export default async function PageArticle({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = await articleParSlug(slug);
  if (!article) notFound();

  const autres = (await listerArticles()).filter((a) => a.slug !== article.slug).slice(0, 2);
  const hero = HEROS_ARTICLES[article.slug];

  return (
    <>
      <JsonLd donnees={jsonLdArticle(article)} />
      <JsonLd
        donnees={jsonLdFilAriane([
          { nom: "Accueil", href: "/" },
          { nom: "Blog", href: LIENS.blog },
          { nom: article.titre, href: `${LIENS.blog}/${article.slug}` },
        ])}
      />

      <BandeauPaysage paysage={hero?.paysage ?? "chaine-alpine"} decalage={hero?.decalage ?? -96} hauteur={433} hauteurMobile={350}>
        <div className="flex w-full max-w-[930px] flex-col items-center gap-3 text-center text-white">
          <span className="text-[15px] font-semibold">{libelleArticle(article)}</span>
          <h1 className="font-titre text-[36px] leading-[1.1] font-bold tracking-[-1.2px] md:text-[73px] md:tracking-[-2.92px]">
            {hero ? (
              <>
                {hero.debut}{" "}
                <span className="font-marqueur font-normal tracking-normal md:text-[66px]">{hero.marqueur}</span>
                {hero.fin}
              </>
            ) : (
              article.titre
            )}
          </h1>
        </div>
      </BandeauPaysage>

      <article className="mx-auto flex w-full max-w-[1232px] justify-center px-4 pt-12 pb-12 md:pt-[76px] md:pb-[70px]">
        <Markdown contenu={article.contenu} className={STYLE_CORPS} />
      </article>

      {autres.length > 0 ? (
        <section className="mx-auto flex w-full max-w-[1232px] flex-col gap-6 px-4 pt-6 pb-16 md:pt-[42px] md:pb-[70px]">
          <h2 className="text-[32px] font-bold md:text-[40px]">
            À lire <Marqueur taille={38}>aussi</Marqueur>
          </h2>
          <div className="flex flex-col gap-[18px] md:flex-row">
            {autres.map((a) => (
              <CarteArticle key={a.id} article={a} className="flex-1" />
            ))}
          </div>
        </section>
      ) : null}

      <div className="px-2 md:px-3">
        <section
          className="flex flex-col items-center gap-[18px] rounded-[24px] py-[46px] text-white"
          style={{
            backgroundImage:
              "url(/figma/images/texture-bouton.png), linear-gradient(160deg, #2244bb 8.1%, #2453cd 39.8%, #2460de 69.9%, #1d54d5 89.4%)",
            backgroundSize: "100px 100px, auto",
          }}
        >
          <h2 className="text-[40px] font-bold tracking-[-1.68px] md:text-[56px]">
            Un <span className="font-marqueur font-normal tracking-normal">projet</span> ?
          </h2>
          <Link href={LIENS.contact} className="inline-flex h-9 items-center gap-1 rounded-full bg-white px-2.5 text-sm font-medium text-[#0a0a0d] transition-transform duration-150 active:scale-[0.97] motion-reduce:transform-none max-md:min-h-11">
            Demander un devis gratuit
            <Icone nom="fleche-droite" taille={16} />
          </Link>
        </section>
      </div>
    </>
  );
}
