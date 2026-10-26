import { BorderBeam } from "@appica/ui-react/border-beam";
import { Badge } from "@appica/ui-react/badge";
import { Button } from "@appica/ui-react/button";
import type { Metadata } from "next";
import { ArrowDown, ArrowRight, KeyRound, ShieldCheck, UserCheck } from "lucide-react";
import { siGithub, siGooglecalendar, siGooglecloud, siGmail, siGooglesearchconsole, siTelegram } from "simple-icons";

import { Apparait } from "@/components/commun/apparait";
import { FilAriane } from "@/components/commun/fil-ariane";
import { JsonLd } from "@/components/commun/json-ld";
import { Surligne } from "@/components/commun/surligne";
import { TexteAnime } from "@/components/commun/texte-anime";
import { TitreSection } from "@/components/commun/titre-section";
import { AppelAction } from "@/components/sections/appel-action";
import { CatalogueSkills } from "@/components/stack/catalogue-skills";
import { OrbiteStack } from "@/components/stack/orbite-stack";
import { SchemaHermes } from "@/components/stack/schema-hermes";
import { TuileLogo } from "@/components/stack/tuile-logo";
import { jsonLdFilAriane, metadonnees } from "@/lib/seo";
import {
  CATEGORIES_STACK,
  CHIFFRES,
  DEPOT_SKILLS,
  ETAPES_AGENTS,
  HERMES,
  ORBITE_EXTERIEURE,
  ORBITE_INTERIEURE,
  REGLES,
  SCHEMA_HERMES,
  SKILLS,
  TELEGRAM,
} from "@/lib/stack";
import { cn } from "@/lib/utils";

export const metadata: Metadata = metadonnees({
  titre: "Ma stack — agents IA, skills et outils",
  description:
    "Comment je fais travailler des agents IA sans perdre la main : 39 skills Claude Code, des agents Hermes en production, Google Cloud, bots Telegram, et toute la stack React.",
  chemin: "/stack",
});

/**
 * La page qui répond à « et concrètement, tu travailles comment avec l'IA ? ».
 *
 * Elle s'adresse à une entreprise qui veut juger la méthode avant de confier
 * un projet : d'abord les règles, puis le parcours d'une demande comme un
 * tuto, puis la preuve — les agents en production, les outils réels et les
 * skills publiées. Chaque section dit une seule chose ; les détails sont dans
 * le dépôt, à un clic.
 */

const ICONES_REGLES = [ShieldCheck, KeyRound, UserCheck];

const GOOGLE_ETAPES = [
  "Un projet dans la Google Cloud Console, avec les seules API utiles activées.",
  "Un écran de consentement OAuth et un identifiant client dédié au service.",
  "Le client autorise en trente secondes depuis son téléphone ; les jetons restent côté serveur.",
  "L'agent lit et écrit dans l'agenda par un pont MCP, jamais avec un mot de passe.",
];

function IconeMarque({ chemin, className }: { chemin: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("fill-current", className)}>
      <path d={chemin} />
    </svg>
  );
}

