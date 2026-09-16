import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { CarteAvis } from "@/components/commun/carte-avis";
import { Etoiles } from "@/components/commun/etoiles";
import { AppelAction } from "@/components/sections/appel-action";
import { listerAvis, listerProjets, noteGlobale } from "@/lib/donnees";
import { metadonnees } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = metadonnees({
  titre: "Avis clients",
  description:
    "Les témoignages des clients de RGM Dev, déposés depuis leur espace après livraison. Aucun avis n'est écrit par nous.",
  chemin: "/avis",
});

export default async function PageAvis() {
  const [avis, note, projets] = await Promise.all([
    listerAvis(),
    noteGlobale(),
    listerProjets(),
  ]);

  const slugParProjet = new Map(projets.map((projet) => [projet.id, projet.slug]));

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="halo-bleu pointer-events-none absolute inset-x-0 top-0 h-80"
        />

        <div className="conteneur relative pt-14 sm:pt-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-semibold sm:text-5xl">Avis clients</h1>
            <p className="mt-5 text-lg leading-relaxed text-balance text-muted-foreground">
              Chaque avis publié ici a été déposé par le client lui-même, depuis son
              espace, une fois son projet livré. Je n&apos;en écris aucun, et je n&apos;en
              supprime aucun.
            </p>

            {note && (
              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5">
                <Etoiles note={note.moyenne} taille="lg" />
                <span className="text-sm">
                  <span className="font-semibold tabular-nums">
                    {note.moyenne.toLocaleString("fr-FR", { minimumFractionDigits: 1 })}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    sur 5 — {note.nombre} avis
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="conteneur py-16 sm:py-20">
        {avis.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {avis.map((un, index) => (
              <Apparait key={un.id} delai={(index % 3) * 70} className="h-full">
                <CarteAvis
                  avis={un}
                  projetSlug={un.projet_id ? slugParProjet.get(un.projet_id) : null}
                />
              </Apparait>
            ))}
          </div>
        ) : (
          <Apparait className="mx-auto max-w-xl rounded-2xl border border-dashed border-border bg-secondary/30 p-10 text-center">
            <h2 className="text-xl font-semibold">Aucun avis publié pour l&apos;instant</h2>
            <p className="mt-3.5 leading-relaxed text-muted-foreground">
              Les premiers projets viennent d&apos;être livrés et les témoignages ne sont
              pas encore rentrés. Plutôt que de remplir cette page avec des phrases
              inventées, elle reste vide — c&apos;est plus honnête, et vous saurez que
              ceux qui y figureront un jour sont vrais.
            </p>

            <Link
              href="/realisations"
              className={cn(
                "group mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5",
                "text-sm font-medium text-primary-foreground",
                "transition-[background-color,scale] duration-150 ease-out",
                "hover:bg-bleu-700 active:scale-96 dark:hover:bg-bleu-400",
              )}
            >
              Juger sur le travail
              <ArrowRight
                className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </Apparait>
        )}
      </section>

      <section className="conteneur pb-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-secondary/30 p-7 text-center">
          <h2 className="text-lg font-semibold">Vous avez travaillé avec moi ?</h2>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
            Connectez-vous à votre espace client pour déposer votre avis. Il sera publié
            tel quel, sans retouche.
          </p>
          <Link
            href="/compte"
            className="mt-5 inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-[background-color,scale] duration-150 ease-out hover:bg-secondary active:scale-96"
          >
            Accéder à mon espace
          </Link>
        </div>
      </section>

      <AppelAction />
    </>
  );
}
