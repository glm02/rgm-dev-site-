import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { CarteOffre } from "@/components/commun/carte-offre";
import { TitreSection } from "@/components/commun/titre-section";
import { listerOffres } from "@/lib/donnees";
import { cn } from "@/lib/utils";

/**
 * Un aperçu des tarifs en page d'accueil.
 *
 * Trois offres seulement, choisies pour couvrir les trois budgets — petit,
 * moyen, récurrent. La page tarifs complète existe pour le reste ; ici, il
 * s'agit de répondre à « combien ça coûte ? » avant que le visiteur reparte.
 */
export async function ApercuTarifs() {
  const offres = await listerOffres();

  const vedette = offres.find((offre) => offre.en_vedette);
  const petit = offres.find((offre) => offre.unite === "forfait" && offre !== vedette);
  const recurrent = offres.find((offre) => offre.unite === "mois");

  const selection = [petit, vedette, recurrent].filter(
    (offre): offre is NonNullable<typeof offre> => Boolean(offre),
  );

  if (selection.length === 0) return null;

  return (
    <section className="border-y border-border bg-secondary/30 py-20 sm:py-28">
      <div className="conteneur">
        <TitreSection
          surtitre="Tarifs"
          titre="Les prix sont affichés"
          sousTitre="Parce que passer trois appels pour découvrir qu'on n'était pas dans le même budget fait perdre du temps à tout le monde."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {selection.map((offre, index) => (
            <Apparait key={offre.id} delai={index * 70} className="h-full">
              <CarteOffre offre={offre} />
            </Apparait>
          ))}
        </div>

        <Apparait className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Prix HT, à titre indicatif. Le devis est ferme une fois le périmètre écrit.
          </p>

          <Link
            href="/tarifs"
            className={cn(
              "group mt-5 inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-5",
              "text-sm font-medium",
              "transition-[background-color,scale] duration-150 ease-out",
              "hover:bg-secondary active:scale-96",
            )}
          >
            Voir tous les tarifs
            <ArrowRight
              className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Link>
        </Apparait>
      </div>
    </section>
  );
}
