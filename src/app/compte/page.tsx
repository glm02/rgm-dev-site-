import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { EntetePage, EtatVide } from "@/components/espace/entete-page";
import { Pastille } from "@/components/espace/pastille";
import { sessionOuRedirection } from "@/lib/auth";
import { dateLongue, euros } from "@/lib/format";
import { STATUT_MISSION } from "@/lib/libelles";
import type { Jalon, Mission } from "@/lib/types";
import { cn } from "@/lib/utils";

type MissionAvecJalons = Mission & { jalons: Pick<Jalon, "id" | "titre" | "statut" | "ordre" | "prevu_le">[] };

/**
 * L'accueil de l'espace client : ses projets.
 *
 * Chaque carte répond aux deux seules questions qu'un client se pose en ouvrant
 * cette page : « où en est-on ? » (l'avancement) et « quelle est la suite ? »
 * (la prochaine étape non terminée).
 */
export default async function PageCompte() {
  const session = await sessionOuRedirection("/compte");
  if (!session) return null;

  const { supabase, profil } = session;

  // La RLS ne renvoie que les missions du client connecté : pas de filtre sur
  // `profil_id` à écrire ici, et surtout pas à oublier.
  const { data } = await supabase
    .from("missions")
    .select("*, jalons(id, titre, statut, ordre, prevu_le)")
    .order("cree_le", { ascending: false });

  const missions = (data ?? []) as MissionAvecJalons[];
  const prenom = profil.nom?.split(" ")[0];

  return (
    <>
      <EntetePage
        titre={prenom ? `Bonjour ${prenom}` : "Mes projets"}
        description="L'avancement de vos projets, étape par étape. Les documents et la conversation sont dans chaque projet."
      />

      {missions.length === 0 ? (
        <EtatVide
          titre="Aucun projet pour l'instant"
          texte="Votre espace se remplira dès le lancement de votre premier projet : étapes, devis, factures et échanges seront ici."
          action={
            <Link
              href="/contact"
              className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-[background-color,scale] duration-150 ease-out hover:bg-bleu-700 active:scale-96"
            >
              Démarrer un projet
            </Link>
          }
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {missions.map((mission) => {
            const statut = STATUT_MISSION[mission.statut];
            const jalons = [...mission.jalons].sort((a, b) => a.ordre - b.ordre);
            const suivant = jalons.find((jalon) => jalon.statut !== "fait");
            const faits = jalons.filter((jalon) => jalon.statut === "fait").length;

            return (
              <li key={mission.id}>
                <article
                  className={cn(
                    "group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6",
                    "transition-[border-color,translate] duration-200 ease-out",
                    "hover:-translate-y-0.5 hover:border-bleu-200 dark:hover:border-bleu-800",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold">
                      <Link
                        href={`/compte/projets/${mission.id}`}
                        className="outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                      >
                        {mission.titre}
                      </Link>
                    </h2>
                    <Pastille ton={statut.ton}>{statut.libelle}</Pastille>
                  </div>

                  {mission.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {mission.description}
                    </p>
                  )}

                  <div className="mt-5">
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-muted-foreground">Avancement</span>
                      <span className="font-semibold tabular-nums">{mission.avancement} %</span>
                    </div>
                    <div
                      className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"
                      role="progressbar"
                      aria-valuenow={mission.avancement}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Avancement de ${mission.titre}`}
                    >
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${mission.avancement}%` }}
                      />
                    </div>
                  </div>

                  <dl className="mt-5 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">Prochaine étape</dt>
                      <dd className="mt-0.5 font-medium">
                        {suivant ? suivant.titre : jalons.length ? "Tout est terminé" : "À planifier"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Étapes</dt>
                      <dd className="mt-0.5 font-medium tabular-nums">
                        {faits} / {jalons.length}
                      </dd>
                    </div>
                    {mission.fin_prevue_le && (
                      <div className="flex items-center gap-1.5 text-muted-foreground sm:col-span-2">
                        <CalendarDays className="size-4" strokeWidth={1.75} aria-hidden="true" />
                        Livraison prévue le {dateLongue(mission.fin_prevue_le)}
                        {mission.montant ? ` · ${euros(mission.montant)} HT` : ""}
                      </div>
                    )}
                  </dl>

                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-bleu-700 dark:text-bleu-300">
                    Ouvrir le projet
                    <ArrowRight
                      className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </span>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
