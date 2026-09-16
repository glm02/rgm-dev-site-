import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { fourchetteProjet } from "@/lib/format";
import type { Projet } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Une réalisation, en carte.
 *
 * La carte entière est cliquable via un lien étendu par `::after` : c'est la
 * seule façon d'avoir une grande zone de clic tout en gardant un seul lien
 * dans l'arbre d'accessibilité — un `<a>` qui envelopperait tout annoncerait
 * le contenu complet de la carte à chaque tabulation.
 *
 * Les rayons sont concentriques : la vignette intérieure est en `rounded-xl`
 * dans une carte en `rounded-2xl` avec `p-1.5`. Un rayon intérieur égal au
 * rayon extérieur donne cet écart visuel qu'on remarque sans savoir nommer.
 */
/** Une capture servie depuis `public/`, par opposition à une URL distante. */
const locale = (source: string) => source.startsWith("/");

export function CarteProjet({
  projet,
  priorite = false,
}: {
  projet: Projet;
  /** La première carte d'une grille : pas de délai d'apparition. */
  priorite?: boolean;
}) {
  const prix = fourchetteProjet(projet.prix_min, projet.prix_max);

  return (
    <article
      className={cn(
        // `h-full` : sans lui, une carte sans budget est plus courte que ses
        // voisines et la rangée part de travers.
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-1.5",
        "transition-[border-color,box-shadow,translate] duration-200 ease-out",
        "hover:-translate-y-0.5 hover:border-bleu-200 dark:hover:border-bleu-800",
        "hover:shadow-[0_1px_2px_oklch(0_0_0/0.04),0_12px_32px_-16px_oklch(0_0_0/0.18)]",
        "focus-within:border-bleu-300 dark:focus-within:border-bleu-700",
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden rounded-xl",
          "bg-secondary outline outline-black/10 dark:outline-white/10",
        )}
      >
        {projet.image_couverture ? (
          locale(projet.image_couverture) ? (
            <Image
              src={projet.image_couverture}
              alt={`Aperçu du site ${projet.titre}`}
              fill
              // La vignette fait au plus un tiers de la grille sur grand écran,
              // la moitié sur tablette, toute la largeur sur mobile. Sans cette
              // indication, Next sert l'image pleine taille à tout le monde.
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              priority={priorite}
              className="object-cover object-top transition-[scale] duration-300 ease-out group-hover:scale-[1.02]"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- image
            // distante : une fois le bucket Supabase Storage créé, son domaine
            // ira dans `images.remotePatterns` et cette branche disparaîtra.
            // En attendant, `next/image` refuserait un hôte non déclaré.
            <img
              src={projet.image_couverture}
              alt={`Aperçu du site ${projet.titre}`}
              loading={priorite ? "eager" : "lazy"}
              className="size-full object-cover object-top transition-[scale] duration-300 ease-out group-hover:scale-[1.02]"
            />
          )
        ) : (
          <PlaceholderProjet titre={projet.titre} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {projet.secteur && (
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {projet.secteur}
              </p>
            )}
            <h3 className="mt-1.5 text-lg font-semibold">
              <Link
                href={`/realisations/${projet.slug}`}
                className="outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']"
              >
                {projet.titre}
              </Link>
            </h3>
          </div>

          <ArrowUpRight
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-[color,translate] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bleu-600 dark:group-hover:text-bleu-400"
            strokeWidth={1.75}
          />
        </div>

        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {projet.resume}
        </p>

        {/* Trois briques et un compteur : quatre remplissaient la ligne et
            rejetaient le « +2 » sur une ligne à lui tout seul. */}
        <div className="mt-4 mb-5 flex flex-wrap items-center gap-1.5">
          {projet.stack.slice(0, 3).map((techno) => (
            <span
              key={techno}
              className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
            >
              {techno}
            </span>
          ))}
          {projet.stack.length > 3 && (
            <span className="text-xs font-medium text-muted-foreground">
              +{projet.stack.length - 3}
            </span>
          )}
        </div>

        {/* `mt-auto` colle cette ligne au bas de la carte : les budgets
            s'alignent d'une carte à l'autre au lieu de flotter après un
            résumé plus ou moins long. */}
        <p className="mt-auto border-t border-border pt-4 text-sm text-muted-foreground">
          {prix ? (
            <>
              Budget du projet{" "}
              <span className="font-semibold text-foreground">{prix}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Projet interne</span>
          )}
        </p>
      </div>
    </article>
  );
}

/**
 * Le motif affiché tant qu'il n'y a pas de capture.
 *
 * Une grille bleue très pâle avec l'initiale du projet. Mieux qu'un carré gris
 * ou qu'une image d'archive : ça se lit comme « capture à venir » plutôt que
 * comme une image cassée.
 */
function PlaceholderProjet({ titre }: { titre: string }) {
  return (
    <div className="relative grid size-full place-items-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70 dark:opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(var(--bleu-200) 1px, transparent 1px), linear-gradient(90deg, var(--bleu-200) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent)",
        }}
      />
      <span className="relative text-5xl font-semibold text-bleu-600/25 dark:text-bleu-400/25">
        {titre.charAt(0)}
      </span>
    </div>
  );
}
