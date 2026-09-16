import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Surligne } from "@/components/commun/surligne";
import { BlurReveal } from "@/components/blur-reveal";
import { Marquee } from "@/components/marquee";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const PREUVES = [
  "Devis sous 48 h",
  "Prix affichés",
  "Code livré, pas loué",
];

const TECHNOS = [
  "Next.js",
  "React",
  "TypeScript",
  "Supabase",
  "PostgreSQL",
  "Tailwind CSS",
  "n8n",
  "Vercel",
  "Node.js",
  "Python",
  "Stripe",
  "Resend",
];

/**
 * Le hero.
 *
 * Trois contraintes qui décident de tout le reste :
 *
 * 1. Le `<h1>` est l'élément le plus grand de la page, donc celui que Google
 *    chronomètre. Il est rendu côté serveur et n'attend aucune animation
 *    JavaScript — seul le surlignage bleu s'anime, derrière un texte déjà
 *    lisible.
 * 2. La promesse tient en une phrase et nomme la ville : c'est la requête que
 *    le visiteur a tapée.
 * 3. Deux appels à l'action, pas cinq. Un principal, un secondaire.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Le halo bleu. Un seul par écran — au-delà, ça devient du décor. */}
      <div
        aria-hidden="true"
        className="halo-bleu pointer-events-none absolute inset-x-0 top-0 h-[520px]"
      />

      <div className="conteneur relative pt-16 pb-14 sm:pt-24 sm:pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 py-1.5 pr-4 pl-3 text-sm text-muted-foreground backdrop-blur-sm">
            <span className="relative grid size-2 place-items-center" aria-hidden="true">
              <span className="absolute size-2 animate-ping rounded-full bg-bleu-500 opacity-60 [animation-duration:2.4s]" />
              <span className="size-2 rounded-full bg-bleu-500" />
            </span>
            Disponible pour de nouveaux projets
          </p>

          <h1 className="mt-6 text-[2.5rem] font-semibold sm:text-6xl">
            Des sites web et des{" "}
            <Surligne delai={0.15}>automatisations IA</Surligne> pour les entreprises de{" "}
            {SITE.ville}.
          </h1>

          <BlurReveal
            as="p"
            delay={0.25}
            speedReveal={2.4}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-balance text-muted-foreground"
          >
            Je conçois des sites qui se chargent vite et qu&apos;on trouve sur Google, et
            j&apos;automatise les tâches qui vous prennent des heures chaque semaine. Les
            prix sont affichés, les réalisations aussi.
          </BlurReveal>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className={cn(
                "group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 sm:w-auto",
                "bg-primary text-[15px] font-medium text-primary-foreground",
                "shadow-[0_1px_2px_oklch(0_0_0/0.10),0_10px_30px_-12px_var(--bleu-600)]",
                "transition-[background-color,scale,box-shadow] duration-150 ease-out",
                "hover:bg-bleu-700 active:scale-96 dark:hover:bg-bleu-400",
              )}
            >
              Demander un devis gratuit
              <ArrowRight
                className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </Link>

            <Link
              href="/realisations"
              className={cn(
                "inline-flex h-12 w-full items-center justify-center rounded-xl border border-border px-6 sm:w-auto",
                "bg-background text-[15px] font-medium text-foreground",
                "transition-[background-color,border-color,scale] duration-150 ease-out",
                "hover:bg-secondary active:scale-96",
              )}
            >
              Voir les réalisations
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
            {PREUVES.map((preuve) => (
              <li
                key={preuve}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <Check className="size-4 text-bleu-600 dark:text-bleu-400" strokeWidth={2.25} />
                {preuve}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* La bande des technos. Elle défile en continu, donc en `linear` : une
          accélération sur un mouvement sans fin se verrait comme un à-coup. */}
      <div className="relative border-y border-border bg-secondary/30 py-4">
        <Marquee duration={44} pauseOnHover fade fadeAmount={12}>
          {TECHNOS.map((techno) => (
            <span
              key={techno}
              className="mx-5 text-sm font-medium tracking-wide text-muted-foreground"
            >
              {techno}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
