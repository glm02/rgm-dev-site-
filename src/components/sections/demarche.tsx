import { Thumbnail } from "@appica/ui-react/thumbnail";
import { FileSignature, Hammer, PhoneCall, Rocket } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { TitreSection } from "@/components/commun/titre-section";

/**
 * Comment se déroule un projet.
 *
 * Quatre étapes, pas six : au-delà, personne ne lit. Chacune dit ce que *le
 * client* fait, pas seulement ce que fait le prestataire — c'est ce qui lève
 * la vraie inquiétude, celle de ne pas savoir ce qu'on attend de soi.
 */
const ETAPES = [
  {
    titre: "On se parle",
    delai: "30 minutes",
    texte:
      "Un appel pour comprendre votre activité, ce qui vous fait perdre du temps et ce que le projet doit produire. Gratuit, sans engagement, et si ce n'est pas pour moi je vous le dis tout de suite.",
    votrePart: "Raconter votre métier.",
    icone: PhoneCall,
  },
  {
    titre: "Vous recevez un devis chiffré",
    delai: "sous 48 h",
    texte:
      "Le périmètre écrit noir sur blanc, le prix ferme, le délai et ce qui n'est pas inclus. Pas de fourchette qui double en cours de route.",
    votrePart: "Lire, poser des questions, valider.",
    icone: FileSignature,
  },
  {
    titre: "Je construis, vous suivez",
    delai: "2 à 8 semaines",
    texte:
      "Vous avez un accès à votre espace client : l'avancement, les étapes franchies, les documents, et une adresse pour voir le site vivre au fur et à mesure.",
    votrePart: "Fournir les contenus, relire à chaque étape.",
    icone: Hammer,
  },
  {
    titre: "Mise en ligne et suivi",
    delai: "et après",
    texte:
      "Le site part en production, vous êtes formé au back-office, et la supervision se met en place : si quelque chose casse, je suis prévenu avant vous.",
    votrePart: "Faire tourner votre entreprise.",
    icone: Rocket,
  },
];

export function Demarche() {
  return (
    <section className="conteneur py-20 sm:py-28">
      <TitreSection
        surtitre="La démarche"
        titre="Comment ça se passe"
        sousTitre="Quatre étapes, aucune surprise. Vous savez à chaque instant où en est votre projet."
      />

      <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
        {ETAPES.map((etape, index) => (
          <Apparait
            key={etape.titre}
            as="li"
            delai={index * 70}
            className="flex flex-col bg-card p-6 sm:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              {/* L'icône dit l'action, le numéro dit l'ordre : les deux, parce
                  qu'une grille de quatre se lit aussi en colonne sur mobile. */}
              <span className="flex items-center gap-2.5">
                <Thumbnail variant="icon-primary" shape="rounded" size="sm">
                  <etape.icone strokeWidth={1.75} aria-hidden="true" />
                </Thumbnail>
                <span className="text-sm font-semibold text-bleu-700 tabular-nums dark:text-bleu-300">
                  0{index + 1}
                </span>
              </span>
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {etape.delai}
              </span>
            </div>

            <h3 className="mt-5 text-lg font-semibold">{etape.titre}</h3>

            <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
              {etape.texte}
            </p>

            <p className="mt-5 border-t border-border pt-4 text-sm">
              <span className="text-muted-foreground">Votre part — </span>
              <span className="font-medium">{etape.votrePart}</span>
            </p>
          </Apparait>
        ))}
      </ol>
    </section>
  );
}
