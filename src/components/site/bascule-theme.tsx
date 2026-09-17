"use client";

import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Bascule clair / sombre.
 *
 * La suppression des transitions pendant le basculement est assurée par
 * `disableTransitionOnChange` sur le `ThemeProvider` (voir
 * `fournisseurs.tsx`). Sans elle, la couleur, le fond, la bordure et l'ombre
 * de presque tous les éléments animent leur transition en même temps, et le
 * basculement bave au lieu de claquer.
 *
 * Ici, le seul soin particulier va à l'icône : elle ne disparaît pas, elle se
 * transforme — échelle 0.25 → 1, opacité 0 → 1, flou 4 px → 0. Basculer
 * l'affichage ferait clignoter.
 */
const abonnementVide = () => () => {};

export function BasculeTheme({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // Le thème résolu n'est connu qu'une fois côté navigateur. Rendre une icône
  // avant ça la ferait sauter à l'autre au moment de l'hydratation.
  // `useSyncExternalStore` vaut `false` au rendu serveur et à l'hydratation,
  // `true` ensuite — sans le rendu en cascade d'un `setState` dans un effet.
  const monte = React.useSyncExternalStore(
    abonnementVide,
    () => true,
    () => false,
  );

  const sombre = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(sombre ? "light" : "dark")}
      aria-label={sombre ? "Passer en thème clair" : "Passer en thème sombre"}
      className={cn(
        "relative grid size-9 place-items-center rounded-lg text-muted-foreground",
        "transition-[color,background-color,scale] duration-150 ease-out",
        "hover:bg-secondary hover:text-foreground active:scale-96",
        className,
      )}
    >
      {monte && (
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={sombre ? "sombre" : "clair"}
            initial={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.25, opacity: 0, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            className="absolute inset-0 grid place-items-center"
          >
            {sombre ? (
              <Moon className="size-4.5" strokeWidth={1.75} />
            ) : (
              <Sun className="size-4.5" strokeWidth={1.75} />
            )}
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
}
