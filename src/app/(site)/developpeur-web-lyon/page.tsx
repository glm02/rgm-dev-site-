import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { JsonLd } from "@/components/commun/json-ld";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BandeauPaysage, BoutonDegrade, TitreHero } from "@/components/rgm/bandeau";
import { CARTE_PLATE, ColonnePage, LOGOS_CLIENTS, Marqueur } from "@/components/rgm/blocs-service";
import { Icone, type NomIcone } from "@/components/rgm/icones";
import { LIENS } from "@/components/rgm/liens";
import { LienFleche, TuileIcone } from "@/components/rgm/primitives";
import { BadgeSecondaire } from "@/components/rgm/sections-accueil";
import { listerProjets } from "@/lib/donnees";
import { jsonLdFaq, jsonLdFilAriane, metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Développeur web freelance à Lyon — sites et IA",
  description:
    "Développeur freelance à Lyon : création de sites web, refonte, e-commerce et automatisation IA. Prix affichés, devis sous 48 h, rendez-vous dans la métropole.",
  chemin: "/developpeur-web-lyon",
});

export const revalidate = 300;

const ARGUMENTS: { icone: NomIcone; titre: string; texte: string; google?: boolean }[] = [
  { icone: "location", titre: "Rendez-vous sur place", texte: "À Lyon et jusqu’à 80 km. Au-delà, en visio." },
  { icone: "search", titre: "Référencement local", texte: "Pages par métier et zone, fiche Google et avis structurés.", google: true },
  { icone: "wallet", titre: "Prix affichés", texte: "Fourchettes et forfaits visibles avant le premier appel." },
  { icone: "chat", titre: "Un seul interlocuteur", texte: "Vous échangez avec votre développeur." },
];

const SECTEURS: Record<string, string> = {
  "atout-travaux": "Artisanat du bâtiment",
  "campagne-vallauris": "Hébergement touristique",
  "liccia-immo": "Immobilier",
};

const RESUMES: Record<string, string> = {
  "atout-travaux": "Site, demandes de devis et agents IA pour un artisan à La Ciotat.",
  "campagne-vallauris": "Site et réservation en direct pour des chambres d’hôtes et un gîte.",
  "liccia-immo": "Refonte du site et espace admin pour une agence immobilière.",
};

const QUESTIONS = [
  { question: "Combien coûte un site web à Lyon ?", reponse: "Vitrine : 1 500 à 3 000 €. Sur mesure : 3 500 à 9 000 €. Refonte : 2 000 à 5 000 €." },
  { question: "Intervenez-vous hors de Lyon ?", reponse: "Sur place jusqu’à 80 km de Lyon. Au-delà, en visio." },
  { question: "Quand mon site peut-il être en ligne ?", reponse: "Vitrine : 2 à 3 semaines. Sur mesure : 4 à 8 semaines." },
  { question: "Que peut-on automatiser ?", reponse: "Relances, tri des e-mails, saisie et reporting." },
  { question: "Le site m’appartient-il ?", reponse: "Le code, le domaine, l’hébergement et les comptes sont à votre nom." },
];

const euros = (n: number) => n.toLocaleString("fr-FR").replace(/ /g, " ");

