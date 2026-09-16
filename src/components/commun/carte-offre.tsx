import Link from "next/link";
import { Check } from "lucide-react";

import { fourchette } from "@/lib/format";
import type { Offre } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Une offre tarifaire.
 *
 * L'offre « en vedette » est marquée par la bordure bleue **et** par une
 * étiquette : la couleur seule ne suffirait pas, ni pour un daltonien, ni en
 * impression, ni sur une capture d'écran.
 */
export function CarteOffre({ offre }: { offre: Offre }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-6 sm:p-7",
        "transition-[border-color,box-shadow,translate] duration-200 ease-out",
        "hover:-translate-y-0.5",
        offre.en_vedette
          ? "border-bleu-300 shadow-[0_1px_2px_oklch(0_0_0/0.04),0_16px_40px_-20px_var(--bleu-600)] dark:border-bleu-700"
          : "border-border hover:border-bleu-200 dark:hover:border-bleu-800",
      )}
    >
      {offre.en_vedette && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Le plus demandé
        </span>
      )}

      <h3 className="text-xl font-semibold">{offre.nom}</h3>

      {offre.description && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {offre.description}
        </p>
      )}

      <p className="mt-6 flex items-baseline gap-1.5">
        {/* Chiffres tabulaires : sans ça, deux prix superposés dans une grille
            ne s'alignent pas verticalement. */}
        <span className="text-3xl font-semibold tracking-tight tabular-nums">
          {fourchette(offre)}
        </span>
      </p>

      <p className="mt-1.5 text-sm text-muted-foreground">
        HT{offre.delai ? ` · ${offre.delai}` : ""}
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {offre.inclus.map((ligne) => (
          <li key={ligne} className="flex gap-2.5 text-sm">
            <Check
              className="mt-0.5 size-4 shrink-0 text-bleu-600 dark:text-bleu-400"
              strokeWidth={2.25}
              aria-hidden="true"
            />
            <span className="leading-relaxed">{ligne}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/contact?offre=${encodeURIComponent(offre.nom)}`}
        className={cn(
          "mt-7 inline-flex h-11 items-center justify-center rounded-xl text-sm font-medium",
          "transition-[background-color,border-color,scale] duration-150 ease-out active:scale-96",
          offre.en_vedette
            ? "bg-primary text-primary-foreground hover:bg-bleu-700 dark:hover:bg-bleu-400"
            : "border border-border bg-background text-foreground hover:bg-secondary",
        )}
      >
        Demander un devis
      </Link>
    </div>
  );
}