export default function PageStack() {
  const etapes = [
    { nom: "Accueil", href: "/" },
    { nom: "Ma stack", href: "/stack" },
  ];
  const nombreOutils = new Set(CATEGORIES_STACK.flatMap((c) => c.outils.map((o) => o.nom))).size;

  return (
    <>
      <JsonLd donnees={jsonLdFilAriane(etapes)} />

      {/* ---------- En-tête ---------- */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="halo-bleu pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px]" />
        <div className="conteneur relative pt-8 pb-16 sm:pb-24">
          <FilAriane etapes={etapes} />

          <div className="mt-10 grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            <div className="text-center lg:text-left">
              <BorderBeam color="var(--bleu-500)" length={22} thickness={1.5} speed={7} className="inline-flex rounded-full">
                <Badge
                  variant="outline"
                  size="lg"
                  className="gap-2.5 rounded-full bg-background/70 pr-4 pl-3 font-medium text-foreground backdrop-blur-md"
                >
                  <span className="relative grid size-2 place-items-center" aria-hidden="true">
                    <span className="absolute size-2 animate-ping-paced rounded-full bg-bleu-500" />
                    <span className="size-2 rounded-full bg-bleu-500" />
                  </span>
                  Stack et méthode
                </Badge>
              </BorderBeam>

              <h1 className="mt-7 text-[2.1rem] leading-[1.06] font-semibold tracking-[-0.03em] text-balance sm:text-5xl sm:leading-[1.04] lg:text-[3.4rem]">
                Des agents IA qui livrent, <Surligne delai={0.15}>un humain qui garde la main</Surligne>.
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-balance text-muted-foreground sm:text-xl lg:mx-0">
                <TexteAnime effet="highlight" by="word" duree={1.2} delai={0.3}>
                  {`Les outils, les règles et les ${SKILLS.length} skills qui me permettent de faire travailler Claude, Codex et Hermes sur de vrais projets — et de le prouver.`}
                </TexteAnime>
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button
                  variant="primary"
                  size="lg"
                  nativeButton={false}
                  render={<a href="#parcours" />}
                  className="h-13 w-full rounded-2xl px-7 text-[15px] shadow-[0_1px_2px_oklch(0_0_0/0.10),0_14px_40px_-16px_var(--bleu-600)] sm:w-auto"
                >
                  Voir comment je travaille
                  <ArrowDown data-icon="end" aria-hidden="true" />
                </Button>
                <Button
                  variant="soft"
                  size="lg"
                  nativeButton={false}
                  render={<a href={DEPOT_SKILLS} target="_blank" rel="noreferrer" />}
                  className="h-13 w-full rounded-2xl px-7 text-[15px] sm:w-auto"
                >
                  <IconeMarque chemin={siGithub.path} className="size-4" />
                  Les skills sur GitHub
                </Button>
              </div>
            </div>

            <OrbiteStack interieure={ORBITE_INTERIEURE} exterieure={ORBITE_EXTERIEURE} />
          </div>

          <dl className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 sm:grid-cols-4">
            {[...CHIFFRES, { valeur: String(nombreOutils), libelle: "outils utilisés en production" }].map((chiffre, index) => (
              <div key={chiffre.libelle} className="bg-background px-5 py-5 text-center">
                <dt className="text-3xl font-semibold tracking-tight text-bleu-700 tabular-nums dark:text-bleu-300">
                  <TexteAnime effet="scramble" duree={0.9} delai={0.4 + index * 0.12}>
                    {chiffre.valeur}
                  </TexteAnime>
                </dt>
                <dd className="mt-1 text-sm leading-snug text-balance text-muted-foreground">{chiffre.libelle}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Les trois règles ---------- */}
      <section className="conteneur py-16 sm:py-20">
        <TitreSection
          surtitre="Le principe"
          titre="Trois règles, sur chaque projet"
          sousTitre="Un agent IA est rapide. Il devient fiable quand il sait ce qu'il doit prouver et où il doit s'arrêter."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {REGLES.map((regle, index) => {
            const Icone = ICONES_REGLES[index];
            return (
              <Apparait key={regle.titre} as="li" delai={index * 70}>
                <div className="h-full rounded-3xl border border-border/70 bg-background p-7">
                  <span className="grid size-11 place-items-center rounded-2xl bg-bleu-50 text-bleu-700 dark:bg-bleu-950 dark:text-bleu-300">
                    <Icone className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold">{regle.titre}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{regle.texte}</p>
                </div>
              </Apparait>
            );
          })}
        </ul>
      </section>

      {/* ---------- Le tuto : le parcours d'une demande ---------- */}
      <section id="parcours" className="conteneur scroll-mt-24 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <TitreSection
              centre={false}
              surtitre="Le parcours"
              titre="D'une demande à la production, en six étapes"
              sousTitre="Ce qui se passe réellement quand je confie un chantier à des agents, et ce que je vérifie entre chaque étape."
            />
          </div>

          <ol className="relative space-y-5">
            {/* Le fil qui relie les étapes : on lit un parcours, pas une liste. */}
            <span aria-hidden="true" className="absolute top-8 bottom-8 left-[21.5px] w-px sm:left-[27.5px] bg-gradient-to-b from-bleu-300 via-bleu-200 to-transparent dark:from-bleu-700 dark:via-bleu-900" />
            {ETAPES_AGENTS.map((etape, index) => (
              <Apparait key={etape.numero} as="li" delai={index * 40}>
                <div className="relative flex gap-3 sm:gap-5">
                  <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-2xl border border-bleu-200 bg-background text-base sm:size-14 sm:text-lg font-semibold text-bleu-700 tabular-nums shadow-sm dark:border-bleu-800 dark:text-bleu-300">
                    {etape.numero}
                  </span>
                  <div className="min-w-0 flex-1 rounded-3xl border border-border/70 bg-background p-5 sm:p-6 transition-[border-color,box-shadow] duration-200 ease-out hover:border-bleu-200 hover:shadow-[0_18px_50px_-28px_var(--bleu-600)] dark:hover:border-bleu-800">
                    <h3 className="text-xl font-semibold">{etape.titre}</h3>
                    <p className="mt-2.5 leading-relaxed text-muted-foreground">{etape.texte}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {etape.outils.map((outil) => (
                        <li
                          key={outil.nom}
                          title={outil.usage}
                          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/40 py-1 pr-3.5 pl-1"
                        >
                          <TuileLogo outil={outil} className="size-7 text-[11px] shadow-none" tailleIcone="size-3.5" />
                          <span className="text-sm font-medium">{outil.nom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Apparait>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Hermes en production ---------- */}
      <section className="conteneur-large py-16 sm:py-20">
        <div className="overflow-hidden rounded-[2rem] border border-bleu-100 bg-gradient-to-b from-bleu-50/80 to-background px-5 py-14 sm:px-10 sm:py-20 dark:border-bleu-900 dark:from-bleu-950/40">
          <TitreSection
            surtitre="En production"
            titre="Hermes Agent, chez le client"
            sousTitre="Des agents qui travaillent tous les jours pour une entreprise : ils reçoivent les demandes là où elles arrivent et agissent dans les outils de l'équipe."
          />
          <Apparait className="mt-12">
            <SchemaHermes entrees={SCHEMA_HERMES.entrees} sorties={SCHEMA_HERMES.sorties} />
          </Apparait>
          <ul className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2">
            {HERMES.map((point, index) => (
              <Apparait key={point.titre} as="li" delai={index * 60}>
                <div className="h-full rounded-3xl border border-border/70 bg-background/90 p-6 backdrop-blur">
                  <h3 className="text-lg font-semibold">{point.titre}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{point.texte}</p>
                </div>
              </Apparait>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Google Cloud et Telegram ---------- */}
      <section className="conteneur py-16 sm:py-20">
        <TitreSection
          surtitre="Intégrations"
          titre="Branché sur les outils de l'équipe"
          sousTitre="Les agents vont là où l'entreprise travaille déjà, par les API officielles."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Apparait>
            <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-background p-7 sm:p-8">
              <div className="flex items-center gap-3">
                {[siGooglecloud, siGooglecalendar, siGmail, siGooglesearchconsole].map((icone) => (
                  <TuileLogo key={icone.slug} outil={{ nom: icone.title, icone, usage: "" }} className="size-11" />
                ))}
              </div>
              <h3 className="mt-6 text-2xl font-semibold">Google Cloud Console et API</h3>
              <ol className="mt-5 space-y-3.5">
                {GOOGLE_ETAPES.map((texte, index) => (
                  <li key={texte} className="flex gap-3.5">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-bleu-600 text-xs font-semibold text-white tabular-nums">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{texte}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                Search Console sert aussi au référencement : les campagnes SEO se pilotent sur les vraies requêtes, pas sur des estimations.
              </p>
            </div>
          </Apparait>

          <Apparait delai={80}>
            <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-background p-7 sm:p-8">
              <TuileLogo outil={{ nom: "Telegram", icone: siTelegram, usage: "" }} className="size-11" />
              <h3 className="mt-6 text-2xl font-semibold">Bots Telegram</h3>
              <ul className="mt-5 space-y-5">
                {TELEGRAM.map((point) => (
                  <li key={point.titre}>
                    <p className="font-semibold">{point.titre}</p>
                    <p className="mt-1 leading-relaxed text-muted-foreground">{point.texte}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Apparait>
        </div>
      </section>

      {/* ---------- Toute la stack ---------- */}
      <section className="conteneur py-16 sm:py-20">
        <TitreSection
          surtitre="La stack"
          titre={`${nombreOutils} outils, chacun à sa place`}
          sousTitre="Rien ici n'est décoratif : chaque outil tourne dans un projet livré ou dans une skill écrite."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {CATEGORIES_STACK.map((categorie, index) => (
            <Apparait key={categorie.titre} delai={(index % 2) * 70}>
              <div className="h-full rounded-3xl border border-border/70 bg-background p-6 sm:p-7">
                <h3 className="text-xl font-semibold">{categorie.titre}</h3>
                <p className="mt-1.5 text-muted-foreground">{categorie.texte}</p>
                <ul className="mt-6 grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
                  {categorie.outils.map((outil) => (
                    <li key={outil.nom} className="flex items-center gap-3">
                      <TuileLogo outil={outil} className="size-10 text-sm" />
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold leading-tight">{outil.nom}</span>
                        <span className="block text-[13px] leading-snug text-muted-foreground">{outil.usage}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Apparait>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
          Les logos désignent les outils réellement employés ; ils restent la propriété de leurs détenteurs et ne valent pas partenariat.
        </p>
      </section>

      {/* ---------- Les skills ---------- */}
      <section id="skills" className="conteneur scroll-mt-24 py-16 sm:py-20">
        <TitreSection
          surtitre="Les skills"
          titre={`${SKILLS.length} procédures écrites pour mes agents`}
          sousTitre="Chaque fois qu'un problème a coûté du temps, la leçon finit dans une skill. Les agents les chargent d'eux-mêmes quand la tâche s'y prête."
        />
        <div className="mt-10">
          <CatalogueSkills skills={SKILLS} depot={DEPOT_SKILLS} />
        </div>
        <div className="mt-10 flex justify-center">
          <a
            href={DEPOT_SKILLS}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-[border-color,background-color] duration-150 ease-out hover:border-bleu-300 hover:bg-bleu-50 dark:hover:bg-bleu-950/50"
          >
            <IconeMarque chemin={siGithub.path} className="size-4" />
            Tout le code sur GitHub
            <ArrowRight className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </section>

      <AppelAction
        titre="Une équipe à outiller avec des agents IA ?"
        texte="On regarde ensemble les tâches qui vous prennent le plus de temps, et ce qu'un agent peut en reprendre — avec les mêmes règles que sur cette page."
      />
    </>
  );
}
