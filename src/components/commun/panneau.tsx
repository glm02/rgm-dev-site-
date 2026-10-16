import { cn } from "@/lib/utils";

/**
 * Le support plein d'une section posée sur la nappe de points.
 *
 * Sur l'accueil, la nappe 3D occupe tout le fond de la fenêtre. Sans support,
 * les points passaient derrière les lettres et le texte se lisait mal. Chaque
 * section repose donc sur ce panneau opaque : la nappe ne se voit plus que
 * dans les marges et dans l'espace entre deux panneaux, comme un décor.
 */
export function Panneau({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-border/70 bg-background shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_40px_-16px_rgb(0_0_0/0.10)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
