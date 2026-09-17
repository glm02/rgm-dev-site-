import { Avatar, AvatarBadge, AvatarFallback } from "@appica/ui-react/avatar";
import {
  PreviewCard,
  PreviewCardContent,
  PreviewCardTrigger,
} from "@appica/ui-react/preview-card";
import { Separator } from "@appica/ui-react/separator";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const ENGAGEMENTS = [
  {
    titre: "Un seul interlocuteur",
    texte: "Celui qui prend votre appel est celui qui écrit le code. Rien ne se perd entre un commercial et un développeur.",
  },
  {
    titre: "Basé à Lyon",
    texte: `Rendez-vous sur place dans un rayon de ${SITE.rayonKm} km. Le reste se fait très bien en visio.`,
  },
  {
    titre: "Rien n'est loué",
    texte: "Le code, le dépôt, l'hébergement et la base sont à votre nom. Vous pouvez partir quand vous voulez.",
  },
];

/**
 * « Qui est derrière ».
 *
 * Un freelance vend d'abord une personne. Cette section répond à la question
 * que personne ne pose mais que tout le monde se pose : est-ce une agence qui
 * sous-traite, ou quelqu'un qui fait le travail lui-même ?
 *
 * L'image est à gauche et déborde légèrement du bloc de texte : sur une page
 * où tout est centré, cette asymétrie casse le rythme juste au bon endroit.
 */
export function APropos() {
  return (
    <section className="conteneur py-20 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <Apparait className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-secondary outline outline-black/10 dark:outline-white/10">
            <Image
              src="/images/lyon-studio.jpg"
              alt="Poste de travail face aux toits de Lyon et à la colline de Fourvière"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* L'étiquette de lieu, posée sur la photo. Elle dit ce que l'image
              montre au lieu de laisser le visiteur deviner que c'est Lyon. */}
          <p className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            <MapPin className="size-3.5" strokeWidth={2} aria-hidden="true" />
            Lyon, face à Fourvière
          </p>
        </Apparait>

        <Apparait delai={70}>
          <div className="flex items-center gap-3">
            {/* La pastille verte animée dit « disponible » sans phrase de plus. */}
            <Avatar size="md">
              <AvatarFallback className="bg-bleu-600 font-semibold text-white">RG</AvatarFallback>
              <AvatarBadge animate className="bg-emerald-500" aria-label="Disponible" />
            </Avatar>
            <p className="text-sm font-semibold tracking-wider text-bleu-600 uppercase dark:text-bleu-400">
              Qui est derrière
            </p>
          </div>

          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Pas une agence. Un développeur, à Lyon.
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Je m&apos;appelle Rafael. Je construis des sites et des automatisations pour
            des <ApercuClient
              nom="artisans"
              href="/realisations/atout-travaux"
              image="/realisations/atout-travaux.webp"
              legende="Atout Travaux — chauffage et ramonage à La Ciotat"
            />, des <ApercuClient
              nom="hébergeurs"
              href="/realisations/campagne-vallauris"
              image="/realisations/campagne-vallauris.webp"
              legende="Campagne Vallauris — chambres d'hôtes près de Sisteron"
            /> et des PME — et je les maintiens une fois en ligne. Vous avez affaire à moi
            du premier appel à la dernière mise à jour.
          </p>

          <Separator variant="gradient" className="mt-8" />

          <dl className="mt-8 space-y-5">
            {ENGAGEMENTS.map((engagement) => (
              <div key={engagement.titre} className="flex gap-4">
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-bleu-500"
                  aria-hidden="true"
                />
                <div>
                  <dt className="font-semibold">{engagement.titre}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                    {engagement.texte}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <Link
            href="/contact"
            className={cn(
              "group mt-9 inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6",
              "text-[15px] font-medium text-primary-foreground",
              "transition-[background-color,scale] duration-150 ease-out",
              "hover:bg-bleu-700 active:scale-96 dark:hover:bg-bleu-400",
            )}
          >
            Parlons de votre projet
            <ArrowRight
              className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Link>
        </Apparait>
      </div>
    </section>
  );
}

/**
 * Un mot du texte qui, au survol, montre le site du client (PreviewCard
 * d'Appica). « Des artisans » devient vérifiable sans quitter la page ; au
 * clic, on arrive sur la fiche du projet.
 */
function ApercuClient({
  nom,
  href,
  image,
  legende,
}: {
  nom: string;
  href: string;
  image: string;
  legende: string;
}) {
  return (
    <PreviewCard>
      <PreviewCardTrigger
        href={href}
        className="font-medium text-foreground underline decoration-bleu-400 decoration-dotted underline-offset-4 transition-colors duration-150 ease-out hover:text-bleu-700 hover:decoration-solid dark:hover:text-bleu-300"
      >
        {nom}
      </PreviewCardTrigger>
      <PreviewCardContent className="w-72 p-2">
        <div className="relative aspect-[16/10] overflow-hidden rounded-md outline outline-black/10">
          <Image src={image} alt="" fill sizes="288px" className="object-cover object-top" />
        </div>
        <p className="px-1 pt-2 pb-1 text-xs font-medium">{legende}</p>
      </PreviewCardContent>
    </PreviewCard>
  );
}
