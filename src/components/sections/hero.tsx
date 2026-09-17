import { Badge } from "@appica/ui-react/badge";
import { BorderBeam } from "@appica/ui-react/border-beam";
import { Button } from "@appica/ui-react/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@appica/ui-react/tooltip";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LogoTechno, TECHNOS } from "@/components/commun/logos-technos";
import { Surligne } from "@/components/commun/surligne";
import { TexteAnime } from "@/components/commun/texte-anime";
import { Marquee } from "@/components/marquee";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const PREUVES = [
  { valeur: "48 h", libelle: "pour un devis chiffré" },
  { valeur: "Affichés", libelle: "les prix, sur le site" },
  { valeur: "À vous", libelle: "le code, le dépôt, l'hébergement" },
];


/**
 * Le hero.
 *
 * Trois contraintes décident de tout le reste :
 *
 * 1. Le `<h1>` est l'élément le plus grand de la page, donc celui que Google
 *    chronomètre. Il est rendu côté serveur et n'attend aucune animation : le
 *    surlignage bleu s'anime derrière un texte déjà lisible, et la scène 3D se
 *    charge après coup, en fondu.
 * 2. La promesse tient en une phrase et nomme la ville : c'est la requête que
 *    le visiteur a tapée.
 * 3. Deux appels à l'action, pas cinq. Un principal, un secondaire.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* La nappe 3D n'est plus ici : elle est posée en fond fixe de toute la
          page d'accueil (voir `(site)/page.tsx`). Reste le halo, qui éclaircit
          le centre et garde le titre lisible quelle que soit la houle. */}
      <div
        aria-hidden="true"
        className="halo-bleu pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px]"
      />

      <div className="conteneur relative pt-20 pb-20 sm:pt-28 sm:pb-28">
        {/* `max-w-5xl` et pas `4xl` : à 4rem, « pour les entreprises de Lyon. »
            ne tenait pas sur une ligne et laissait « Lyon. » orpheline. */}
        <div className="mx-auto max-w-5xl text-center">
          {/* Le contour lumineux (BorderBeam d'Appica) fait le tour du badge en
              continu, lentement : c'est le seul élément « vivant » du haut de
              page, il dit « disponible maintenant » sans un mot de plus. */}
          <BorderBeam
            color="var(--bleu-500)"
            length={22}
            thickness={1.5}
            speed={7}
            className="inline-flex rounded-full"
          >
            <Badge
              variant="outline"
              size="lg"
              className="gap-2.5 rounded-full bg-background/70 pr-4 pl-3 font-medium text-foreground backdrop-blur-md"
            >
              <span className="relative grid size-2 place-items-center" aria-hidden="true">
                <span className="absolute size-2 animate-ping-paced rounded-full bg-bleu-500" />
                <span className="size-2 rounded-full bg-bleu-500" />
              </span>
              Disponible pour de nouveaux projets
            </Badge>
          </BorderBeam>

          {/* Le texte doit pouvoir se couper où il veut : « automatisations IA »
              soudé par une espace insécable débordait de l'écran sur mobile. */}
          <h1 className="mt-8 text-[2.1rem] leading-[1.06] font-semibold tracking-[-0.03em] sm:text-5xl sm:leading-[1.03] lg:text-[4rem]">
            Des sites web et des <Surligne delai={0.15}>automatisations IA</Surligne>
            <br className="hidden lg:block" /> pour les entreprises de {SITE.ville}.
          </h1>

          {/* Les mots s'allument l'un après l'autre (TextAnimate, effet
              « highlight »). Effet choisi parce que chaque mot occupe déjà sa
              place au départ : la mise en page ne bouge pas pendant l'animation. */}
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-balance text-muted-foreground sm:text-xl">
            <TexteAnime effet="highlight" by="word" duree={1.3} delai={0.35}>
              {"Je construis des sites qu’on trouve sur Google, et je fais disparaître les tâches qui vous prennent des heures chaque semaine."}
            </TexteAnime>
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {/* Au survol, une comète blanche fait le tour du bouton principal.
                Réservé à ce bouton : c'est l'action qu'on veut voir cliquée. */}
            <BorderBeam
              color="oklch(1 0 0 / 0.9)"
              length={16}
              thickness={1.5}
              speed={2.4}
              revealOn={["hover", "press"]}
              pressScale
              className="w-full rounded-2xl sm:w-auto"
            >
            <Button
              variant="primary"
              size="lg"
              nativeButton={false}
              render={<Link href="/contact" />}
              className={cn(
                "h-13 w-full rounded-2xl px-7 text-[15px] sm:w-auto",
                "shadow-[0_1px_2px_oklch(0_0_0/0.10),0_14px_40px_-16px_var(--bleu-600)]",
              )}
            >
              Demander un devis gratuit
              <ArrowRight data-icon="end" aria-hidden="true" />
            </Button>
            </BorderBeam>

            <Button
              variant="soft"
              size="lg"
              nativeButton={false}
              render={<Link href="/realisations" />}
              className="h-13 w-full rounded-2xl px-7 text-[15px] sm:w-auto"
            >
              Voir les réalisations
            </Button>
          </div>
        </div>

        {/* Les trois repères. En dur plutôt qu'en chiffres flatteurs : on ne
            gonfle pas « 50 clients satisfaits » quand on démarre. Ce qui est
            promis ici est vérifiable. */}
        <dl className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 backdrop-blur-md sm:grid-cols-3">
          {PREUVES.map((preuve, index) => (
            <div key={preuve.libelle} className="bg-background/80 px-6 py-5 text-center">
              <dt className="text-xl font-semibold tracking-tight text-bleu-700 dark:text-bleu-300">
                {/* Les valeurs se « décodent » (effet scramble) : un clin d'œil
                    de développeur, court, joué une seule fois. */}
                <TexteAnime effet="scramble" duree={0.9} delai={0.5 + index * 0.12}>
                  {preuve.valeur}
                </TexteAnime>
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">{preuve.libelle}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* La bande des technos. Défilement continu, donc `linear` : une
          accélération sur un mouvement sans fin se lirait comme un à-coup.
          Elle s'arrête au survol, pour qu'on puisse lire un logo qui intrigue. */}
      <div className="relative border-t border-border bg-secondary/30 py-4">
        {/* Chaque logo dit à quoi il sert, en infobulle (Tooltip d'Appica) : un
            dirigeant ne sait pas ce qu'est Supabase, il sait ce qu'est « vos
            données hébergées en Europe ». La bande s'arrête au survol, ce qui
            laisse le temps de lire. */}
        <TooltipProvider delay={120}>
          <Marquee duration={62} pauseOnHover fade fadeAmount={14}>
            {TECHNOS.map((techno) => (
              <Tooltip key={techno.icone.title}>
                <TooltipTrigger
                  render={<span tabIndex={0} className="mx-6 rounded-md outline-offset-4" />}
                >
                  <LogoTechno icone={techno.icone} nom={techno.nom} />
                </TooltipTrigger>
                <TooltipContent className="max-w-60 text-center text-xs leading-relaxed">
                  {techno.usage}
                </TooltipContent>
              </Tooltip>
            ))}
          </Marquee>
        </TooltipProvider>
      </div>
    </section>
  );
}
