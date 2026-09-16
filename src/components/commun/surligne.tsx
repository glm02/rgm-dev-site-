"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Surligne un fragment de titre au feutre bleu.
 *
 * Reprend la technique de `HighlightedText` de Spell UI — un fond qui glisse
 * derrière le texte — mais en bleu translucide plutôt qu'en `mix-blend-difference`
 * noir et blanc, qui donnait un rendu inversé incompatible avec la charte.
 *
 * Le texte reste dans le DOM et lisible dès le premier rendu : seul le fond
 * s'anime. C'est ce qui permet de l'utiliser sur un `<h1>` sans retarder
 * l'affichage du plus grand élément de la page.
 */
export function Surligne({
  children,
  delai = 0,
  className,
}: {
  children: React.ReactNode;
  /** En secondes, comme le reste de Motion. */
  delai?: number;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-block isolate", className)}>
      <motion.span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-[-0.12em] bottom-[0.02em] top-[0.12em] -z-10 origin-left rounded-[0.18em]",
          "bg-bleu-100 dark:bg-bleu-800/60",
        )}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ type: "spring", duration: 0.55, bounce: 0, delay: delai }}
      />
      <span className="text-bleu-700 dark:text-bleu-200">{children}</span>
    </span>
  );
}
