import Image from "next/image";
import Link from "next/link";
import { Quote } from "lucide-react";

import { Etoiles } from "./etoiles";
import { dateLongue } from "@/lib/format";
import type { Avis } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Un témoignage client.
 *
 * L'auteur est nommé, son entreprise aussi quand elle est connue : un avis
 * anonyme ne vaut rien, ni pour le visiteur ni pour Google.
 */
export function CarteAvis({
  avis,
  projetSlug,
  className,
}: {
  avis: Avis;
  /** Le projet concerné, s'il est connu : l'avis devient vérifiable. */
  projetSlug?: string | null;
  className?: string;
}) {
  const initiales = avis.auteur_nom
    .split(" ")
    .slice(0, 2)
    .map((mot) => mot.charAt(0).toUpperCase())
    .join("");

  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border bg-card p-6",
        "transition-[border-color,translate] duration-200 ease-out",
        "hover:-translate-y-0.5 hover:border-bleu-200 dark:hover:border-bleu-800",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Etoiles note={avis.note} />
        <Quote
          className="size-5 text-bleu-200 dark:text-bleu-800"
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>

      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed">
        {avis.contenu}
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        {avis.auteur_avatar ? (
          <Image
            src={avis.auteur_avatar}
            alt={`Photo de ${avis.auteur_nom}`}
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full object-cover border border-border"
          />
        ) : (
          <span
            className="grid size-10 shrink-0 place-items-center rounded-full bg-bleu-50 text-sm font-semibold text-bleu-700 dark:bg-bleu-900/50 dark:text-bleu-200"
            aria-hidden="true"
          >
            {initiales}
          </span>
        )}

        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{avis.auteur_nom}</span>
          <span className="block truncate text-sm text-muted-foreground">
            {[avis.auteur_role, avis.auteur_entreprise].filter(Boolean).join(" · ") ||
              dateLongue(avis.cree_le)}
          </span>
        </span>
      </figcaption>

      {projetSlug && (
        <Link
          href={`/realisations/${projetSlug}`}
          className="mt-4 text-sm font-medium text-bleu-700 underline-offset-4 transition-colors duration-150 ease-out hover:underline dark:text-bleu-300"
        >
          Voir le projet
        </Link>
      )}
    </figure>
  );
}
