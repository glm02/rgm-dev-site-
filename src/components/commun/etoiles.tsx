import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Une note sur cinq.
 *
 * Les étoiles pleines sont dessinées par-dessus les vides et découpées à la
 * largeur voulue : une demi-étoile s'affiche donc vraiment à moitié, au lieu
 * d'être arrondie à l'entier comme le font la plupart des implémentations.
 *
 * La note est aussi écrite en toutes lettres pour les lecteurs d'écran : cinq
 * icônes identiques ne disent rien à qui ne les voit pas.
 */
export function Etoiles({
  note,
  taille = "md",
  className,
}: {
  note: number;
  taille?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dimension = { sm: "size-3.5", md: "size-4", lg: "size-5" }[taille];
  const proportion = Math.max(0, Math.min(5, note)) / 5;

  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      role="img"
      aria-label={`${note} sur 5`}
    >
      <span className="flex gap-0.5 text-border" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Star key={index} className={dimension} fill="currentColor" strokeWidth={0} />
        ))}
      </span>

      <span
        className="absolute inset-0 flex gap-0.5 overflow-hidden text-bleu-500"
        style={{ clipPath: `inset(0 ${(1 - proportion) * 100}% 0 0)` }}
        aria-hidden="true"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Star key={index} className={dimension} fill="currentColor" strokeWidth={0} />
        ))}
      </span>
    </span>
  );
}
