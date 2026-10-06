import { Separator } from "@appica/ui-react/separator";
import { Thumbnail } from "@appica/ui-react/thumbnail";
import { Clock, FileCode2, KeyRound, LifeBuoy } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { TitreSection } from "@/components/commun/titre-section";

/**
 * Les engagements.
 *
 * Quatre promesses tenables, écrites comme des contraintes pour moi et non
 * comme des avantages pour la vitrine. Une garantie qu'on ne peut pas réclamer
 * n'est pas une garantie : chacune dit ce qui se passe si elle n'est pas
 * tenue.
 */
const ENGAGEMENTS = [
  {
    titre: "Le prix du devis est le prix final",
    texte:
      "Le périmètre est écrit avant de commencer. Si une demande sort du cadre en cours de route, elle fait l'objet d'un avenant chiffré que vous acceptez ou non — jamais d'une ligne surprise sur la facture.",
    icone: FileCode2,
  },
  {
    titre: "Tout est à votre nom",
    texte:
      "Le code, le nom de domaine, l'hébergement, les comptes des outils. Vous pouvez partir avec et confier la suite à quelqu'un d'autre : c'est votre site, pas une location.",
    icone: KeyRound,
  },
  {
    titre: "Une réponse sous 24 heures ouvrées",
    texte:
      "Pendant le projet comme après. Si je suis indisponible plus de deux jours, vous êtes prévenu à l'avance, avec une date de retour.",
    icone: Clock,
  },
  {
    titre: "Trente jours de corrections incluses",
    texte:
      "Après la mise en ligne, tout ce qui ne fonctionne pas comme prévu au devis est corrigé sans frais. Les nouvelles idées, elles, se chiffrent — c'est la seule façon de rester honnête des deux côtés.",
    icone: LifeBuoy,
  },
];

export function Garanties() {
  return (
    <section className="conteneur py-20 sm:py-28">
      <TitreSection
        surtitre="Les engagements"
        titre="Ce sur quoi vous pouvez me tenir"
        sousTitre="Quatre promesses simples, vérifiables, et écrites dans le devis."
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
        {ENGAGEMENTS.map((engagement, index) => (
          <Apparait key={engagement.titre} delai={index * 70} className="bg-card p-6 sm:p-8">
            <Thumbnail variant="icon-primary" shape="rounded" size="sm">
              <engagement.icone strokeWidth={1.75} aria-hidden="true" />
            </Thumbnail>
            <h3 className="mt-5 text-lg font-semibold">{engagement.titre}</h3>
            <Separator className="my-4" />
            <p className="text-sm leading-relaxed text-muted-foreground">{engagement.texte}</p>
          </Apparait>
        ))}
      </div>
    </section>
  );
}
