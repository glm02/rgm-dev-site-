import type { Metadata } from "next";

import { ToileMaillage } from "@/components/commun/toile-maillage";
import { APropos } from "@/components/sections/a-propos";
import { AppelAction } from "@/components/sections/appel-action";
import { ApercuTarifs } from "@/components/sections/apercu-tarifs";
import { AvisSection } from "@/components/sections/avis-section";
import { CalculateurGain } from "@/components/sections/calculateur-gain";
import { Clients } from "@/components/sections/clients";
import { Comparatif } from "@/components/sections/comparatif";
import { Demarche } from "@/components/sections/demarche";
import { Faq } from "@/components/sections/faq";
import { Garanties } from "@/components/sections/garanties";
import { Hero } from "@/components/sections/hero";
import { RealisationsVedette } from "@/components/sections/realisations-vedette";
import { Services } from "@/components/sections/services";
import { listerOffres } from "@/lib/donnees";
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
 * où il se la pose : qu'est-ce que c'est → qui vous a déjà fait confiance → qu'est-ce que vous faites → est-ce
 * que vous savez le faire → qui est derrière → comment ça se passe → combien
 * je perds aujourd'hui → combien ça coûte → pourquoi vous plutôt qu'une
 * agence → qu'est-ce qui me protège → est-ce que d'autres ont été contents →
 * et mes doutes → on y va.
 *
 * La nappe de points est posée ici, en fond **fixe de toute la page** et non
 * dans le hero : elle accompagne la lecture d'un bout à l'autre, et la houle
 * glisse au rythme du défilement. Le masque radial garde le centre de la
 * fenêtre dégagé, donc le texte reste lisible partout — c'est ce qui permet de
 * la laisser présente sans qu'elle devienne du papier peint.
 */
export default async function Accueil() {
  // Le calculateur chiffre le projet avec la vraie fourchette de l'offre
  // « Automatisation d'un processus » : si le prix change dans l'admin, le
  // calcul d'amortissement suit.
  const offres = await listerOffres();
  const automatisation =
    offres.find((o) => o.nom.toLowerCase().startsWith("automatisation")) ??
    offres.find((o) => o.en_vedette);
  const prixMin = automatisation?.prix_min ?? 1200;
  const prixMax = automatisation?.prix_max ?? automatisation?.prix_min ?? 4000;

  return (
    <>
      <ToileMaillage fixe />

      <Hero />
      <Clients />
      <Services />
      <RealisationsVedette />
      <APropos />
      <Demarche />
      <CalculateurGain prixMin={prixMin} prixMax={prixMax} />
      <ApercuTarifs />
      <Comparatif />
      <Garanties />
      <AvisSection />
      <Faq />
      <AppelAction />
    </>
  );
}
