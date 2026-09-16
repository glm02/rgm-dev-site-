import { cn } from "@/lib/utils";

/**
 * Fait apparaître son contenu à l'entrée dans la fenêtre.
 *
 * **Aucun JavaScript.** L'animation est portée par `animation-timeline: view()`
 * (voir `.apparait` dans `globals.css`), donc elle tourne hors du fil principal
 * et ne coûte rien au chargement.
 *
 * Surtout, elle est *facultative* : le contenu est visible par défaut, et la
 * règle qui le masque ne s'applique que si le navigateur sait animer au
 * défilement. Une première version s'appuyait sur un `IntersectionObserver` —
 * à la mesure, seuls 4 blocs sur 22 devenaient visibles, et un visiteur dont le
 * script n'aurait pas chargé se serait retrouvé devant une page blanche. Du
 * contenu qui dépend d'une animation pour exister est un bogue, pas un effet.
 *
 * `decalage` échelonne les éléments d'une même série en décalant leur plage
 * d'animation, ce qui remplace `animation-delay` — inopérant sur une timeline
 * de défilement.
 */
export function Apparait({
  children,
  delai = 0,
  className,
  as: Balise = "div",
}: {
  children: React.ReactNode;
  /** En millisecondes, converti en décalage de plage. 60–80 ms par élément. */
  delai?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  return (
    <Balise
      className={cn("apparait", className)}
      style={
        delai
          ? ({ "--decalage": `${Math.min(delai / 10, 18)}%` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Balise>
  );
}
