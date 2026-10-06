import { cn } from "@/lib/utils";

/**
 * Une jauge en segments, pour une probabilité.
 *
 * Des traits séparés plutôt qu'une barre pleine : l'œil compte les segments
 * et lit « un peu plus de la moitié » sans avoir à chercher le pourcentage
 * écrit à côté. Le pourcentage reste affiché — la jauge seule serait une
 * approximation.
 */
export function BarreSegments({
  pourcentage,
  segments = 14,
  className,
  libelle,
}: {
  pourcentage: number;
  segments?: number;
  className?: string;
  /** Décrit ce qui est mesuré, pour les lecteurs d'écran. */
  libelle: string;
}) {
  const borne = Math.min(100, Math.max(0, pourcentage));
  const remplis = Math.round((borne / 100) * segments);

  return (
    <span
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={borne}
      aria-label={libelle}
      className={cn("flex h-3.5 items-center gap-px overflow-hidden rounded-sm", className)}
    >
      {Array.from({ length: segments }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-2.5 min-w-px flex-1 rounded-[1px]",
            index < remplis ? "bg-bleu-600 dark:bg-bleu-400" : "bg-border",
          )}
        />
      ))}
    </span>
  );
}
