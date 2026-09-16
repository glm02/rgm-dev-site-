import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { CarteAvis } from "@/components/commun/carte-avis";
import { Etoiles } from "@/components/commun/etoiles";
import { TitreSection } from "@/components/commun/titre-section";
import { listerAvis, listerProjets, noteGlobale } from "@/lib/donnees";
import { cn } from "@/lib/utils";

/**
 * Les avis clients.
 *
 * S'il n'y en a aucun, la section ne disparaît pas et n'invente rien : elle le
 * dit, et renvoie vers les réalisations. Un site neuf sans témoignage est
 * normal ; un site neuf avec trois faux témoignages se repère, et coûte plus
 * cher en confiance que l'absence.
 */
export async function AvisSection() {
  const [avis, note, projets] = await Promise.all([
    listerAvis({ limite: 3 }),
    noteGlobale(),
    listerProjets({ limite: 1 }),
  ]);

  const slugParProjet = new Map(projets.map((projet) => [projet.id, projet.slug]));

  return (
    <section className="conteneur py-20 sm:py-28">
      <TitreSection
        surtitre="Avis clients"
        titre={avis.length > 0 ? "Ce qu'en disent mes clients" : "Les avis arrivent"}
        sousTitre={
          avis.length > 0
            ? "Chaque témoignage est déposé par le client depuis son espace, après livraison."
            : "Les premiers projets viennent d'être livrés. Les témoignages seront publiés ici dès que mes clients les auront déposés — pas avant, et aucun ne sera inventé."
        }
      />

      {note && (
        <Apparait className="mt-8 flex items-center justify-center gap-3">
          <Etoiles note={note.moyenne} taille="lg" />
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground tabular-nums">
              {note.moyenne.toLocaleString("fr-FR", { minimumFractionDigits: 1 })}
            </span>{" "}
            sur 5 — {note.nombre} avis
          </span>
        </Apparait>
      )}

      {avis.length > 0 ? (
        <>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {avis.map((un, index) => (
              <Apparait key={un.id} delai={index * 70} className="h-full">
                <CarteAvis
                  avis={un}
                  projetSlug={un.projet_id ? slugParProjet.get(un.projet_id) : null}
                />
              </Apparait>
            ))}
          </div>

          <Apparait className="mt-12 text-center">
            <Link
              href="/avis"
              className={cn(
                "group inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-5",
                "text-sm font-medium",
                "transition-[background-color,scale] duration-150 ease-out",
                "hover:bg-secondary active:scale-96",
              )}
            >
              Lire tous les avis
              <ArrowRight
                className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </Apparait>
        </>
      ) : (
        <Apparait className="mx-auto mt-12 max-w-xl rounded-2xl border border-dashed border-border bg-secondary/30 p-8 text-center">
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            En attendant, le meilleur témoignage reste le travail lui-même : trois
            projets en production, avec leur contexte, leurs contraintes et leur budget.
          </p>

          <Link
            href="/realisations"
            className={cn(
              "group mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5",
              "text-sm font-medium text-primary-foreground",
              "transition-[background-color,scale] duration-150 ease-out",
              "hover:bg-bleu-700 active:scale-96 dark:hover:bg-bleu-400",
            )}
          >
            Voir les réalisations
            <ArrowRight
              className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Link>
        </Apparait>
      )}
    </section>
  );
}
