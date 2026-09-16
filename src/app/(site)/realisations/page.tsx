import type { Metadata } from "next";

import { Apparait } from "@/components/commun/apparait";
import { CarteProjet } from "@/components/commun/carte-projet";
import { AppelAction } from "@/components/sections/appel-action";
import { listerProjets } from "@/lib/donnees";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Réalisations — sites et automatisations livrés",
  description:
    "Les projets livrés par RGM Dev : contexte, problème, solution, stack technique et budget. Sites vitrines, réservation en ligne, cartographie de données.",
  chemin: "/realisations",
});

export default async function PageRealisations() {
  const projets = await listerProjets();

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="halo-bleu pointer-events-none absolute inset-x-0 top-0 h-80"
        />

        <div className="conteneur relative pt-14 sm:pt-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-semibold sm:text-5xl">Réalisations</h1>
            <p className="mt-5 text-lg leading-relaxed text-balance text-muted-foreground">
              Chaque fiche dit le problème de départ, ce que j&apos;ai construit, ce que
              ça a donné — et ce que ça a coûté. Rien de tout ça n&apos;est
              habituellement écrit, et c&apos;est précisément ce qu&apos;on veut savoir.
            </p>
          </div>
        </div>
      </section>

      <section className="conteneur py-16 sm:py-20">
        {projets.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projets.map((projet, index) => (
              <Apparait key={projet.id} delai={(index % 3) * 70} className="h-full">
                <CarteProjet projet={projet} priorite={index < 3} />
              </Apparait>
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-muted-foreground">
            Les fiches projet arrivent.
          </p>
        )}
      </section>

      <AppelAction
        titre="Le vôtre pourrait être le prochain"
        texte="Dites-moi ce que vous avez en tête. Je vous réponds sous 48 heures avec un périmètre écrit et un prix ferme."
      />
    </>
  );
}
