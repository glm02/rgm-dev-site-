import { Sparkline, SparklineChart } from "@appica/ui-react/sparkline";
import { ExternalLink } from "lucide-react";

import { BoutonEnvoyer } from "@/components/admin/boutons";
import { Bandeau, Champ } from "@/components/admin/formulaire";
import { EntetePage, EtatVide, Panneau } from "@/components/espace/entete-page";
import { Pastille } from "@/components/espace/pastille";
import {
  ajouterSite,
  basculerSite,
  controlerMaintenant,
  resoudreAlerte,
  supprimerSite,
} from "@/lib/actions/admin";
import { sessionAdminOuRedirection } from "@/lib/auth";
import { dateCourte, depuis, joursAvant } from "@/lib/format";
import { TYPE_ALERTE } from "@/lib/libelles";
import type { Alerte, Controle, SiteSupervise } from "@/lib/types";

type AlerteAvecSite = Alerte & { sites_supervises: Pick<SiteSupervise, "nom"> | null };

/** Nombre de contrôles affichés en historique par site. */
const HISTORIQUE = 30;

export default async function PageSupervision({ searchParams }: PageProps<"/admin/supervision">) {
  const session = await sessionAdminOuRedirection("/admin/supervision");
  if (!session) return null;
  const { ok, erreur } = await searchParams;
  const { supabase } = session;

  const [{ data: sitesBruts }, { data: controlesBruts }, { data: alertesBrutes }] = await Promise.all([
    supabase.from("sites_supervises").select("*").order("nom"),
    supabase.from("controles").select("*").order("verifie_le", { ascending: false }).limit(600),
    supabase
      .from("alertes")
      .select("*, sites_supervises(nom)")
      .order("cree_le", { ascending: false })
      .limit(40),
  ]);

  const sites = (sitesBruts ?? []) as SiteSupervise[];
  const controles = (controlesBruts ?? []) as Controle[];
  const alertes = (alertesBrutes ?? []) as AlerteAvecSite[];
  const ouvertes = alertes.filter((a) => !a.resolue_le);

  return (
    <>
      <EntetePage
        titre="Supervision"
        description="Disponibilité, temps de réponse et certificat des sites livrés. Une alerte Telegram part à chaque changement d'état."
        actions={
          <form action={controlerMaintenant}>
            <BoutonEnvoyer>Contrôler maintenant</BoutonEnvoyer>
          </form>
        }
      />
      <Bandeau ok={ok} erreur={erreur} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          {sites.length === 0 ? (
            <EtatVide titre="Aucun site surveillé" texte="Ajoutez un site avec le formulaire : il sera contrôlé à la prochaine passe." />
          ) : (
            sites.map((site) => {
              const historique = controles.filter((c) => c.site_id === site.id).slice(0, HISTORIQUE).reverse();
              const reussis = historique.filter((c) => c.ok);
              const disponibilite = historique.length
                ? Math.round((reussis.length / historique.length) * 1000) / 10
                : null;
              const tempsMoyen = reussis.length
                ? Math.round(reussis.reduce((t, c) => t + (c.temps_ms ?? 0), 0) / reussis.length)
                : null;
              const joursTls = site.tls_expire_le ? joursAvant(site.tls_expire_le) : null;

              const etat =
                !site.actif ? { ton: "neutre" as const, libelle: "Suspendu" }
                : site.dernier_ok === null ? { ton: "neutre" as const, libelle: "Jamais contrôlé" }
                : site.dernier_ok ? { ton: "succes" as const, libelle: "En ligne" }
                : { ton: "echec" as const, libelle: "En panne" };

              return (
                <article key={site.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-semibold">{site.nom}</h2>
                    <Pastille ton={etat.ton}>{etat.libelle}</Pastille>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
                    >
                      {site.url.replace(/^https?:\/\//, "")}
                      <ExternalLink className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                    </a>
                  </div>

                  {/* La frise des derniers contrôles : un trait par passe, rouge
                      quand ça a échoué. On y lit une panne récurrente d'un coup
                      d'œil, là où un pourcentage la noierait. */}
                  {/* La courbe du temps de réponse (Sparkline d'Appica) : une
                      dérive lente — un site qui passe de 300 à 1 500 ms en une
                      semaine — se voit ici bien avant de déclencher le seuil. */}
                  {reussis.length > 1 && (
                    <Sparkline
                      data={reussis.map((c) => c.temps_ms ?? 0)}
                      labels={reussis.map((c) => `${dateCourte(c.verifie_le)} — ms`)}
                      color="var(--bleu-500)"
                      format={{ maximumFractionDigits: 0 }}
                      locale="fr-FR"
                      className="mt-4"
                    >
                      <SparklineChart
                        variant="area"
                        height={44}
                        curve={0.4}
                        tooltip
                        aria-label={`Temps de réponse de ${site.nom} sur les ${reussis.length} derniers contrôles`}
                      />
                    </Sparkline>
                  )}

                  {historique.length > 0 && (
                    <div className="mt-3 flex h-7 items-end gap-[3px]" aria-label={`${reussis.length} contrôles réussis sur ${historique.length}`} role="img">
                      {historique.map((controle) => (
                        <span
                          key={controle.id}
                          title={`${dateCourte(controle.verifie_le)} — ${controle.ok ? `${controle.temps_ms} ms` : controle.erreur}`}
                          className={`h-full flex-1 rounded-sm ${controle.ok ? "bg-emerald-500/70" : "bg-red-500"}`}
                        />
                      ))}
                    </div>
                  )}

                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <dt className="text-muted-foreground">Disponibilité</dt>
                      <dd className="font-medium tabular-nums">{disponibilite !== null ? `${disponibilite} %` : "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Temps moyen</dt>
                      <dd className="font-medium tabular-nums">{tempsMoyen !== null ? `${tempsMoyen} ms` : "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Certificat</dt>
                      <dd className={`font-medium tabular-nums ${joursTls !== null && joursTls <= 14 ? "text-destructive" : ""}`}>
                        {joursTls !== null ? `${joursTls} jours` : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Dernier contrôle</dt>
                      <dd className="font-medium">{depuis(site.dernier_controle_le)}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex gap-2 border-t border-border pt-4">
                    <form action={basculerSite}>
                      <input type="hidden" name="id" value={site.id} />
                      <input type="hidden" name="actif" value={String(!site.actif)} />
                      <BoutonEnvoyer taille="petit" variante="secondaire">
                        {site.actif ? "Suspendre" : "Reprendre"}
                      </BoutonEnvoyer>
                    </form>
                    <form action={supprimerSite} className="ml-auto">
                      <input type="hidden" name="id" value={site.id} />
                      <BoutonEnvoyer taille="petit" variante="danger" confirmation={`Retirer ${site.nom} de la supervision ? L'historique sera supprimé.`}>
                        Retirer
                      </BoutonEnvoyer>
                    </form>
                  </div>
                </article>
              );
            })
          )}
        </div>

        <div className="space-y-5">
          <Panneau titre="Surveiller un site">
            <form action={ajouterSite} className="space-y-4">
              <Champ nom="nom" libelle="Nom" placeholder="Atout Travaux" requis />
              <Champ nom="url" libelle="Adresse" type="url" placeholder="https://…" requis />
              <div className="grid gap-4 sm:grid-cols-2">
                <Champ nom="statut_attendu" libelle="Code attendu" type="number" valeur={200} />
                <Champ nom="seuil_lenteur_ms" libelle="Seuil de lenteur (ms)" type="number" valeur={3000} />
              </div>
              <BoutonEnvoyer>Ajouter</BoutonEnvoyer>
            </form>
          </Panneau>

          <Panneau titre={`Alertes${ouvertes.length ? ` · ${ouvertes.length} ouverte${ouvertes.length > 1 ? "s" : ""}` : ""}`}>
            {alertes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune alerte enregistrée.</p>
            ) : (
              <ul className="space-y-3">
                {alertes.map((alerte) => (
                  <li key={alerte.id} className={`rounded-xl border p-3 ${alerte.resolue_le ? "border-border opacity-70" : "border-destructive/30"}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{alerte.sites_supervises?.nom ?? "Site"}</span>
                      <Pastille ton={TYPE_ALERTE[alerte.type].ton}>{TYPE_ALERTE[alerte.type].libelle}</Pastille>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{alerte.message}</p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">{depuis(alerte.cree_le)}</span>
                      {!alerte.resolue_le && (
                        <form action={resoudreAlerte}>
                          <input type="hidden" name="id" value={alerte.id} />
                          <BoutonEnvoyer taille="petit" variante="secondaire">Marquer résolue</BoutonEnvoyer>
                        </form>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panneau>
        </div>
      </div>
    </>
  );
}
