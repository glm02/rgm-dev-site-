import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Le logo : un chevron `</>` stylisé en bleu, puis le nom.
 *
 * Dessiné en SVG inline plutôt qu'importé : c'est six lignes, ça évite une
 * requête réseau, et `currentColor` lui fait suivre le thème tout seul.
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
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-[18px]"
          aria-hidden="true"
        >
          <path d="m8 7-5 5 5 5" />
          <path d="m16 7 5 5-5 5" />
        </svg>
      </span>

      {avecTexte && (
        <span className="text-[15px] leading-none font-semibold tracking-tight">
          RGM<span className="text-primary">.</span>Dev
        </span>
      )}
    </Link>
  );
}
