import type { Metadata } from "next";

import { JsonLd } from "@/components/commun/json-ld";
import { Bandeau } from "@/components/rgm/bandeau";
import { Faq } from "@/components/rgm/faq";
import {
  AppelAction,
  BandeOutils,
  CeQueJeFais,
  CommentCaSePasse,
  DesPrixAffiches,
  FAQ_ACCUEIL,
  HeroAccueil,
  PlusQuunChatbot,
  Preuves,
  RealisationsAccueil,
} from "@/components/rgm/sections-accueil";
import { listerProjets } from "@/lib/donnees";
import { metadonnees } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = metadonnees({
  titre: `${SITE.nom} — Développeur freelance à ${SITE.ville}`,
  description: SITE.promesse,
  chemin: "/",
});

export const revalidate = 300;

export default async function Accueil() {
  const projets = await listerProjets();

  return (
    <>
      <JsonLd
        donnees={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ACCUEIL.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.r },
          })),
        }}
      />
      <Bandeau hauteur="accueil" cadrage={{ desktop: { taille: "177.7% auto", position: "50% 0%" }, mobile: { taille: "auto 100%", position: "50% 0%" } }}>
        <HeroAccueil />
      </Bandeau>
      <Preuves nbProjets={projets.length} />
      <CeQueJeFais />
      <PlusQuunChatbot />
      <BandeOutils />
      <RealisationsAccueil projets={projets} />
      <CommentCaSePasse />
      <DesPrixAffiches />
      <Faq questions={FAQ_ACCUEIL} />
      <div className="px-2 pb-2 md:px-3 md:pb-3">
        <AppelAction />
      </div>
    </>
  );
}
