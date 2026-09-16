import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { CarteOffre } from "@/components/commun/carte-offre";
import { TitreSection } from "@/components/commun/titre-section";
import { offresParService } from "@/lib/donnees";
import type { Offre } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Un aperçu des tarifs en page d'accueil.
 *
 * **Une offre par métier, et l'automatisation IA au centre.** C'est le service
 * à plus forte marge et celui que RGM Dev met en avant : le laisser en
 * troisième position derrière deux offres web reviendrait à le vendre à
 * regret. La carte bleue est donc imposée ici, sans dépendre du drapeau
 * `en_vedette` de la base — qui en marque plusieurs, ce qui est correct pour la
 * page tarifs complète mais donnerait deux cartes concurrentes ici.
 *
 * L'ordre de la grille — web, IA, maintenance — n'est pas décoratif : il va du
 * budget ponctuel le plus courant au plus engageant, puis au récurrent.
 */
export async function ApercuTarifs() {
  const groupes = await offresParService();

  const offreDe = (slug: string, choisir?: (offre: Offre) => boolean) => {
    const groupe = groupes.find((item) => item.service.slug === slug);
    if (!groupe) return undefined;
    return (choisir ? groupe.offres.find(choisir) : undefined) ?? groupe.offres[0];
  };

  const web = offreDe("sites-web");
  const ia = offreDe("automatisation-ia", (offre) => offre.en_vedette);
  const maintenance = offreDe("maintenance-supervision");

  const selection = [
    { offre: web, vedette: false },
    { offre: ia, vedette: true },
    { offre: maintenance, vedette: false },
  ].filter(
    (item): item is { offre: Offre; vedette: boolean } => item.offre !== undefined,
  );

  if (selection.length === 0) return null;

  return (
    <section className="border-y border-border bg-secondary/30 py-20 sm:py-28">
      <div className="conteneur">
        <TitreSection
          surtitre="Tarifs"
          titre="Les prix sont affichés"
          sousTitre="Un site, une automatisation, ou les deux — vous savez ce que ça coûte avant de décrocher le téléphone."
        />

        <div
          className={cn(
            "mt-16 grid items-stretch gap-5",
            selection.length === 2 && "mx-auto max-w-3xl md:grid-cols-2",
            selection.length >= 3 && "md:grid-cols-3",
          )}
        >
          {selection.map(({ offre, vedette }, index) => (
            <Apparait key={offre.id} delai={index * 70} className="h-full">
              <CarteOffre offre={offre} vedette={vedette} />
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
            {/* Le nombre est compté, pas écrit en dur : une offre ajoutée dans
                l'admin ne doit pas transformer ce lien en mensonge. */}
            Voir les {groupes.reduce((total, g) => total + g.offres.length, 0)} formules
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
