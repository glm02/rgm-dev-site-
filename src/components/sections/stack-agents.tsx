import { Button } from "@appica/ui-react/button";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { siGithub } from "simple-icons";

import { Apparait } from "@/components/commun/apparait";
import { TitreSection } from "@/components/commun/titre-section";
import { Marquee } from "@/components/marquee";
import { OrbiteStack } from "@/components/stack/orbite-stack";
import { TuileLogo } from "@/components/stack/tuile-logo";
import {
  DEPOT_SKILLS,
  ORBITE_EXTERIEURE,
  ORBITE_INTERIEURE,
  REGLES,
  SKILLS,
  TOUS_LES_OUTILS,
} from "@/lib/stack";

/**
 * La stack, en version courte sur l'accueil.
 *
 * Elle répond à « est-ce qu'il sait le faire ? » juste après les
 * réalisations : les agents, les règles qui les cadrent, et tous les outils
 * réellement employés qui défilent dessous. Le détail — le parcours en six
 * étapes, Hermes en production, le catalogue des skills — reste sur `/stack`.
 *
 * Le bloc repose sur un fond plein : la nappe de points de l'accueil passerait
 * sinon derrière les logos.
 */
export function StackAgents() {
  const moitie = Math.ceil(TOUS_LES_OUTILS.length / 2);
  const rangees = [TOUS_LES_OUTILS.slice(0, moitie), TOUS_LES_OUTILS.slice(moitie)];

  return (
    <section className="conteneur-large py-20 sm:py-28">
      <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-background shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_40px_-16px_rgb(0_0_0/0.10)]">
        <div aria-hidden="true" className="halo-bleu pointer-events-none absolute inset-x-0 top-0 h-96" />

        <div className="relative grid items-center gap-12 px-5 pt-14 sm:px-10 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-14">
          <div>
            <TitreSection
              centre={false}
              surtitre="Ma stack"
              titre="Des agents IA cadrés, et toute la stack qui va avec"
              sousTitre={`Claude, Codex et Hermes travaillent sur mes projets avec ${SKILLS.length} procédures écrites et ${TOUS_LES_OUTILS.length} outils maîtrisés. Trois règles ne bougent jamais :`}
            />

            <ul className="mt-6 space-y-3">
              {REGLES.map((regle, index) => (
                <Apparait key={regle.titre} as="li" delai={index * 60}>
                  <span className="flex items-center gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-bleu-600 text-white">
                      <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                    </span>
                    <span className="font-medium">{regle.titre}.</span>
                  </span>
                </Apparait>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="primary"
                size="lg"
                nativeButton={false}
                render={<Link href="/stack" />}
                className="h-12 w-full rounded-2xl px-6 text-[15px] shadow-[0_1px_2px_oklch(0_0_0/0.10),0_14px_40px_-16px_var(--bleu-600)] sm:w-auto"
              >
                Voir ma stack complète
                <ArrowRight data-icon="end" aria-hidden="true" />
              </Button>
              <Button
                variant="soft"
                size="lg"
                nativeButton={false}
                render={<a href={DEPOT_SKILLS} target="_blank" rel="noreferrer" />}
                className="h-12 w-full rounded-2xl px-6 text-[15px] sm:w-auto"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
                  <path d={siGithub.path} />
                </svg>
                Les skills sur GitHub
              </Button>
            </div>
          </div>

          <OrbiteStack interieure={ORBITE_INTERIEURE} exterieure={ORBITE_EXTERIEURE} />
        </div>

        {/* Tous les outils, en deux rangées qui défilent en sens opposés.
            Linéaire et lent ; arrêt au survol pour lire un nom. */}
        <div className="relative mt-12 space-y-4 border-t border-border/70 bg-secondary/30 py-8">
          {rangees.map((rangee, index) => (
            <Marquee
              key={index}
              duration={70}
              pauseOnHover
              fade
              fadeAmount={10}
              direction={index === 0 ? "left" : "right"}
            >
              {rangee.map((outil) => (
                <span key={outil.nom} className="mx-2 flex items-center gap-2.5 rounded-full border border-border/70 bg-background py-1.5 pr-4 pl-1.5">
                  <TuileLogo outil={outil} className="size-8 text-[11px] shadow-none" tailleIcone="size-4" />
                  <span className="text-sm font-medium whitespace-nowrap">{outil.nom}</span>
                </span>
              ))}
            </Marquee>
          ))}
        </div>
      </div>
    </section>
  );
}
