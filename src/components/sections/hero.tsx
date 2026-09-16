import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LogoTechno, TECHNOS } from "@/components/commun/logos-technos";
import { Surligne } from "@/components/commun/surligne";
import { ToileMaillage } from "@/components/commun/toile-maillage";
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
      {/* La scène 3D, puis le halo par-dessus. Le halo n'est pas décoratif : il
          éclaircit le centre et c'est lui qui garde le titre lisible quelle que
          soit la position de la houle. */}
      <ToileMaillage className="-z-20" />
      <div
        aria-hidden="true"
        className="halo-bleu pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px]"
      />

      <div className="conteneur relative pt-20 pb-20 sm:pt-28 sm:pb-28">
        {/* `max-w-5xl` et pas `4xl` : à 4rem, « pour les entreprises de Lyon. »
            ne tenait pas sur une ligne et laissait « Lyon. » orpheline. */}
        <div className="mx-auto max-w-5xl text-center">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-background/70 py-1.5 pr-4 pl-3 text-[13px] font-medium text-muted-foreground backdrop-blur-md">
            <span className="relative grid size-2 place-items-center" aria-hidden="true">
              <span className="absolute size-2 animate-ping rounded-full bg-bleu-500 opacity-60 [animation-duration:2.6s]" />
              <span className="size-2 rounded-full bg-bleu-500" />
            </span>
            Disponible pour de nouveaux projets
          </p>

          {/* Le texte doit pouvoir se couper où il veut : « automatisations IA »
              soudé par une espace insécable débordait de l'écran sur mobile. */}
          <h1 className="mt-8 text-[2.1rem] leading-[1.06] font-semibold tracking-[-0.03em] sm:text-5xl sm:leading-[1.03] lg:text-[4rem]">
            Des sites web et des <Surligne delai={0.15}>automatisations IA</Surligne>
            <br className="hidden lg:block" /> pour les entreprises de {SITE.ville}.
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-balance text-muted-foreground sm:text-xl">
            Je construis des sites qu&apos;on trouve sur Google, et je fais
            disparaître les tâches qui vous prennent des heures chaque semaine.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className={cn(
                "group inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl px-7 sm:w-auto",
                "bg-primary text-[15px] font-medium text-primary-foreground",
                "shadow-[0_1px_2px_oklch(0_0_0/0.10),0_14px_40px_-16px_var(--bleu-600)]",
                "transition-[background-color,scale,box-shadow] duration-150 ease-out",
                "hover:bg-bleu-700 hover:shadow-[0_1px_2px_oklch(0_0_0/0.10),0_18px_46px_-16px_var(--bleu-600)]",
                "active:scale-96 dark:hover:bg-bleu-400",
              )}
            >
              Demander un devis gratuit
              <ArrowRight
                className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/realisations"
              className={cn(
                "inline-flex h-13 w-full items-center justify-center rounded-2xl px-7 sm:w-auto",
                "border border-border bg-background/70 text-[15px] font-medium backdrop-blur-md",
                "transition-[background-color,border-color,scale] duration-150 ease-out",
                "hover:border-bleu-200 hover:bg-background active:scale-96 dark:hover:border-bleu-800",
              )}
            >
              Voir les réalisations
            </Link>
          </div>
        </div>

        {/* Les trois repères. En dur plutôt qu'en chiffres flatteurs : on ne
            gonfle pas « 50 clients satisfaits » quand on démarre. Ce qui est
            promis ici est vérifiable. */}
        <dl className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 backdrop-blur-md sm:grid-cols-3">
          {PREUVES.map((preuve) => (
            <div key={preuve.libelle} className="bg-background/80 px-6 py-5 text-center">
              <dt className="text-xl font-semibold tracking-tight text-bleu-700 dark:text-bleu-300">
                {preuve.valeur}
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
        <Marquee duration={62} pauseOnHover fade fadeAmount={14}>
          {TECHNOS.map((techno) => (
            <LogoTechno
              key={techno.icone.title}
              icone={techno.icone}
              nom={techno.nom}
              className="mx-6"
            />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
