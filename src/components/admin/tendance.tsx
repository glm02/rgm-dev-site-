import { cn } from "@/lib/utils";

/**
 * La courbe d'activité d'une affaire, en bâtonnets.
 *
 * Une semaine par barre, la plus récente à droite. Les hauteurs sont des
 * classes Tailwind fixes et non un `style={{ height }}` : une grille de
 * valeurs connues reste nette à tous les zooms, et le composant reste un
 * composant serveur.
 */
const HAUTEURS = ["h-px", "h-1", "h-1.5", "h-2", "h-2.5", "h-3", "h-3.5"] as const;

export function Tendance({
  valeurs,
  className,
  libelle,
}: {
  valeurs: number[];
  className?: string;
  libelle: string;
}) {
  const sommet = Math.max(1, ...valeurs);

  return (
    <span
      role="img"
      aria-label={libelle}
      className={cn("flex h-3.5 items-end gap-px", className)}
    >
      {valeurs.map((valeur, index) => (
        <span
          key={index}
          className={cn(
            "w-1 shrink-0 rounded-[1px]",
            HAUTEURS[Math.round((valeur / sommet) * (HAUTEURS.length - 1))],
            valeur > 0 ? "bg-bleu-500 dark:bg-bleu-400" : "bg-border",
          )}
        />
      ))}
    </span>
  );
}
