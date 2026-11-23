import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "cn";

import { BandeauPaysage } from "@/components/rgm/bandeau";
import { Marqueur } from "@/components/rgm/blocs-service";
import { Icone } from "@/components/rgm/icones";
import { LIENS } from "@/components/rgm/liens";
import { LienFleche } from "@/components/rgm/primitives";
import { AppelAction } from "@/components/rgm/sections-accueil";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Tarifs — création de site web et automatisation IA",
  description:
    "Les prix affichés : site vitrine à partir de 1 500 €, site sur mesure, automatisation de processus, agents IA. Devis ferme sous 48 h.",
  chemin: "/tarifs",
});

type Ligne = string | { texte: string; logos: string[] };
type Offre = { nom: string; prix: string; delai: string; inclus: Ligne[]; recommande?: boolean };

const GROUPES: { debut: string; marqueur: string; lien: { libelle: string; href: string }; offres: Offre[] }[] = [
  {
    debut: "Sites",
    marqueur: "web",
    lien: { libelle: "Voir les sites web", href: LIENS.sitesWeb },
    offres: [
      { nom: "Site vitrine", prix: "1 500 – 3 000 €", delai: "2 à 3 semaines", inclus: ["Jusqu’à 8 pages", "Design sur mesure", "Référencement local", "Formulaire de devis"] },
      {
        nom: "Site sur mesure",
        prix: "3 500 – 9 000 €",
        delai: "4 à 8 semaines",
        recommande: true,
        inclus: ["Maquettes et cahier des charges", "Fonctionnalités métier", "Espace client ou back-office", "Connexion à vos outils"],
      },
      { nom: "Refonte", prix: "2 000 – 5 000 €", delai: "3 à 5 semaines", inclus: ["Audit technique et SEO", "Référencement conservé", "Mobile d’abord", "Vitesse mesurée avant / après"] },
    ],
  },
  {
    debut: "Automatisation",
    marqueur: "IA",
    lien: { libelle: "Voir l’automatisation IA", href: LIENS.automatisation },
    offres: [
      {
        nom: "Audit d’automatisation",
        prix: "600 – 900 €",
        delai: "1 semaine",
        inclus: ["Entretiens avec vos équipes", "Tâches répétitives repérées", "Plan chiffré et priorisé", "Déduit du projet"],
      },
      {
        nom: "Automatisation d’un processus",
        prix: "1 200 – 4 000 €",
        delai: "2 à 4 semaines",
        recommande: true,
        inclus: [
          { texte: "Workflow n8n ou agent IA", logos: ["/figma/logos/n8n.svg"] },
          "Connexion à vos outils",
          "Tableau de bord de suivi",
          "Un mois d’ajustements",
        ],
      },
      {
        nom: "Agent IA sur mesure",
        prix: "2 500 – 8 000 €",
        delai: "4 à 6 semaines",
        inclus: [
          "Branché sur vos données",
          "Validation humaine",
          { texte: "Telegram, WhatsApp ou mail", logos: ["/figma/logos/telegram.svg", "/figma/logos/whatsapp.svg"] },
          "Trois mois de suivi",
        ],
      },
    ],
  },
];

const DEGRADE_BOUTON = {
  backgroundImage:
    "url(/figma/images/texture-bouton.png), linear-gradient(166.1deg, #2244bb 8.1%, #2453cd 39.8%, #2460de 69.9%, #1d54d5 89.4%)",
  backgroundSize: "100px 100px, auto",
} as const;

function CarteOffre({ offre }: { offre: Offre }) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-start gap-5 rounded-[16px] bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        offre.recommande ? "border-2 border-primary" : "border border-border",
      )}
    >
      <div className="flex flex-col items-start">
        {offre.recommande ? (
          <span className="inline-flex h-[22px] items-center rounded-full bg-primary px-2 text-xs font-medium text-primary-foreground">Recommandé</span>
        ) : null}
        <h3 className="text-[18px] font-semibold">{offre.nom}</h3>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[32px] font-bold tracking-[-0.96px]">{offre.prix}</p>
        <p className="text-sm">{offre.delai}</p>
      </div>
      <ul className="flex flex-1 flex-col gap-2.5 pt-1">
        {offre.inclus.map((l) => {
          const texte = typeof l === "string" ? l : l.texte;
          return (
            <li key={texte} className="flex items-center gap-2 text-sm">
              <Icone nom="check" taille={16} />
              {typeof l !== "string"
                ? l.logos.map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={src} src={src} alt="" width={17} height={17} className="-mr-[3px] size-[17px]" />
                  ))
                : null}
              {texte}
            </li>
          );
        })}
      </ul>
      <Link
        href={`${LIENS.contact}?service=${encodeURIComponent(offre.nom)}`}
        className={cn(
          "inline-flex h-8 w-full items-center justify-center rounded-full text-sm font-medium",
          offre.recommande ? "text-[#fafafa]" : "border border-border bg-white",
        )}
        style={offre.recommande ? DEGRADE_BOUTON : undefined}
      >
        Demander un devis
      </Link>
    </div>
  );
}

export default function PageTarifs() {
  return (
    <>
      <BandeauPaysage paysage="chaine-alpine" decalage={-138} hauteur={350} hauteurMobile={290}>
        <h1 className="font-marqueur text-[56px] leading-[1.05] text-white md:text-[87px]">Tarifs</h1>
      </BandeauPaysage>

      {GROUPES.map((g) => (
        <section key={g.debut} className="mx-auto flex w-full max-w-[1416px] flex-col gap-8 px-4 pt-12 pb-6 md:px-[108px] md:pt-[72px]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[30px] font-bold tracking-[-1.2px] md:text-[40px]">
              {g.debut} <Marqueur taille={38}>{g.marqueur}</Marqueur>
            </h2>
            <LienFleche href={g.lien.href}>{g.lien.libelle}</LienFleche>
          </div>
          <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
            {g.offres.map((o) => (
              <CarteOffre key={o.nom} offre={o} />
            ))}
          </div>
        </section>
      ))}

      <div className="px-2 pt-14 md:px-3 md:pt-[100px]">
        <AppelAction />
      </div>
    </>
  );
}
