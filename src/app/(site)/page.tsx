import type { Metadata } from "next";

import { Panneau } from "@/components/commun/panneau";
import { ToileMaillage } from "@/components/commun/toile-maillage";
import { APropos } from "@/components/sections/a-propos";
import { AppelAction } from "@/components/sections/appel-action";
import { ApercuTarifs } from "@/components/sections/apercu-tarifs";
import { AvisSection } from "@/components/sections/avis-section";
import { CalculateurGain } from "@/components/sections/calculateur-gain";
import { Clients } from "@/components/sections/clients";
import { Comparatif } from "@/components/sections/comparatif";
import { Demarche } from "@/components/sections/demarche";
import { DerniersArticles } from "@/components/sections/derniers-articles";
import { Faq } from "@/components/sections/faq";
import { Garanties } from "@/components/sections/garanties";
import { Hero } from "@/components/sections/hero";
import { RealisationsVedette } from "@/components/sections/realisations-vedette";
import { Services } from "@/components/sections/services";
import { SupervisionDirect } from "@/components/sections/supervision-direct";
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
 * agence → qu'est-ce qui me protège → et après la livraison → est-ce que d'autres ont été contents →
 * et mes doutes → on y va.
 *
 * La nappe de points est posée ici, en fond **fixe de toute la page** et non
 * dans le hero : elle accompagne la lecture d'un bout à l'autre, et la houle
 * glisse au rythme du défilement. Les sections reposent chacune sur un
 * `Panneau` opaque : le texte ne se lit jamais sur les points, la nappe ne
 * reste visible que dans les marges et entre deux panneaux.
 */
/**
 * Régénérée toutes les 5 minutes : la section supervision affiche des mesures
 * réelles, et un article ou une réalisation publiés apparaissent sans
 * redéploiement. La page reste servie en statique entre deux régénérations.
 */
export const revalidate = 300;

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

      {/* Chaque section repose sur son panneau opaque : les points ne passent
          plus derrière le texte, ils ne se voient qu'entre les panneaux. */}
      <div className="flex flex-col gap-5 px-3 pt-3 pb-8 sm:gap-6 sm:px-6 sm:pt-4">
        <Panneau>
          <Hero />
        </Panneau>
        <Panneau>
          <Clients />
        </Panneau>
        <Panneau>
          <Services />
        </Panneau>
        <Panneau>
          <RealisationsVedette />
        </Panneau>
        <Panneau>
          <APropos />
        </Panneau>
        <Panneau>
          <Demarche />
        </Panneau>
        <Panneau>
          <CalculateurGain prixMin={prixMin} prixMax={prixMax} />
        </Panneau>
        <Panneau>
          <ApercuTarifs />
        </Panneau>
        <Panneau>
          <Comparatif />
        </Panneau>
        <Panneau>
          <Garanties />
        </Panneau>
        <Panneau>
          <SupervisionDirect />
        </Panneau>
        <Panneau>
          <AvisSection />
        </Panneau>
        <Panneau>
          <DerniersArticles />
        </Panneau>
        <Panneau>
          <Faq />
        </Panneau>
        <Panneau className="py-8 sm:py-10">
          <AppelAction />
        </Panneau>
      </div>
    </>
  );
}
