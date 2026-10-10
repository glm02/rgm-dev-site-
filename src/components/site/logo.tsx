import Link from "next/link";

import { MarqueRgm } from "./marque-rgm";
import { cn } from "@/lib/utils";

/**
 * Le logo : le symbole RGM en blanc sur une pastille bleue, puis le nom.
 *
 * Le symbole est vectorisé dans `marque-rgm.tsx` : net à toutes les tailles,
 * sans requête réseau, et il suit le thème par `currentColor`.
 */
export function Logo({
  className,
  avecTexte = true,
}: {
  className?: string;
  avecTexte?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="RGM Dev — accueil"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg outline-none",
        "transition-[scale] duration-150 ease-out active:scale-96",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-9 place-items-center rounded-[10px] bg-primary text-primary-foreground",
          "shadow-[0_1px_2px_oklch(0_0_0/0.08),0_4px_12px_-4px_var(--bleu-600)]",
          "transition-[background-color] duration-150 ease-out",
        )}
      >
        <MarqueRgm className="size-[22px]" />
      </span>

      {avecTexte && (
        <span className="text-[15px] leading-none font-semibold tracking-tight">
          RGM<span className="text-primary">.</span>Dev
        </span>
      )}
    </Link>
  );
}
