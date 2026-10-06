"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Download, Plus, RotateCcw, Search } from "lucide-react";

import { STATUT_PROSPECT } from "@/lib/libelles";
import type { FiltresCrm } from "@/lib/crm";
import { cn } from "@/lib/utils";

/**
 * Les filtres du pipeline.
 *
 * Tout passe par l'URL : un pipeline filtré se partage, se met en favori et
 * survit au rechargement. C'est aussi ce qui permet à la page de rester un
 * composant serveur — ce client-ci ne fait que réécrire l'adresse.
 */

const ETAPES = [
  { valeur: "ouvert", libelle: "Affaires ouvertes" },
  { valeur: "tous", libelle: "Toutes les affaires" },
  ...Object.entries(STATUT_PROSPECT).map(([valeur, { libelle }]) => ({ valeur, libelle })),
];

const TRIS = [
  { valeur: "ponderee", libelle: "Valeur pondérée" },
  { valeur: "valeur", libelle: "Valeur estimée" },
  { valeur: "relance", libelle: "Relance la plus proche" },
  { valeur: "activite", libelle: "Activité récente" },
  { valeur: "probabilite", libelle: "Probabilité" },
  { valeur: "nom", libelle: "Nom" },
];

const FENETRES = [
  { valeur: "0", libelle: "Toute l'activité" },
  { valeur: "14", libelle: "Actives sous 14 jours" },
  { valeur: "30", libelle: "Actives sous 30 jours" },
  { valeur: "90", libelle: "Actives sous 90 jours" },
];

const CLASSE_SELECT = cn(
  "h-9 min-w-0 rounded-lg border border-input bg-background px-2.5 text-sm",
  "transition-[border-color,box-shadow] duration-150 ease-out",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
);

export function BarreOutils({
  filtres,
  sources,
  nombre,
  actifs,
}: {
  filtres: FiltresCrm;
  /** Les sources réellement présentes dans le pipeline, pas une liste figée. */
  sources: string[];
  nombre: number;
  actifs: number;
}) {
  const router = useRouter();
  const chemin = usePathname();
  const parametres = useSearchParams();

  function naviguer(changements: Record<string, string>) {
    const params = new URLSearchParams(parametres.toString());
    for (const [clef, valeur] of Object.entries(changements)) {
      if (!valeur) params.delete(clef);
      else params.set(clef, valeur);
    }
    router.replace(params.size ? `${chemin}?${params}` : chemin, { scroll: false });
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <form
        onSubmit={(evenement) => {
          evenement.preventDefault();
          const champ = new FormData(evenement.currentTarget).get("q");
          naviguer({ q: typeof champ === "string" ? champ.trim() : "" });
        }}
        className="relative min-w-[200px] flex-1"
      >
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <input
          type="search"
          name="q"
          defaultValue={filtres.recherche}
          placeholder="Rechercher un contact, une entreprise, une ville…"
          aria-label="Rechercher dans le pipeline"
          className={cn(CLASSE_SELECT, "w-full pl-9")}
        />
      </form>

      <select
        value={filtres.etape}
        onChange={(evenement) => naviguer({ etape: evenement.target.value })}
        aria-label="Étape"
        className={CLASSE_SELECT}
      >
        {ETAPES.map((option) => (
          <option key={option.valeur} value={option.valeur}>
            {option.libelle}
          </option>
        ))}
      </select>

      <select
        value={filtres.source}
        onChange={(evenement) => naviguer({ source: evenement.target.value })}
        aria-label="Source"
        className={CLASSE_SELECT}
      >
        <option value="toutes">Toutes les sources</option>
        {sources.map((source) => (
          <option key={source} value={source}>
            {source}
          </option>
        ))}
      </select>

      <select
        value={String(filtres.fenetre)}
        onChange={(evenement) => naviguer({ fenetre: evenement.target.value })}
        aria-label="Dernière activité"
        className={cn(CLASSE_SELECT, "hidden sm:block")}
      >
        {FENETRES.map((option) => (
          <option key={option.valeur} value={option.valeur}>
            {option.libelle}
          </option>
        ))}
      </select>

      <select
        value={filtres.tri}
        onChange={(evenement) => naviguer({ tri: evenement.target.value })}
        aria-label="Trier par"
        className={cn(CLASSE_SELECT, "hidden sm:block")}
      >
        {TRIS.map((option) => (
          <option key={option.valeur} value={option.valeur}>
            Tri : {option.libelle}
          </option>
        ))}
      </select>

      {actifs > 0 && (
        <button
          type="button"
          onClick={() => router.replace(chemin, { scroll: false })}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:bg-secondary hover:text-foreground"
        >
          <RotateCcw className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
          Réinitialiser
          <span className="tabular-nums">({actifs})</span>
        </button>
      )}

      {/* Le compte et les deux boutons restent groupés : quand la barre passe
          sur deux lignes, le nombre ne se retrouve pas orphelin au milieu. */}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-muted-foreground tabular-nums">
          {nombre} affaire{nombre > 1 ? "s" : ""}
        </span>

        <a
          href={`/api/admin/crm/export${parametres.size ? `?${parametres}` : ""}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium transition-[background-color,scale] duration-150 ease-out hover:bg-secondary active:scale-96"
        >
          <Download className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
          Exporter
        </a>

        <Link
          href="/admin/crm/nouveau"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-[background-color,scale] duration-150 ease-out hover:bg-bleu-700 active:scale-96 dark:hover:bg-bleu-400"
        >
          <Plus className="size-3.5" strokeWidth={2} aria-hidden="true" />
          Nouvelle affaire
        </Link>
      </div>
    </div>
  );
}
