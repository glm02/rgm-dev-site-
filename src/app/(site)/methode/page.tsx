import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ClipboardList,
  Hammer,
  PhoneCall,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { FilAriane } from "@/components/commun/fil-ariane";
import { JsonLd } from "@/components/commun/json-ld";
import { AppelAction } from "@/components/sections/appel-action";
import { jsonLdFilAriane, metadonnees } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = metadonnees({
  titre: "La méthode — comment se déroule un projet",
  description:
    "Du premier appel à la mise en ligne : ce qu'on fait à chaque étape, ce que vous recevez, ce que j'attends de vous, et ce qui est vérifié avant de publier.",
  chemin: "/methode",
});

/**
 * La page qui répond à « et concrètement, ça se passe comment ? ».
 *
 * L'accueil en donne la version courte en quatre cartes ; ici on déplie. Elle
 * sert deux choses : rassurer quelqu'un qui n'a jamais fait développer de site,
 * et répondre dans Google aux recherches en « comment se passe la création
 * d'un site web ». D'où le détail — une page qui dit la même chose que
 * l'accueil en plus long n'aurait aucune raison d'exister.
 */

const ETAPES = [
  {
    ancre: "appel",
    numero: "01",
    titre: "L'appel de cadrage",
    delai: "30 minutes, gratuit",
    icone: PhoneCall,
    texte:
      "On regarde votre activité, vos clients, et surtout ce qui vous fait perdre du temps aujourd'hui. Je pose des questions bêtes exprès : comment un client vous trouve, ce qu'il demande en premier, qui répond, combien de fois par semaine. C'est là qu'on voit si le vrai problème est le site, ou la demi-journée passée chaque semaine à recopier des devis.",
    vous: "Raconter votre métier, sans préparer de cahier des charges.",
    moi: "Vous dire franchement si le projet est pour moi, et sinon vous orienter.",
  },
  {
    ancre: "devis",
    numero: "02",
    titre: "Le devis",
    delai: "sous 48 heures",
    icone: ClipboardList,
    texte:
      "Un document court : ce qui est fait, ce qui ne l'est pas, le prix ferme, le délai, et le calendrier de paiement. La liste de ce qui n'est pas inclus est aussi longue que l'autre — c'est elle qui évite les malentendus à la livraison.",
    vous: "Lire, poser vos questions, demander à retirer ou ajouter.",
    moi: "Chiffrer sans fourchette qui double, et tenir ce prix.",
  },
  {
    ancre: "conception",
    numero: "03",
    titre: "La conception",
    delai: "3 à 10 jours",
    icone: ShieldCheck,
    texte:
      "On décide de l'arborescence avant de dessiner quoi que ce soit : une page par chose que les gens cherchent. C'est à ce moment que se joue le référencement, pas après coup. Vous recevez ensuite une maquette de l'accueil et d'une page intérieure, à valider avant qu'une ligne de code soit écrite.",
    vous: "Valider la structure, puis la maquette. Rassembler vos textes et vos photos.",
    moi: "Proposer une structure qui tient debout pour Google comme pour vos clients.",
  },
  {
    ancre: "developpement",
    numero: "04",
    titre: "Le développement",
    delai: "2 à 8 semaines",
    icone: Hammer,
    texte:
      "Le site se construit sur une adresse privée que vous pouvez ouvrir à tout moment. Votre espace client affiche l'avancement, les étapes franchies et les documents. Une revue à chaque étape : on corrige au fil de l'eau plutôt que de tout découvrir à la fin.",
    vous: "Relire à chaque étape et dire ce qui ne va pas, tôt.",
    moi: "Vous montrer le travail en cours, pas seulement le résultat.",
  },
  {
    ancre: "mise-en-ligne",
    numero: "05",
    titre: "La mise en ligne",
    delai: "une demi-journée",
    icone: Rocket,
    texte:
      "Le jour J suit une liste de vérification, toujours la même. En cas de refonte, les anciennes adresses sont redirigées une par une : c'est ce qui évite de perdre le référencement acquis, et c'est l'erreur la plus fréquente d'une refonte bâclée.",
    vous: "Donner les accès au nom de domaine, et choisir le créneau.",
    moi: "Publier, vérifier, et rester joignable le jour même.",
  },
  {
    ancre: "apres",
    numero: "06",
    titre: "Après",
    delai: "30 jours puis au besoin",
    icone: CheckCircle2,
    texte:
      "Trente jours de corrections incluses, une formation d'une heure à votre back-office, et la supervision qui tourne : si le site tombe ou ralentit, je suis prévenu avant vous. Les évolutions se chiffrent ensuite au cas par cas, sans abonnement obligatoire.",
    vous: "Faire tourner votre entreprise.",
    moi: "Surveiller, corriger, et répondre sous 24 heures ouvrées.",
  },
];

const VERIFICATIONS = [
  "Le site s'affiche correctement sur téléphone, tablette et ordinateur.",
  "Chaque page a son titre, sa description et son adresse propre.",
  "Les images sont compressées et chargées au bon moment.",
  "Le formulaire arrive bien dans votre boîte mail, testé en conditions réelles.",
  "Les anciennes adresses redirigent vers les nouvelles, une par une.",
  "Le site est navigable au clavier et lisible par un lecteur d'écran.",
  "Mentions légales, politique de confidentialité et bandeau cookies en place.",
  "La fiche Google de l'entreprise pointe vers les bonnes pages.",
  "La sauvegarde et la surveillance tournent avant de vous rendre la main.",
];

