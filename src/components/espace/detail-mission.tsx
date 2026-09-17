import { Check, Circle, CircleDot, Download, ExternalLink, OctagonAlert } from "lucide-react";

import { Conversation } from "./conversation";
import { Panneau } from "./entete-page";
import { Pastille } from "./pastille";
import { dateCourte, dateLongue, euros } from "@/lib/format";
import { STATUT_DOCUMENT, STATUT_JALON, STATUT_MISSION, TYPE_DOCUMENT } from "@/lib/libelles";
import type { Document, Jalon, Message, Mission, StatutJalon } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONE_JALON: Record<StatutJalon, typeof Check> = {
  fait: Check,
  en_cours: CircleDot,
  a_faire: Circle,
  bloque: OctagonAlert,
};

/**
 * Le détail d'un projet : étapes, documents, conversation.
 *
 * Partagé par l'espace client et l'admin — la seule différence est le slot
 * `outils`, où l'admin pose ses formulaires d'édition. Le client et Rafael
 * voient donc exactement la même frise, ce qui évite les « chez moi ça affiche
 * autre chose ».
 */
export function DetailMission({
  mission,
  jalons,
  documents,
  messages,
  moiId,
  nomAutre,
  outils,
}: {
  mission: Mission;
  jalons: Jalon[];
  documents: Document[];
  messages: Message[];
  moiId: string;
  nomAutre: string;
  outils?: { jalons?: React.ReactNode; documents?: React.ReactNode; mission?: React.ReactNode };
}) {
  const statut = STATUT_MISSION[mission.statut];
  const etapes = [...jalons].sort((a, b) => a.ordre - b.ordre);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="space-y-5">
        <Panneau>
          <div className="flex flex-wrap items-center gap-3">
            <Pastille ton={statut.ton}>{statut.libelle}</Pastille>
            {mission.fin_prevue_le && (
              <span className="text-sm text-muted-foreground">
                Livraison prévue le {dateLongue(mission.fin_prevue_le)}
              </span>
            )}
          </div>

          {mission.description && (
            <p className="mt-4 leading-relaxed text-muted-foreground">{mission.description}</p>
          )}

          <div className="mt-5">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">Avancement</span>
              <span className="font-semibold tabular-nums">{mission.avancement} %</span>
            </div>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={mission.avancement}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Avancement du projet"
            >
              <div className="h-full rounded-full bg-primary" style={{ width: `${mission.avancement}%` }} />
            </div>
          </div>

          {/* Masquée quand il n'y a rien à y mettre : sinon un projet tout juste
              créé affiche un filet au-dessus d'un bloc vide. */}
          {(mission.debut_le || mission.montant != null || mission.url_live) && (
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-4 text-sm">
            {mission.debut_le && (
              <div>
                <dt className="text-muted-foreground">Démarrage</dt>
                <dd className="mt-0.5 font-medium">{dateLongue(mission.debut_le)}</dd>
              </div>
            )}
            {mission.montant != null && (
              <div>
                <dt className="text-muted-foreground">Montant</dt>
                <dd className="mt-0.5 font-medium tabular-nums">{euros(mission.montant)} HT</dd>
              </div>
            )}
            {mission.url_live && (
              <div>
                <dt className="text-muted-foreground">En ligne</dt>
                <dd className="mt-0.5">
                  <a
                    href={mission.url_live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-bleu-700 underline-offset-4 hover:underline dark:text-bleu-300"
                  >
                    Voir le site
                    <ExternalLink className="size-3.5" strokeWidth={2} aria-hidden="true" />
                  </a>
                </dd>
              </div>
            )}
          </dl>
          )}

          {outils?.mission}
        </Panneau>

        <Panneau titre="Étapes">
          {etapes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Les étapes seront posées au cadrage.</p>
          ) : (
            <ol className="relative">
              {etapes.map((jalon, index) => {
                const Icone = ICONE_JALON[jalon.statut];
                const libelle = STATUT_JALON[jalon.statut];
                const dernier = index === etapes.length - 1;

                return (
                  <li key={jalon.id} className="relative flex gap-4 pb-6 last:pb-0">
                    {/* Le fil qui relie les étapes. Plein jusqu'à la dernière
                        étape terminée : on lit l'avancement sans chiffre. */}
                    {!dernier && (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute top-8 bottom-0 left-[15px] w-px",
                          jalon.statut === "fait" ? "bg-primary" : "bg-border",
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "relative grid size-8 shrink-0 place-items-center rounded-full border",
                        jalon.statut === "fait" && "border-primary bg-primary text-primary-foreground",
                        jalon.statut === "en_cours" && "border-bleu-300 bg-bleu-50 text-bleu-700 dark:border-bleu-700 dark:bg-bleu-900/40 dark:text-bleu-200",
                        jalon.statut === "a_faire" && "border-border bg-background text-muted-foreground",
                        jalon.statut === "bloque" && "border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300",
                      )}
                    >
                      <Icone className="size-4" strokeWidth={2.25} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1 pt-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="font-medium">{jalon.titre}</h3>
                        <span className="sr-only">— {libelle.libelle}</span>
                        {jalon.statut === "bloque" && <Pastille ton="echec">Bloqué</Pastille>}
                      </div>
                      {jalon.description && (
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {jalon.description}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                        {jalon.fait_le
                          ? `Terminé le ${dateCourte(jalon.fait_le)}`
                          : jalon.prevu_le
                            ? `Prévu le ${dateCourte(jalon.prevu_le)}`
                            : null}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          {outils?.jalons}
        </Panneau>
      </div>

      <div className="space-y-5">
        <Panneau titre="Documents">
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Devis, factures et livrables apparaîtront ici.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {documents.map((document) => {
                const statutDoc = STATUT_DOCUMENT[document.statut];
                return (
                  <li key={document.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {TYPE_DOCUMENT[document.type]} — {document.titre}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                        {document.reference ? `${document.reference} · ` : ""}
                        {document.montant != null ? `${euros(document.montant)} HT · ` : ""}
                        {dateCourte(document.cree_le)}
                      </p>
                    </div>
                    <Pastille ton={statutDoc.ton}>{statutDoc.libelle}</Pastille>
                    {document.url && (
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Télécharger ${document.titre}`}
                        className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-[background-color,color] duration-150 ease-out hover:bg-secondary hover:text-foreground"
                      >
                        <Download className="size-4" strokeWidth={1.75} aria-hidden="true" />
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {outils?.documents}
        </Panneau>

        <Panneau titre="Conversation">
          <Conversation
            missionId={mission.id}
            messages={messages}
            moiId={moiId}
            nomAutre={nomAutre}
          />
        </Panneau>
      </div>
    </div>
  );
}