export default async function PageLyon() {
  const projets = (await listerProjets()).filter((p) => p.slug in SECTEURS).slice(0, 3);

  return (
    <>
      <JsonLd donnees={jsonLdFaq(QUESTIONS)} />
      <JsonLd
        donnees={jsonLdFilAriane([
          { nom: "Accueil", href: "/" },
          { nom: "Développeur web à Lyon", href: LIENS.lyon },
        ])}
      />

      <BandeauPaysage paysage="sommet-enneige" decalage={-121} hauteur={378} hauteurMobile={336}>
        <TitreHero debut="Développeur web à" marqueur="Lyon" sousTitre="Sites web et agents IA." taille={73} tailleMarqueur={66}>
          <BoutonDegrade href={LIENS.contact} className="gap-1">
            Demander un devis gratuit
            <Icone nom="fleche-droite" taille={16} />
          </BoutonDegrade>
        </TitreHero>
      </BandeauPaysage>

      <ColonnePage>
        <section className="grid gap-4 md:grid-cols-2 md:gap-5">
          {ARGUMENTS.map((a) => (
            <div key={a.titre} className={`${CARTE_PLATE} flex flex-col gap-2.5 p-[26px]`}>
              <div className="flex items-center gap-2.5">
                <TuileIcone nom={a.icone} />
                <h2 className="text-[20px] leading-[1.4] font-bold">{a.titre}</h2>
              </div>
              <p className="flex items-center gap-[5px] text-base leading-[1.4]">
                {a.google ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/figma/logos/google.svg" alt="" width={15} height={15} className="shrink-0" />
                ) : null}
                {a.texte}
              </p>
            </div>
          ))}
        </section>

        <section className="flex flex-col items-start gap-6">
          <h2 className="text-[30px] leading-[1.12] font-bold md:text-[36px]">
            Des projets <Marqueur taille={34}>réels</Marqueur>
          </h2>
          <p className="text-base leading-[1.4]">Des réalisations et leur budget quand il est disponible.</p>
          <div className="flex w-full flex-col gap-5 md:flex-row md:items-start">
            {projets.map((p) => {
              const logo = LOGOS_CLIENTS[p.slug];
              return (
                <Link
                  key={p.id}
                  href={`${LIENS.realisations}/${p.slug}`}
                  className={`${CARTE_PLATE} flex flex-1 flex-col items-start gap-3 p-5`}
                >
                  <div className="relative h-[188px] w-full overflow-hidden rounded-[12px] bg-muted">
                    {p.image_couverture ? (
                      <Image
                        src={p.image_couverture}
                        alt={`Capture du site ${p.titre}`}
                        fill
                        sizes="(min-width: 768px) 360px, 100vw"
                        className="object-cover object-top"
                      />
                    ) : null}
                  </div>
                  <BadgeSecondaire>{SECTEURS[p.slug]}</BadgeSecondaire>
                  <div className="flex items-center gap-[5px]">
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo.src} alt="" width={logo.largeur} height={17} className="h-[17px] object-contain" style={{ width: logo.largeur }} />
                    ) : null}
                    <span className="text-[21px] leading-[1.4] font-bold">{p.titre}</span>
                  </div>
                  <p className="text-sm leading-[1.4]">{RESUMES[p.slug]}</p>
                  {p.prix_min && p.prix_max ? (
                    <p className="text-base leading-[1.4] font-semibold">
                      {euros(p.prix_min)} – {euros(p.prix_max)} €
                    </p>
                  ) : null}
                </Link>
              );
            })}
          </div>
          <LienFleche href={LIENS.realisations}>Voir les réalisations</LienFleche>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-[30px] leading-[1.12] font-bold md:text-[36px]">Questions fréquentes</h2>
          <Accordion multiple defaultValue={QUESTIONS.map((_, i) => String(i))} className="w-full md:max-w-[590px]">
            {QUESTIONS.map((q, i) => (
              <AccordionItem key={q.question} value={String(i)}>
                <AccordionTrigger>{q.question}</AccordionTrigger>
                <AccordionContent>{q.reponse}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-[16px] border border-border bg-muted p-6">
          <h2 className="text-[28px] leading-[1.12] font-bold md:text-[34px]">
            Parlons de votre <Marqueur>projet</Marqueur>
          </h2>
          <p className="text-base leading-[1.4]">Décrivez votre projet web ou les tâches que vous voulez automatiser.</p>
          <BoutonDegrade href={LIENS.contact} className="gap-1">
            Demander un devis gratuit
            <Icone nom="fleche-droite" taille={16} />
          </BoutonDegrade>
        </section>
      </ColonnePage>
    </>
  );
}
