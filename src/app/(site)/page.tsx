import type { Metadata } from "next";

import { AppelAction } from "@/components/sections/appel-action";
import { ApercuTarifs } from "@/components/sections/apercu-tarifs";
import { AvisSection } from "@/components/sections/avis-section";
import { Demarche } from "@/components/sections/demarche";
import { Hero } from "@/components/sections/hero";
import { RealisationsVedette } from "@/components/sections/realisations-vedette";
import { Services } from "@/components/sections/services";
import { metadonnees } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = metadonnees({
  titre: `${SITE.nom} — Développeur freelance à ${SITE.ville}`,
  description: SITE.promesse,
  chemin: "/",
});

/**
 * L'accueil.
 *
 * L'ordre des sections suit la question que se pose le visiteur, dans l'ordre
 * où il se la pose : qu'est-ce que c'est → qu'est-ce que vous faites → est-ce
 * que vous savez le faire → comment ça se passe → combien ça coûte → est-ce
 * que d'autres ont été contents → on y va.
 */
export default function Accueil() {
  return (
    <>
      <Hero />
      <Services />
      <RealisationsVedette />
      <Demarche />
      <ApercuTarifs />
      <AvisSection />
      <AppelAction />
    </>
  );
}
