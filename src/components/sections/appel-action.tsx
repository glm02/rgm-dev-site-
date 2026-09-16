import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * L'appel à l'action de fin de page.
 *
 * Le bloc le plus bleu du site, et le seul : c'est ce qui lui donne son poids.
 * Si chaque section était traitée ainsi, plus rien ne ressortirait.
 */
export function AppelAction({
  titre = "Parlons de votre projet",
  texte = "Un appel de trente minutes pour comprendre votre besoin, et un devis chiffré sous 48 heures. Gratuit, sans engagement — et si ce n'est pas pour moi, je vous le dis franchement.",
}: {
  titre?: string;
  texte?: string;
}) {
  return (
    <section className="conteneur pb-4">
      <Apparait
        className={cn(
          "relative overflow-hidden rounded-3xl border border-bleu-200 dark:border-bleu-800",
          "bg-bleu-50 px-6 py-14 text-center sm:px-14 sm:py-20 dark:bg-bleu-950/40",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(var(--bleu-300) 1px, transparent 1px), linear-gradient(90deg, var(--bleu-300) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(70% 80% at 50% 0%, black, transparent)",
          }}
        />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">{titre}</h2>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-balance text-bleu-900/80 dark:text-bleu-100/80">
            {texte}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className={cn(
                "group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 sm:w-auto",
                "bg-primary text-[15px] font-medium text-primary-foreground",
                "shadow-[0_1px_2px_oklch(0_0_0/0.10),0_10px_30px_-12px_var(--bleu-700)]",
                "transition-[background-color,scale] duration-150 ease-out",
                "hover:bg-bleu-700 active:scale-96 dark:hover:bg-bleu-400",
              )}
            >
              Demander un devis
              <ArrowRight
                className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>

            <a
              href={`mailto:${SITE.email}`}
              className={cn(
                "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 sm:w-auto",
                "border border-bleu-300 bg-background/70 text-[15px] font-medium backdrop-blur-sm",
                "transition-[background-color,scale] duration-150 ease-out",
                "hover:bg-background active:scale-96 dark:border-bleu-700",
              )}
            >
              <Mail className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Écrire un mail
            </a>
          </div>
        </div>
      </Apparait>
    </section>
  );
}
