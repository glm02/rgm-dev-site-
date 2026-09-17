import { Sparkline, SparklineChart } from "@appica/ui-react/sparkline";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EntetePage, Panneau } from "@/components/espace/entete-page";
import { Pastille } from "@/components/espace/pastille";
import { sessionAdminOuRedirection } from "@/lib/auth";
import { depuis, ilYA } from "@/lib/format";
import { STATUT_DEMANDE, TYPE_ALERTE } from "@/lib/libelles";
import type { Alerte, DemandeDevis, SiteSupervise } from "@/lib/types";

type AlerteAvecSite = Alerte & { sites_supervises: Pick<SiteSupervise, "nom"> | null };

/**
 * Le tableau de bord.
 *
 * Quatre chiffres, puis les deux listes qui appellent une action : les
 * demandes à traiter et les incidents ouverts. Pas de graphique décoratif —
 * un chiffre qui ne mène à aucune décision n'a pas sa place ici.
 */
export default async function TableauDeBord() {
  const session = await sessionAdminOuRedirection("/admin");
  if (!session) return null;

  const { supabase } = session;
  const il_y_a_30_jours = ilYA(30);

  const [demandes30, gagnees, recentes, sites, alertes] = await Promise.all([
    supabase.from("demandes_devis").select("statut, utm_source, cree_le").gte("cree_le", il_y_a_30_jours),
    supabase.from("demandes_devis").select("id", { count: "exact", head: true }).eq("statut", "gagne"),
    supabase.from("demandes_devis").select("*").order("cree_le", { ascending: false }).limit(6),
    supabase.from("sites_supervises").select("nom, dernier_ok").eq("actif", true),
    supabase
      .from("alertes")
      .select("*, sites_supervises(nom)")
      .is("resolue_le", null)
      .order("cree_le", { ascending: false })
      .limit(5),
  ]);

  const mois = demandes30.data ?? [];

  // Une colonne par jour sur 30 jours, jours vides compris : sans eux, deux
  // demandes à trois semaines d'écart auraient l'air consécutives.
  const jours = Array.from({ length: 30 }, (_, i) => ilYA(29 - i).slice(0, 10));
  const parJour = jours.map((jour) => mois.filter((d) => d.cree_le.slice(0, 10) === jour).length);
  const libellesJours = jours.map((jour) =>
    new Date(jour).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
  );
  const depuisAds = mois.filter((d) => d.utm_source).length;
  const listeSites = (sites.data ?? []) as Pick<SiteSupervise, "nom" | "dernier_ok">[];
  const enPanne = listeSites.filter((s) => s.dernier_ok === false).length;

  const indicateurs = [
    { libelle: "Demandes sur 30 jours", valeur: mois.length, detail: `${depuisAds} via une campagne` },
    { libelle: "Projets gagnés", valeur: gagnees.count ?? 0, detail: "depuis le début" },
    {
      libelle: "Sites surveillés",
      valeur: listeSites.length,
      detail: enPanne ? `${enPanne} en panne` : "tous en ligne",
      alerte: enPanne > 0,
    },
    { libelle: "Incidents ouverts", valeur: alertes.data?.length ?? 0, detail: "à traiter", alerte: (alertes.data?.length ?? 0) > 0 },
  ];

  return (
    <>
      <EntetePage titre="Tableau de bord" description="Ce qui demande votre attention aujourd'hui." />

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {indicateurs.map((indicateur) => (
          <div key={indicateur.libelle} className="rounded-2xl border border-border bg-card p-5">
            <dt className="text-sm text-muted-foreground">{indicateur.libelle}</dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{indicateur.valeur}</dd>
            <dd className={`mt-1 text-xs ${indicateur.alerte ? "font-medium text-destructive" : "text-muted-foreground"}`}>
              {indicateur.detail}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 rounded-2xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">Demandes par jour, 30 derniers jours</p>
        <Sparkline data={parJour} labels={libellesJours} color="var(--bleu-600)" locale="fr-FR" className="mt-3">
          <SparklineChart
            variant="column"
            height={56}
            tooltip
            aria-label={`${mois.length} demandes de devis sur les 30 derniers jours`}
          />
        </Sparkline>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Panneau
          titre="Dernières demandes"
          actions={<LienTout href="/admin/demandes" />}
        >
          {(recentes.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune demande pour l&apos;instant.</p>
          ) : (
            <ul className="divide-y divide-border">
              {((recentes.data ?? []) as DemandeDevis[]).map((demande) => (
                <li key={demande.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {demande.nom}
                      {demande.entreprise ? ` · ${demande.entreprise}` : ""}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {[demande.type_projet, demande.budget].filter(Boolean).join(" · ") || demande.message}
                    </p>
                  </div>
                  <span className="hidden text-xs text-muted-foreground sm:block">{depuis(demande.cree_le)}</span>
                  <Pastille ton={STATUT_DEMANDE[demande.statut].ton}>{STATUT_DEMANDE[demande.statut].libelle}</Pastille>
                </li>
              ))}
            </ul>
          )}
        </Panneau>

        <Panneau titre="Incidents ouverts" actions={<LienTout href="/admin/supervision" />}>
          {(alertes.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun incident. Tous les sites répondent.</p>
          ) : (
            <ul className="space-y-3">
              {((alertes.data ?? []) as AlerteAvecSite[]).map((alerte) => (
                <li key={alerte.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{alerte.sites_supervises?.nom ?? "Site"}</span>
                    <Pastille ton={TYPE_ALERTE[alerte.type].ton}>{TYPE_ALERTE[alerte.type].libelle}</Pastille>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {alerte.message} · {depuis(alerte.cree_le)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panneau>
      </div>
    </>
  );
}

function LienTout({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm font-medium text-bleu-700 transition-colors duration-150 ease-out hover:text-bleu-800 dark:text-bleu-300"
    >
      Tout voir
      <ArrowRight className="size-3.5" strokeWidth={2} aria-hidden="true" />
    </Link>
  );
}
