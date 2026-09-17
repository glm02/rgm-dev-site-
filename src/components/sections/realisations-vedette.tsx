import { Button } from "@appica/ui-react/button";
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

  // Ni filet ni aplat opaque : la nappe 3D passe derrière toute la page
  // d'accueil, et une bordure pleine la coupait net comme une image tronquée.
  // Un voile très léger suffit à marquer le changement de section.
  return (
    <section className="bg-linear-to-b from-transparent via-secondary/40 to-transparent py-20 sm:py-28">
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
          <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/realisations" />}>
            Voir toutes les réalisations
            <ArrowRight data-icon="end" aria-hidden="true" />
          </Button>
        </Apparait>
      </div>
    </section>
  );
}
