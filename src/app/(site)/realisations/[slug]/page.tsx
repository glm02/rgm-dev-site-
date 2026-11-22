import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/commun/json-ld";
import { BandeauPaysage } from "@/components/rgm/bandeau";
import { FOND_TEXTURE, LOGOS_CLIENTS } from "@/components/rgm/blocs-service";
import { FICHES, type FicheProjet } from "@/components/rgm/fiches-projets";
import { Icone } from "@/components/rgm/icones";
import { LIENS } from "@/components/rgm/liens";
import { TuileIcone } from "@/components/rgm/primitives";
import { AppelAction } from "@/components/rgm/sections-accueil";
import { listerAvis, listerProjets, projetParSlug } from "@/lib/donnees";
import { duree, fourchetteProjet } from "@/lib/format";
import type { Projet } from "@/lib/types";
import { jsonLdFilAriane, jsonLdProjet, metadonnees } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  const projets = await listerProjets();
  return projets.map((projet) => ({ slug: projet.slug }));
}

export async function generateMetadata({ params }: PageProps<"/realisations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const projet = await projetParSlug(slug);
  if (!projet) return metadonnees({ titre: "Projet introuvable", description: "", chemin: `/realisations/${slug}`, horsIndex: true });
  return metadonnees({
    titre: projet.seo_titre ?? `${projet.titre} — étude de cas`,
    description: projet.seo_description ?? projet.resume,
    chemin: `/realisations/${projet.slug}`,
    image: projet.image_couverture,
  });
}

function ficheDepuisProjet(p: Projet, suivant: string): FicheProjet {
  const prix = fourchetteProjet(p.prix_min, p.prix_max);
  return {
    sousTitre: p.secteur ?? "",
    resume: p.resume,
    secteur: p.secteur ?? "",
    budget: prix ?? undefined,
    duree: duree(p.duree_jours) ?? undefined,
    besoin: p.probleme ?? "",
    solution: p.solution ?? "",
    resultat: p.resultat ?? undefined,
    livrables: ["Site sur mesure", "Mise en ligne", "Suivi"],
    outils: p.stack.map((nom) => ({ nom })),
    service: { libelle: "Sites web", href: LIENS.sitesWeb },
    suivant,
  };
}

function LienExterne() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

const PILULE = "inline-flex h-8 items-center gap-1 rounded-full bg-[#171717] px-2.5 text-sm font-medium text-[#fafafa]";

