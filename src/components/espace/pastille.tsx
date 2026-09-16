import type { Ton } from "@/lib/libelles";
import { cn } from "@/lib/utils";

const TONS: Record<Ton, string> = {
  neutre: "bg-secondary text-secondary-foreground",
  bleu: "bg-bleu-50 text-bleu-700 dark:bg-bleu-900/50 dark:text-bleu-200",
  succes: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  attention: "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  echec: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
};

/**
 * Une pastille de statut.
 *
 * Seule entorse à la règle « une seule couleur d'accent » du site : un statut
 * « payé » ou « hors ligne » doit se lire d'un coup d'œil dans un tableau, et
 * le vert, l'ambre et le rouge sont la convention que tout le monde lit sans
 * légende. Elles restent confinées aux espaces privés, jamais sur le site
 * public.
 *
 * Le libellé est toujours écrit : la couleur n'est jamais le seul signal.
 */
export function Pastille({
  ton,
  children,
  className,
}: {
  ton: Ton;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        TONS[ton],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {children}
    </span>
  );
}
