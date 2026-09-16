import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { CarteProjet } from "@/components/commun/carte-projet";
import { TitreSection } from "@/components/commun/titre-section";
import { listerProjets } from "@/lib/donnees";
import { cn } from "@/lib/utils";

/** Les réalisations mises en avant, en page d'accueil. */
export async function RealisationsVedette() {
  const projets = await listerProjets({ enVedette: true, limite: 3 });

  if (projets.length === 0) return null;

  return (
    <section className="border-y border-border bg-secondary/30 py-20 sm:py-28">
      <div className="conteneur">
        <TitreSection
          surtitre="Réalisations"
          titre="Des sites en production, avec leur budget"
          sousTitre="Pas de maquettes, pas de concepts : des projets livrés, en ligne, et ce qu'ils ont coûté."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projets.map((projet, index) => (
            <Apparait key={projet.id} delai={index * 70} className="h-full">
              <CarteProjet projet={projet} priorite={index === 0} />
            </Apparait>
          ))}
        </div>

        <Apparait className="mt-12 text-center">
          <Link
            href="/realisations"
            className={cn(
              "group inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-5",
              "text-sm font-medium text-foreground",
              "transition-[background-color,scale] duration-150 ease-out",
              "hover:bg-secondary active:scale-96",
            )}
          >
            Voir toutes les réalisations
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
