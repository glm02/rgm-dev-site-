import Link from "next/link";
import { ArrowUpRight, CalendarClock } from "lucide-react";

import { BarreSegments } from "@/components/admin/barre-segments";
import { Bandeau } from "@/components/admin/formulaire";
import { Tendance } from "@/components/admin/tendance";
import { BarreOutils } from "@/components/crm/barre-outils";
import { EntetePage, EtatVide, Panneau } from "@/components/espace/entete-page";
import { Pastille } from "@/components/espace/pastille";
import { sessionAdminOuRedirection } from "@/lib/auth";
import {
  filtrerProspects,
  filtresActifs,
  joursSansNouvelles,
  lireFiltres,
  relanceDue,
  resumePipeline,
  tendanceActivite,
  valeurPonderee,
} from "@/lib/crm";
import { dateCourte, euros, ilYA } from "@/lib/format";
import { STATUT_PROSPECT } from "@/lib/libelles";
import type { Activite, Prospect } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Le pipeline commercial.
 *
 * Une seule page pour la question du matin : qui rappeler aujourd'hui, et
 * combien pèse ce qui est en cours. Les filtres vivent dans l'URL, la page
 * reste donc rendue côté serveur et se partage telle quelle.
 */
export default async function PagePipeline({ searchParams }: PageProps<"/admin/crm">) {
  const session = await sessionAdminOuRedirection("/admin/crm");
  if (!session) return null;

  const params = await searchParams;
  const filtres = lireFiltres(params);

  const [requeteProspects, requeteActivites] = await Promise.all([
    session.supabase.from("prospects").select("*").order("derniere_activite_le", { ascending: false }),
    session.supabase
      .from("activites")
      .select("prospect_id, fait_le")
      // Douze semaines : la largeur de la courbe de tendance affichée en liste.
      .gte("fait_le", ilYA(84)),
  ]);

  const prospects = (requeteProspects.data ?? []) as Prospect[];
  const activites = (requeteActivites.data ?? []) as Pick<Activite, "prospect_id" | "fait_le">[];

  const resume = resumePipeline(prospects);
  const visibles = filtrerProspects(prospects, filtres);
  const sources = [...new Set(prospects.map((p) => p.source ?? "site"))].sort();
  const aujourdHui = new Date().toISOString().slice(0, 10);
  const relances = prospects.filter((p) => relanceDue(p, aujourdHui));

  const indicateurs = [
    {
      libelle: "Pipeline pondéré",
      valeur: euros(Math.round(resume.ponderee)),
      detail: `sur ${euros(Math.round(resume.valeur))} en jeu`,
    },
    {
      libelle: "Affaires ouvertes",
      valeur: String(resume.ouvertes),
      detail: `${resume.gagnees} gagnée${resume.gagnees > 1 ? "s" : ""} au total`,
    },
    {
      libelle: "Taux de conversion",
      valeur: resume.tauxConversion === null ? "—" : `${resume.tauxConversion} %`,
      detail:
        resume.panierMoyen === null
          ? "aucune affaire tranchée"
          : `panier moyen ${euros(Math.round(resume.panierMoyen))}`,
    },
    {
      libelle: "Relances dues",
      valeur: String(relances.length),
      detail: relances.length > 0 ? "à passer aujourd'hui" : "rien à rappeler",
      alerte: relances.length > 0,
    },
  ];

  return (
    <>
      <EntetePage
        titre="Pipeline commercial"
        description="Chaque demande reçue entre ici toute seule. Ce qui compte ensuite : la prochaine relance."
      />
      <Bandeau ok={params.ok} erreur={params.erreur} />

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {indicateurs.map((indicateur) => (
          <div key={indicateur.libelle} className="rounded-2xl border border-border bg-card p-5">
            <dt className="text-sm text-muted-foreground">{indicateur.libelle}</dt>
            <dd className="mt-2 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
              {indicateur.valeur}
            </dd>
            <dd
              className={cn(
                "mt-1 text-xs",
                indicateur.alerte ? "font-medium text-destructive" : "text-muted-foreground",
              )}
            >
              {indicateur.detail}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 mb-8 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panneau titre="Où en sont les affaires">
          {resume.ouvertes === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune affaire ouverte pour l&apos;instant.</p>
          ) : (
            <ul className="space-y-3">
              {resume.etapes.map((etape) => (
                <li key={etape.statut}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium">{STATUT_PROSPECT[etape.statut].libelle}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {etape.nombre} · {euros(Math.round(etape.valeur))}
                    </span>
                  </div>
                  <BarreSegments
                    pourcentage={resume.ouvertes ? (etape.nombre / resume.ouvertes) * 100 : 0}
                    segments={28}
                    className="mt-1.5 w-full"
                    libelle={`${etape.nombre} affaire(s) en ${STATUT_PROSPECT[etape.statut].libelle}`}
                  />
                </li>
              ))}
            </ul>
          )}
        </Panneau>

        <Panneau titre="À rappeler">
          {relances.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune relance due. Posez une date sur une affaire pour qu&apos;elle remonte ici le jour venu.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {relances.slice(0, 6).map((prospect) => (
                <li key={prospect.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <CalendarClock
                    className="size-4 shrink-0 text-destructive"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <Link
                    href={`/admin/crm/${prospect.id}`}
                    className="min-w-0 flex-1 truncate text-sm font-medium underline-offset-4 hover:underline"
                  >
                    {prospect.entreprise ?? prospect.contact}
                  </Link>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {dateCourte(prospect.relance_le)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panneau>
      </div>

      <BarreOutils
        filtres={filtres}
        sources={sources}
        nombre={visibles.length}
        actifs={filtresActifs(filtres)}
      />

      {prospects.length === 0 ? (
        <EtatVide
          titre="Le pipeline est vide"
          texte="Les demandes envoyées depuis le site y entrent automatiquement. Vous pouvez aussi ajouter une affaire à la main, après un appel ou une recommandation."
          action={
            <Link
              href="/admin/crm/nouveau"
              className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-[background-color,scale] duration-150 ease-out hover:bg-bleu-700 active:scale-96"
            >
              Ajouter une affaire
            </Link>
          }
        />
      ) : visibles.length === 0 ? (
        <EtatVide titre="Aucune affaire ne correspond" texte="Élargissez les filtres pour revoir le pipeline." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <th scope="col" className="px-4 py-3">Affaire</th>
                <th scope="col" className="px-4 py-3">Étape</th>
                <th scope="col" className="px-4 py-3 text-right">Valeur</th>
                <th scope="col" className="px-4 py-3">Probabilité</th>
                <th scope="col" className="px-4 py-3">Échanges</th>
                <th scope="col" className="px-4 py-3">Suivi</th>
                <th scope="col" className="w-10 px-4 py-3">
                  <span className="sr-only">Ouvrir</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibles.map((prospect) => {
                const statut = STATUT_PROSPECT[prospect.statut];
                const jours = joursSansNouvelles(prospect);
                const due = relanceDue(prospect, aujourdHui);
                const siennes = activites.filter((a) => a.prospect_id === prospect.id);

                return (
                  <tr
                    key={prospect.id}
                    className="group transition-colors duration-150 ease-out hover:bg-secondary/50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/crm/${prospect.id}`}
                        className="font-medium underline-offset-4 outline-none hover:underline focus-visible:underline"
                      >
                        {prospect.entreprise ?? prospect.contact}
                      </Link>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {[
                          prospect.entreprise ? prospect.contact : null,
                          prospect.besoin,
                          prospect.ville,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Pastille ton={statut.ton}>{statut.libelle}</Pastille>
                      {prospect.source && (
                        <p className="mt-1 text-xs text-muted-foreground">via {prospect.source}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {prospect.valeur_estimee == null ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <>
                          <span className="font-medium">{euros(prospect.valeur_estimee)}</span>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {euros(Math.round(valeurPonderee(prospect)))} pondéré
                          </p>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <BarreSegments
                          pourcentage={prospect.probabilite}
                          className="w-20"
                          libelle={`Probabilité ${prospect.probabilite} %`}
                        />
                        <span className="w-10 text-right text-xs tabular-nums">
                          {prospect.probabilite} %
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Tendance
                        valeurs={tendanceActivite(siennes)}
                        libelle={`${siennes.length} échange(s) sur les douze dernières semaines`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {prospect.relance_le ? (
                        <p className={cn("text-xs tabular-nums", due && "font-medium text-destructive")}>
                          Relance {dateCourte(prospect.relance_le)}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Pas de relance prévue</p>
                      )}
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {jours === 0 ? "Activité aujourd'hui" : `Sans nouvelles depuis ${jours} j`}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/crm/${prospect.id}`}
                        aria-label={`Ouvrir ${prospect.entreprise ?? prospect.contact}`}
                        className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors duration-150 ease-out hover:bg-secondary hover:text-foreground"
                      >
                        <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