export default async function PageProjet({ params }: PageProps<"/realisations/[slug]">) {
  const { slug } = await params;
  const projet = await projetParSlug(slug);
  if (!projet) notFound();

  const [avis, projets] = await Promise.all([listerAvis({ projetId: projet.id }), listerProjets()]);
  const index = projets.findIndex((p) => p.slug === projet.slug);
  const suivantParDefaut = projets[(index + 1) % projets.length]?.slug ?? projet.slug;
  const fiche = FICHES[projet.slug] ?? ficheDepuisProjet(projet, suivantParDefaut);
  const suivant = projets.find((p) => p.slug === fiche.suivant) ?? projets[(index + 1) % projets.length];
  const logo = LOGOS_CLIENTS[projet.slug];

  const infos = [
    { libelle: "Secteur", valeur: fiche.secteur },
    { libelle: "Budget", valeur: fiche.budget },
    { libelle: "Durée", valeur: fiche.duree },
  ].filter((i): i is { libelle: string; valeur: string } => Boolean(i.valeur));

  const recits = [
    { titre: "Le besoin", texte: fiche.besoin },
    { titre: "La solution", texte: fiche.solution },
    { titre: "Le résultat", texte: fiche.resultat },
  ].filter((r): r is { titre: string; texte: string } => Boolean(r.texte));

  return (
    <>
      <JsonLd donnees={jsonLdProjet(projet, avis)} />
      <JsonLd
        donnees={jsonLdFilAriane([
          { nom: "Accueil", href: "/" },
          { nom: "Réalisations", href: LIENS.realisations },
          { nom: projet.titre, href: `${LIENS.realisations}/${projet.slug}` },
        ])}
      />

      <BandeauPaysage paysage="nuages" decalage={-126} hauteur={350} hauteurMobile={290} voile="clair">
        <div className="flex w-full max-w-[1050px] flex-col items-center gap-3 text-center text-white">
          {logo ? (
            <span className="flex items-center rounded-[7px] bg-white p-[5px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt="" width={24} height={24} className="size-6 object-contain" />
            </span>
          ) : null}
          <h1 className="font-titre text-[44px] leading-[1.05] font-bold tracking-[-1.76px] md:text-[96px] md:tracking-[-3.84px]">{projet.titre}</h1>
          <p className="text-base leading-[1.2] md:text-[18px]">{fiche.sousTitre}</p>
        </div>
      </BandeauPaysage>

      <article className="mx-auto flex w-full max-w-[1232px] flex-col gap-[38px] px-4 pt-10 pb-14 md:pt-[54px]">
        <section className="flex flex-col gap-[18px]">
          <h2 className="text-[34px] leading-[1.12] font-bold tracking-[-1.36px] md:text-[42px] md:tracking-[-1.68px]">Le projet</h2>
          <p className="max-w-[800px] text-[18px] leading-[1.44] md:text-[20px]">{fiche.resume}</p>
          <div className="flex flex-col gap-3 md:flex-row">
            {infos.map((i) => (
              <div key={i.libelle} className="flex flex-1 flex-col gap-1 rounded-[16px] border border-border bg-white px-4 py-[13px] leading-[1.29]">
                <span className="text-[13px] font-medium">{i.libelle}</span>
                <span className="text-[22px] font-semibold tracking-[-0.22px]">{i.valeur}</span>
              </div>
            ))}
          </div>
        </section>

        {projet.image_couverture ? (
          fiche.apercu3d ? (
            <div className="relative h-[300px] overflow-hidden rounded-[16px] md:h-[590px]" style={{ ...FOND_TEXTURE, perspective: 1480 }}>
              <div className="absolute inset-0 hidden md:block" style={{ transformStyle: "preserve-3d" }}>
                <div
                  className="absolute top-9 left-[7%] h-[524px] w-[72%] overflow-hidden rounded-[16px] border border-border shadow-[0_18px_38px_rgba(6,24,92,0.2)]"
                  style={{ transform: "translateZ(6px) rotateX(8deg) rotateY(-10deg) rotateZ(-2deg)" }}
                >
                  <Image src={projet.image_couverture} alt={`Capture du site ${projet.titre}`} fill sizes="860px" className="object-cover object-top" priority />
                </div>
                <div
                  className="absolute top-[400px] left-[66%] flex w-[350px] items-center gap-[13px] rounded-[16px] border border-border bg-white px-[18px] py-[17px] shadow-[0_12px_31px_rgba(6,24,92,0.24)]"
                  style={{ transform: "translateZ(88px) rotateX(4deg) rotateY(-5deg)" }}
                >
                  <TuileIcone nom="edit" />
                  <div className="flex flex-col items-start gap-1 leading-[1.21]">
                    <span className="text-[22px] font-semibold">Demande de devis</span>
                    <span className="text-base">Ramonage</span>
                    <span className="inline-flex h-[22px] items-center rounded-full bg-secondary px-2 text-xs font-medium">À valider</span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-4 overflow-hidden rounded-[12px] border border-border md:hidden">
                <Image src={projet.image_couverture} alt={`Capture du site ${projet.titre}`} fill sizes="100vw" className="object-cover object-top" />
              </div>
            </div>
          ) : (
            <div className="relative h-[240px] overflow-hidden rounded-[16px] border border-border md:h-[590px]">
              <Image src={projet.image_couverture} alt={`Capture du site ${projet.titre}`} fill sizes="(min-width: 1232px) 1200px, 100vw" className="object-cover object-top" priority />
            </div>
          )
        ) : null}

        <section className={`grid gap-6 md:gap-[26px] ${recits.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {recits.map((r) => (
            <div key={r.titre} className="flex flex-col gap-2">
              <h2 className="text-[24px] leading-[1.29] font-semibold tracking-[-0.54px] md:text-[27px]">{r.titre}</h2>
              <p className="text-[17px] leading-[1.5]">{r.texte}</p>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-[17px] rounded-[16px] p-[22px]" style={FOND_TEXTURE}>
          <h2 className="text-[28px] leading-[1.29] font-bold tracking-[-0.96px] md:text-[32px]">Ce qui a été livré</h2>
          <div className="flex flex-col gap-3 md:flex-row">
            {fiche.livrables.map((l) => (
              <div key={l} className="flex flex-1 items-center gap-2.5 rounded-[16px] border border-border bg-white py-[13px] pr-3 pl-[17px]">
                <TuileIcone nom="check" />
                <span className="text-base leading-[1.32] font-medium">{l}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-[9px]">
          <h2 className="text-[24px] leading-[1.29] font-semibold tracking-[-0.54px] md:text-[27px]">Technologies</h2>
          <div className="flex flex-wrap gap-[7px]">
            {fiche.outils.map((o) => (
              <span key={o.nom} className="inline-flex items-center gap-[5px] rounded-[8px] bg-[#f7f9fe] px-[9px] py-1.5 text-[13px] leading-[1.29] font-medium">
                {o.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={o.logo} alt="" width={17} height={17} className="size-[17px] object-contain" />
                ) : o.nom === "JavaScript" ? (
                  <span aria-hidden className="flex size-[17px] items-end justify-end rounded-[2px] bg-[#f7df1e] pr-[2px] text-[8px] leading-none font-bold text-black">
                    JS
                  </span>
                ) : null}
                {o.nom}
              </span>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {projet.url_live && fiche.apercu3d ? (
            <a href={projet.url_live} target="_blank" rel="noopener" className={PILULE}>
              Voir le site
              <LienExterne />
            </a>
          ) : null}
          <Link href={LIENS.realisations} className={`${PILULE} ${fiche.apercu3d ? "" : "mx-auto"}`}>
            Toutes les réalisations
            <LienExterne />
          </Link>
        </div>
      </article>

      <div className="px-2 md:px-3">
        <AppelAction />
      </div>

      <nav aria-label="Suite" className="mx-auto flex w-full max-w-[1416px] flex-col gap-4 px-4 pt-10 pb-14 md:flex-row md:px-[108px] md:pt-16 md:pb-20">
        {[
          { libelle: "Service", titre: fiche.service.libelle, href: fiche.service.href },
          ...(suivant ? [{ libelle: "Projet suivant", titre: suivant.titre, href: `${LIENS.realisations}/${suivant.slug}` }] : []),
        ].map((l) => (
          <Link
            key={l.libelle}
            href={l.href}
            className="flex flex-1 items-center justify-between rounded-[16px] border border-border bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <span className="flex flex-col gap-1">
              <span className="text-[13px] font-medium">{l.libelle}</span>
              <span className="text-[18px] font-semibold">{l.titre}</span>
            </span>
            <Icone nom="fleche-droite" taille={20} className="text-primary" />
          </Link>
        ))}
      </nav>
    </>
  );
}
