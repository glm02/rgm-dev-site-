"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Surligne un fragment de titre au feutre bleu.
 *
 * Reprend l'idée de `HighlightedText` de Spell UI — un fond qui balaie le texte
 * — mais en bleu translucide plutôt qu'en `mix-blend-difference` noir et blanc,
 * qui donnait un rendu inversé incompatible avec la charte.
 *
 * **Le fond est porté par le texte lui-même**, pas par un calque en position
 * absolue. Une première version utilisait un `<span>` absolu à l'intérieur d'un
 * `inline-block` : sur mobile, le fragment devenait insécable et « automatisations
 * IA » débordait de l'écran. Ici le surlignage est un dégradé en arrière-plan
 * dont on anime la largeur, et `box-decoration-break: clone` en redonne un à
 * chaque ligne — le titre peut donc se couper où il veut.
 *
 * Le texte est lisible dès le premier rendu : seul le fond s'anime. C'est ce
 * qui permet de l'utiliser sur un `<h1>` sans retarder l'affichage du plus
 * grand élément de la page.
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
    <motion.span
      className={cn(
        "text-bleu-700 dark:text-bleu-200",
        "[box-decoration-break:clone] [-webkit-box-decoration-break:clone]",
        "rounded-[0.14em] px-[0.08em]",
        "bg-[linear-gradient(var(--surligne),var(--surligne))] bg-no-repeat",
        "[--surligne:var(--bleu-100)] dark:[--surligne:color-mix(in_oklch,var(--bleu-700)_55%,transparent)]",
        className,
      )}
      style={{ backgroundPosition: "left center" }}
      initial={{ backgroundSize: "0% 88%" }}
      whileInView={{ backgroundSize: "100% 88%" }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1], delay: delai }}
    >
      {children}
    </motion.span>
  );
}