const LIVRABLES = [
  {
    titre: "Le site en ligne",
    texte: "Sur votre nom de domaine, votre hébergement, votre compte.",
  },
  {
    titre: "Le code source",
    texte: "Dans un dépôt à votre nom, avec son historique complet.",
  },
  {
    titre: "Un back-office",
    texte: "Pour changer les textes, les photos et les tarifs sans m'appeler.",
  },
  {
    titre: "Une documentation",
    texte: "Comment c'est fait, comment le relancer, à qui appartient quoi.",
  },
];

export default function PageMethode() {
  const etapes = [
    { nom: "Accueil", href: "/" },
    { nom: "La méthode", href: "/methode" },
  ];

  return (
    <>
      <JsonLd donnees={jsonLdFilAriane(etapes)} />
      <JsonLd
        donnees={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Comment se déroule un projet web avec RGM Dev",
          description:
            "Les six étapes d'un projet de site web ou d'automatisation, du premier appel au suivi après mise en ligne.",
          totalTime: "P8W",
          step: ETAPES.map((etape, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: etape.titre,
            text: etape.texte,
            url: `${SITE.url}/methode#${etape.ancre}`,
          })),
        }}
      />

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="halo-bleu pointer-events-none absolute inset-x-0 top-0 h-96"
        />
        <div className="conteneur relative pt-8 pb-14">
          <FilAriane etapes={etapes} />
          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-semibold tracking-wider text-bleu-600 uppercase dark:text-bleu-400">
              La méthode
            </p>
            <h1 className="mt-3 text-4xl font-semibold text-balance sm:text-5xl">
              Comment se déroule un projet, étape par étape
            </h1>
            <p className="mt-5 text-xl leading-relaxed text-balance text-muted-foreground">
              Si vous n&apos;avez jamais fait développer de site, c&apos;est la page à lire. Elle dit
              ce qui se passe à chaque étape, ce que vous recevez, et ce que j&apos;attends de vous —
              parce qu&apos;un projet qui traîne traîne presque toujours faute de contenus.
            </p>
          </div>
        </div>
      </section>

      <section className="conteneur pb-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)]">
          {/* Le sommaire reste visible pendant la lecture : la page est longue,
              et on y revient souvent pour une étape précise. */}
          <nav aria-label="Sommaire" className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-semibold tracking-wider uppercase">Les étapes</p>
            <ol className="mt-4 space-y-2.5">
              {ETAPES.map((etape) => (
                <li key={etape.ancre}>
                  <a
                    href={`#${etape.ancre}`}
                    className="flex gap-2.5 text-sm text-muted-foreground underline-offset-4 transition-colors duration-150 ease-out hover:text-foreground hover:underline"
                  >
                    <span className="tabular-nums">{etape.numero}</span>
                    {etape.titre}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <ol className="space-y-14">
            {ETAPES.map((etape, index) => (
              <Apparait key={etape.ancre} as="li" delai={index * 40} id={etape.ancre}>
                {/* `scroll-mt` : sans lui, l'entête collante recouvre le titre
                    quand on arrive depuis le sommaire. */}
                <div className="scroll-mt-28">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-bleu-50 text-bleu-700 dark:bg-bleu-950 dark:text-bleu-300">
                      <etape.icone className="size-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-bleu-700 tabular-nums dark:text-bleu-300">
                      {etape.numero}
                    </span>
                    <span className="ml-auto text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {etape.delai}
                    </span>
                  </div>

                  <h2 className="mt-5 text-2xl font-semibold sm:text-3xl">{etape.titre}</h2>
                  <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
                    {etape.texte}
                  </p>

                  <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
                    <div className="bg-card p-5">
                      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        Votre part
                      </dt>
                      <dd className="mt-2 text-sm leading-relaxed">{etape.vous}</dd>
                    </div>
                    <div className="bg-card p-5">
                      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        La mienne
                      </dt>
                      <dd className="mt-2 text-sm leading-relaxed">{etape.moi}</dd>
                    </div>
                  </dl>
                </div>
              </Apparait>
            ))}
          </ol>
        </div>
      </section>

      <section className="conteneur py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <Apparait>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Ce qui est vérifié avant de publier
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              La même liste pour tous les projets. Elle n&apos;a rien d&apos;impressionnant, mais
              c&apos;est l&apos;oubli d&apos;un de ces points qui fait qu&apos;un site « refait à
              neuf » perd la moitié de ses visiteurs.
            </p>
            <ul className="mt-6 space-y-3">
              {VERIFICATIONS.map((verification) => (
                <li key={verification} className="flex gap-3 text-sm leading-relaxed">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-bleu-600 dark:text-bleu-400"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {verification}
                </li>
              ))}
            </ul>
          </Apparait>

          <Apparait delai={80}>
            <h2 className="text-2xl font-semibold sm:text-3xl">Ce que vous avez à la fin</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Un projet livré, c&apos;est un projet dont vous pouvez partir. Tout ce qui suit est à
              votre nom, dès le premier jour.
            </p>
            <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
              {LIVRABLES.map((livrable) => (
                <div key={livrable.titre} className="bg-card p-5">
                  <dt className="font-medium">{livrable.titre}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {livrable.texte}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 leading-relaxed">
              <Link
                href="/tarifs"
                className={cn(
                  "font-medium text-bleu-700 underline-offset-4 hover:underline dark:text-bleu-300",
                )}
              >
                Voir les tarifs
              </Link>{" "}
              ou{" "}
              <Link
                href="/realisations"
                className="font-medium text-bleu-700 underline-offset-4 hover:underline dark:text-bleu-300"
              >
                les réalisations
              </Link>{" "}
              pour voir cette méthode appliquée.
            </p>
          </Apparait>
        </div>
      </section>

      <AppelAction />
    </>
  );
}
