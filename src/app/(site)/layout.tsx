import { Entete } from "@/components/site/entete";
import { Pied } from "@/components/site/pied";
import { JsonLd } from "@/components/commun/json-ld";
import { noteGlobale } from "@/lib/donnees";
import { jsonLdEntreprise } from "@/lib/seo";

/**
 * Le chrome du site public : entête, pied de page, et la fiche d'entreprise en
 * données structurées.
 *
 * La fiche est posée ici plutôt que sur chaque page pour qu'elle existe une
 * seule fois et partout à la fois. Son `@id` sert de point d'ancrage : les
 * pages service et projet s'y réfèrent au lieu de la répéter.
 */
export default async function LayoutSite({ children }: LayoutProps<"/">) {
  const note = await noteGlobale();

  return (
    <>
      <JsonLd donnees={jsonLdEntreprise(note)} />

      {/* Le lien d'évitement : premier élément focusable de la page, invisible
          jusqu'à ce qu'on l'atteigne au clavier. */}
      <a
        href="#contenu"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[60] focus-visible:rounded-lg focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2.5 focus-visible:text-sm focus-visible:font-medium focus-visible:text-primary-foreground"
      >
        Aller au contenu
      </a>

      <Entete />

      <main id="contenu" className="flex-1">
        {children}
      </main>

      <Pied />
    </>
  );
}
