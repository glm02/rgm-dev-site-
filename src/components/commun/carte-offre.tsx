import { Badge } from "@appica/ui-react/badge";
import { BorderBeam } from "@appica/ui-react/border-beam";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { fourchette } from "@/lib/format";
import type { Offre } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Une offre tarifaire.
 *
 * L'offre en vedette bascule sur fond bleu plein plutôt que de se contenter
 * d'une bordure : dans une rangée de trois, une bordure colorée se remarque à
 * peine, un aplat décide du regard. Elle porte **aussi** une étiquette écrite —
 * la couleur seule ne suffit ni pour un daltonien, ni en impression, ni sur une
 * capture d'écran.
 */
export function CarteOffre({
  offre,
  vedette: vedetteForcee,
}: {
  offre: Offre;
  /**
   * Force la mise en avant, indépendamment de `offre.en_vedette`.
   *
   * L'accueil ne montre qu'une offre par métier : il doit pouvoir décider
   * laquelle des trois passe en bleu, sans que deux cartes se disputent le
   * regard parce que la base en a marqué deux.
   */
  vedette?: boolean;
}) {
  const vedette = vedetteForcee ?? offre.en_vedette;

  const carte = (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border p-6 sm:p-7",
        "transition-[border-color,box-shadow,translate] duration-200 ease-out",
        // En vedette, c'est le contenant du contour lumineux qui se soulève :
        // sinon la carte monterait et la comète resterait en place, décalée.
        !vedette && "hover:-translate-y-1",
        vedette
          ? [
              "border-bleu-700 bg-bleu-600 text-white",
              "shadow-[0_2px_4px_oklch(0_0_0/0.08),0_24px_56px_-24px_var(--bleu-600)]",
              "dark:border-bleu-400 dark:bg-bleu-600",
            ]
          : [
              "border-border bg-card",
              "hover:border-bleu-200 hover:shadow-[0_1px_2px_oklch(0_0_0/0.04),0_16px_40px_-22px_oklch(0_0_0/0.22)]",
              "dark:hover:border-bleu-800",
            ],
      )}
    >
      {vedette && (
        <Badge variant="primary" size="sm" className="absolute -top-3 left-6 bg-foreground text-background">
          Le plus demandé
        </Badge>
      )}

      <h3 className={cn("text-xl font-semibold", vedette && "text-white")}>
        {offre.nom}
      </h3>

      {offre.description && (
        <p
          className={cn(
            "mt-2 text-sm leading-relaxed",
            vedette ? "text-bleu-50/85" : "text-muted-foreground",
          )}
        >
          {offre.description}
        </p>
      )}

      {/* Chiffres tabulaires : sans eux, deux prix superposés dans une grille
          ne s'alignent pas verticalement. */}
      <p
        className={cn(
          "mt-7 text-[1.75rem] leading-none font-semibold tracking-tight tabular-nums",
          vedette && "text-white",
        )}
      >
        {fourchette(offre)}
      </p>

      <p
        className={cn(
          "mt-2 text-sm",
          vedette ? "text-bleu-50/75" : "text-muted-foreground",
        )}
      >
        HT{offre.delai ? ` · ${offre.delai}` : ""}
      </p>

      <div
        className={cn(
          "my-6 h-px",
          vedette ? "bg-white/20" : "bg-border",
        )}
      />

      <ul className="flex-1 space-y-3">
        {offre.inclus.map((ligne) => (
          <li key={ligne} className="flex gap-2.5 text-sm">
            <Check
              className={cn(
                "mt-0.5 size-4 shrink-0",
                vedette ? "text-white" : "text-bleu-600 dark:text-bleu-400",
              )}
              strokeWidth={2.25}
              aria-hidden="true"
            />
            <span className={cn("leading-relaxed", vedette && "text-bleu-50/95")}>
              {ligne}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={`/contact?offre=${encodeURIComponent(offre.nom)}`}
        className={cn(
          "group mt-7 inline-flex h-11 items-center justify-center gap-1.5 rounded-xl text-sm font-medium",
          "transition-[background-color,border-color,scale] duration-150 ease-out active:scale-96",
          vedette
            ? "bg-white text-bleu-700 hover:bg-bleu-50"
            : "border border-border bg-background hover:bg-secondary",
        )}
      >
        Demander un devis
        <ArrowRight
          className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
          strokeWidth={2}
          aria-hidden="true"
        />
      </Link>
    </div>
  );

  // Seule l'offre mise en avant reçoit le contour lumineux (BorderBeam
  // d'Appica) : une comète sur chaque carte annulerait l'effet. Blanche, parce
  // que la carte est bleue ; lente, parce qu'elle tourne en permanence.
  if (!vedette) return carte;

  return (
    <BorderBeam
      color="oklch(1 0 0 / 0.85)"
      length={18}
      thickness={2}
      speed={6}
      className="h-full rounded-2xl transition-[translate] duration-200 ease-out hover:-translate-y-1"
    >
      {carte}
    </BorderBeam>
  );
}
