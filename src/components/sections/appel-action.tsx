import { BackgroundPattern } from "@appica/ui-react/background-pattern";
import { BorderBeam } from "@appica/ui-react/border-beam";
import { Button } from "@appica/ui-react/button";
import { CopyButton } from "@appica/ui-react/copy-button";
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
      {/* Deux comètes décalées d'une demi-boucle font le tour du bloc : le
          dernier appel de la page doit être le plus vivant, sans clignoter. */}
      {/* L'apparition au défilement porte sur le contenant des comètes, pas sur
          la carte : sinon la carte glisserait et les contours resteraient en
          place, décalés, le temps de l'entrée. */}
      <Apparait>
      <BorderBeam
        color="var(--bleu-500)"
        length={14}
        thickness={1.5}
        speed={9}
        className="rounded-3xl"
      >
      <BorderBeam
        color="var(--bleu-400)"
        length={14}
        thickness={1.5}
        speed={9}
        delay={-4.5}
        className="rounded-3xl"
      >
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-bleu-200 dark:border-bleu-800",
          "bg-bleu-50 px-6 py-14 text-center sm:px-14 sm:py-20 dark:bg-bleu-950/40",
        )}
      >
        {/* Une trame de points (BackgroundPattern d'Appica) qui s'éclaire sous
            le pointeur : le bloc réagit quand on s'en approche, comme le reste
            de la page réagit au défilement. */}
        <BackgroundPattern
          variant="dots"
          spotlight={220}
          className="pointer-events-auto absolute inset-0 text-bleu-300 [mask-image:radial-gradient(80%_90%_at_50%_0%,black,transparent)] dark:text-bleu-800"
        />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">{titre}</h2>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-balance text-bleu-950 dark:text-bleu-100/80">
            {texte}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              nativeButton={false}
              render={<Link href="/contact" />}
              className="h-12 w-full rounded-xl px-6 text-[15px] shadow-[0_1px_2px_oklch(0_0_0/0.10),0_10px_30px_-12px_var(--bleu-700)] sm:w-auto"
            >
              Demander un devis
              <ArrowRight data-icon="end" aria-hidden="true" />
            </Button>

            {/* L'adresse, avec de quoi la copier : sur un ordinateur sans
                logiciel de messagerie, un lien `mailto:` n'ouvre rien. */}
            <div className="flex h-12 w-full items-center gap-1 rounded-xl border border-bleu-300 bg-background/70 pr-1.5 pl-4 backdrop-blur-sm sm:w-auto dark:border-bleu-700">
              <Mail className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <a
                href={`mailto:${SITE.email}`}
                className="truncate px-1.5 text-[15px] font-medium underline-offset-4 hover:underline"
              >
                {SITE.email}
              </a>
              <CopyButton
                value={SITE.email}
                variant="ghost"
                size="icon-sm"
                label="Copier l'adresse email"
                copiedLabel="Adresse copiée"
              />
            </div>
          </div>
        </div>
      </div>
      </BorderBeam>
      </BorderBeam>
      </Apparait>
    </section>
  );
}
