"use client";

import { TextAnimate, type TextAnimateProps } from "@appica/ui-react/text-animate";
import { animate, useInView, useReducedMotion } from "motion/react";
import * as React from "react";

const abonnementVide = () => () => {};

/**
 * `TextAnimate` d'Appica, déclenché à l'entrée dans la fenêtre.
 *
 * Utilisé tel quel, `TextAnimate` démarre au montage : un surtitre situé trois
 * écrans plus bas aurait fini de s'animer avant qu'on y arrive. Ici on pilote
 * sa progression nous-mêmes (`progress`, de 0 à 1) :
 *
 * - **au rendu serveur**, progression à 1 : le texte est complet dans le HTML,
 *   pour Google comme pour un visiteur dont le script ne charge pas ;
 * - **une fois monté**, elle repasse à 0 tant que le texte n'a pas été vu ;
 * - **à l'entrée dans la fenêtre**, elle est animée jusqu'à 1, une seule fois.
 *
 * Le texte réel reste de toute façon lu par les lecteurs d'écran : `TextAnimate`
 * le double dans un `sr-only` et masque la version animée.
 */
export function TexteAnime({
  children,
  effet = "scramble",
  duree = 0.9,
  delai = 0,
  ...props
}: {
  children: string;
  effet?: TextAnimateProps["effect"];
  /** En secondes. */
  duree?: number;
  /** En secondes. */
  delai?: number;
} & Omit<TextAnimateProps, "children" | "effect" | "progress" | "autoPlay" | "duration" | "delay">) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const vu = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const moinsDeMouvement = useReducedMotion();
  const monte = React.useSyncExternalStore(abonnementVide, () => true, () => false);
  const [progression, setProgression] = React.useState(0);

  React.useEffect(() => {
    if (!vu || moinsDeMouvement) return;
    const controle = animate(0, 1, {
      duration: duree,
      delay: delai,
      ease: "linear",
      onUpdate: setProgression,
    });
    return () => controle.stop();
  }, [vu, moinsDeMouvement, duree, delai]);

  // Pas encore monté, ou mouvement réduit : texte complet, sans animation.
  const valeur = !monte || moinsDeMouvement ? 1 : progression;

  return (
    <span ref={ref}>
      <TextAnimate effect={effet} progress={valeur} {...props}>
        {children}
      </TextAnimate>
    </span>
  );
}
