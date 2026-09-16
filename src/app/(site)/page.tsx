import type { Metadata } from "next";

import { ToileMaillage } from "@/components/commun/toile-maillage";
import { APropos } from "@/components/sections/a-propos";
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
 * que vous savez le faire → qui est derrière → comment ça se passe → combien ça coûte → est-ce
 * que d'autres ont été contents → on y va.
 *
 * La nappe de points est posée ici, en fond **fixe de toute la page** et non
 * dans le hero : elle accompagne la lecture d'un bout à l'autre, et la houle
 * glisse au rythme du défilement. Le masque radial garde le centre de la
 * fenêtre dégagé, donc le texte reste lisible partout — c'est ce qui permet de
 * la laisser présente sans qu'elle devienne du papier peint.
 */
export default function Accueil() {
  return (
    <>
      <ToileMaillage fixe />

      <Hero />
      <Services />
      <RealisationsVedette />
      <APropos />
      <Demarche />
      <ApercuTarifs />
      <AvisSection />
      <AppelAction />
    </>
  );
}
