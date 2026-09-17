import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Le fil d'Ariane.
 *
 * Il double le balisage JSON-LD `BreadcrumbList` : Google remplace l'URL par
 * ce chemin sous le titre du résultat, ce qui gagne en clarté et en taux de
 * clic. Les deux doivent dire la même chose.
 *
 * La dernière étape n'est pas un lien — on n'offre pas d'aller là où on est.
 */
export function FilAriane({
  etapes,
  className,
}: {
  etapes: { nom: string; href: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Fil d'Ariane" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {etapes.map((etape, index) => {
          const derniere = index === etapes.length - 1;

          return (
            <li key={etape.href} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight
                  className="size-3.5 text-muted-foreground"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              )}

              {derniere ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {etape.nom}
                </span>
              ) : (
                <Link
                  href={etape.href}
                  className={cn(
                    "rounded text-muted-foreground",
                    "transition-colors duration-150 ease-out hover:text-foreground",
                  )}
                >
                  {etape.nom}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
