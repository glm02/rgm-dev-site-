import type { Metadata } from "next";

import { BandeauPaysage } from "@/components/rgm/bandeau";
import { LOGOS_CLIENTS } from "@/components/rgm/blocs-service";
import { GrilleRealisations } from "@/components/rgm/grille-realisations";
import { AppelAction, SECTEUR_COURT } from "@/components/rgm/sections-accueil";
import { listerProjets } from "@/lib/donnees";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Réalisations — sites et automatisations livrés",
  description:
    "Les projets livrés par RGM Dev : contexte, problème, solution, stack technique et budget. Sites vitrines, réservation en ligne, refontes.",
  chemin: "/realisations",
});

export const revalidate = 300;

const TEXTES: Record<string, string> = {
  "atout-travaux": "Un site de devis et des agents IA pour un artisan chauffagiste et ramoneur.",
  "campagne-vallauris": "Réservation directe, calendrier et espace voyageur pour un domaine de chambres d’hôtes.",
  "liccia-immo": "Refonte d’agence immobilière avec annonces, recherche et espace de gestion.",
  "le-k-repare": "Site vitrine mobile pour un atelier de réparation à la Croix-Rousse.",
  "la-santon": "Réservation et paiement en ligne pour une maison d’hôtes et ses gîtes.",
};

const LOGOS_BANDE = ["atout-travaux", "campagne-vallauris", "liccia-immo", "la-santon"];

export default async function PageRealisations() {
  const projets = await listerProjets();
  const cartes = projets.map((p) => ({
    id: p.id,
    slug: p.slug,
    titre: p.titre,
    image_couverture: p.image_couverture,
    badge: SECTEUR_COURT[p.slug] ?? p.secteur ?? "",
    texte: TEXTES[p.slug] ?? p.resume,
  }));

  return (
    <>
      <BandeauPaysage paysage="nuages" decalage={-126} hauteur={350} hauteurMobile={290} voile="clair">
        <h1 className="font-marqueur text-[56px] leading-[1.05] text-white md:text-[87px]">Réalisations</h1>
      </BandeauPaysage>

      <section className="mx-auto flex w-full max-w-[1416px] flex-col gap-10 px-4 pt-10 pb-16 md:px-[108px] md:pt-16 md:pb-24">
        {cartes.length > 0 ? (
          <GrilleRealisations projets={cartes} />
        ) : (
          <p className="py-16 text-center">Les fiches projet arrivent.</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-8 py-4 md:gap-16">
          {LOGOS_BANDE.map((slug) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={slug} src={LOGOS_CLIENTS[slug].src} alt="" width={112} height={44} className="h-11 w-28 object-contain" />
          ))}
        </div>
      </section>

      <div className="px-2 md:px-3">
        <AppelAction />
      </div>
    </>
  );
}
