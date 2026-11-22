import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";
import { Icone, type NomIcone } from "./icones";
import { BoutonPilule, CARTE, LienFleche, Logo, Section, TitreMarqueur, TuileIcone } from "./primitives";
import { LIENS } from "./liens";
import type { Projet } from "@/lib/types";

const L = (f: string) => `/figma/logos/${f}`;

export function HeroAccueil() {
  return (
    <div className="flex flex-1 flex-col items-center justify-between gap-16 pt-20 text-center text-white md:gap-[200px] md:pt-[113px]">
      <h1 className="font-titre text-[38px] leading-[1.04] font-bold tracking-[-1.52px] md:text-[128px] md:tracking-[-5.12px]">
        Automatisation et
        <br />
        <span className="font-marqueur text-[48px] font-normal tracking-normal md:text-[120px]">agents IA</span>
      </h1>
      <div className="flex w-full flex-col gap-2.5 pt-2 md:w-auto md:flex-row md:gap-3">
        <BoutonPilule href={LIENS.contact} style="noir" fleche className="w-full md:w-auto">
          Demander un devis gratuit
        </BoutonPilule>
        <BoutonPilule href={LIENS.realisations} style="blanc" className="w-full md:w-auto">
          Voir les réalisations
        </BoutonPilule>
      </div>
    </div>
  );
}

export function Preuves({ nbProjets }: { nbProjets: number }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-7 text-sm text-foreground md:flex-row md:justify-center md:gap-10">
      <span className="flex items-center gap-2">
        <Icone nom="tick-square" taille={16} />
        {nbProjets} projets clients en ligne
      </span>
      <span className="flex items-center gap-2">
        <Icone nom="wallet" taille={16} />
        Tarifs affichés publiquement
      </span>
      <span className="flex items-center gap-1.5">
        Agents
        <Logo src={L("hermes.png")} taille={20} rond="cercle" />
        <strong className="font-semibold">Hermes</strong>
        et
        <Logo src={L("openbot.png")} taille={20} rond="carre" />
        <strong className="font-semibold">OpenBot</strong>
      </span>
    </div>
  );
}

function CarteMetier({
  icone,
  titre,
  marqueur,
  texte,
  logos,
  lien,
  libelleLien,
  accent,
}: {
  icone: NomIcone;
  titre: string;
  marqueur: string;
  texte: string;
  logos: { src: string; rond?: "cercle" | "carre" }[];
  lien: string;
  libelleLien: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-start gap-[18px] rounded-[16px] border p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-8",
        accent ? "border-[#1a1a1a] bg-[rgba(64,92,229,0.045)]" : "border-border bg-white",
      )}
    >
      <TuileIcone nom={icone} />
      <div className="flex flex-col gap-1.5 text-foreground">
        <TitreMarqueur niveau="h3" taille="carte" debut={titre} marqueur={marqueur} />
        <p className="text-base">{texte}</p>
      </div>
      <div className="flex items-center gap-4 pt-2">
        {logos.map((l) => (
          <Logo key={l.src} src={l.src} taille={24} rond={l.rond} />
        ))}
      </div>
      <LienFleche href={lien}>{libelleLien}</LienFleche>
    </div>
  );
}

export function CeQueJeFais() {
  return (
    <Section nom="Ce que je fais" className="flex flex-col gap-6 md:gap-10">
      <TitreMarqueur debut="Ce que" marqueur="je fais" />
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <CarteMetier
          icone="discovery"
          titre="Sites"
          marqueur="web"
          texte="Vitrine, e-commerce, refonte."
          logos={[{ src: L("nextjs.svg") }, { src: L("tailwind.svg") }, { src: L("supabase.svg") }, { src: L("vercel.svg") }]}
          lien={LIENS.sitesWeb}
          libelleLien="Découvrir les sites web"
        />
        <CarteMetier
          icone="workflow"
          titre="Automatisation"
          marqueur="IA"
          texte="Agents et workflows sur mesure."
          logos={[{ src: L("hermes.png"), rond: "cercle" }, { src: L("openbot.png"), rond: "carre" }, { src: L("n8n.svg") }, { src: L("anthropic.svg") }]}
          lien={LIENS.automatisation}
          libelleLien="Découvrir l’automatisation"
          accent
        />
      </div>
    </Section>
  );
}

const LIGNES_COMPARATIF = [
  { texte: "Répond à vos questions", classique: true },
  { texte: "Connaît vos documents et vos clients", classique: false },
  { texte: "Agit dans vos outils : mail, agenda, CRM", classique: false },
  { texte: "Travaille seul, même la nuit", classique: false },
] as const;

const OUTILS_IA = [
  { logo: L("hermes.png"), rond: "cercle" as const, nom: "Hermes", texte: "Prépare devis, plannings et relances." },
  { logo: L("openbot.png"), rond: "carre" as const, nom: "OpenBot", texte: "Pilote plusieurs agents avec les mêmes compétences." },
  { logo: L("n8n.svg"), nom: "n8n", texte: "Relie vos outils et lance les tâches tout seul." },
  { logo: L("claude.svg"), nom: "Claude", texte: "Le modèle qui lit, rédige et raisonne." },
];

function Coche({ oui }: { oui: boolean }) {
  return oui ? (
    <Icone nom="check" taille={18} className="text-primary" />
  ) : (
    <Icone nom="minus" taille={18} className="text-[#788294]" />
  );
}

export function PlusQuunChatbot() {
  const colonne = "flex w-16 shrink-0 items-center justify-center gap-1.5 md:w-[200px]";
  return (
    <Section nom="Plus qu’un chatbot" className="flex flex-col gap-6 md:gap-10">
      <TitreMarqueur debut="Plus qu’un" marqueur="chatbot" />
      <div className={cn(CARTE, "overflow-hidden")}>
        <div className="flex items-center gap-2 bg-muted px-3.5 py-3 md:px-6 md:py-4">
          <span className="flex-1" />
          <span className={colonne}>
            <Logo src={L("openai.svg")} taille={18} />
            <span className="hidden text-sm font-semibold md:inline">LLM classique</span>
          </span>
          <span className={colonne}>
            <Logo src={L("hermes.png")} taille={18} rond="cercle" />
            <Logo src={L("openbot.png")} taille={18} rond="carre" />
            <span className="hidden text-sm font-semibold md:inline">Mes agents</span>
          </span>
        </div>
        {LIGNES_COMPARATIF.map((l) => (
          <div key={l.texte} className="flex items-center gap-2 border-t border-border px-3.5 py-3 md:px-6 md:py-4">
            <span className="flex-1 text-sm md:text-base">{l.texte}</span>
            <span className={colonne}>
              <Coche oui={l.classique} />
            </span>
            <span className={colonne}>
              <Coche oui />
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 border-t border-border px-3.5 py-3 md:px-6 md:py-4">
          <span className="flex flex-1 items-center gap-2">
            <span className="flex items-center gap-[5px] text-[11px] font-medium">
              <Logo src={L("telegram.svg")} taille={13} />
              Telegram
            </span>
            <span className="flex items-center gap-[5px] text-[11px] font-medium">
              <Logo src={L("whatsapp.svg")} taille={13} />
              WhatsApp
            </span>
          </span>
          <span className={colonne}>
            <Coche oui={false} />
          </span>
          <span className={colonne}>
            <Coche oui />
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        {OUTILS_IA.map((o) => (
          <div key={o.nom} className="flex flex-1 flex-col gap-3 rounded-[16px] border border-border p-5">
            <div className="flex items-center gap-2.5">
              <Logo src={o.logo} taille={28} rond={o.rond} />
              <span className="text-base font-semibold">{o.nom}</span>
            </div>
            <p className="text-sm">{o.texte}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

const OUTILS = ["github", "cloudflare", "docker", "ubuntu", "nginx", "upstash", "telegram", "resend", "stripe", "figma"];

export function BandeOutils() {
  return (
    <div className="mx-auto w-full max-w-[1416px] border-y border-border px-4 py-8 md:px-[108px] md:py-10">
      <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-6 md:justify-between md:gap-0">
        {OUTILS.map((o) => (
          <Logo key={o} src={L(`${o}.svg`)} taille={28} alt={o} />
        ))}
      </div>
    </div>
  );
}

/** Libellé du badge de secteur, tel qu'il est écrit dans Figma. */
export const SECTEUR_COURT: Record<string, string> = {
  "atout-travaux": "Artisan",
  "campagne-vallauris": "Chambres d’hôtes",
  "liccia-immo": "Immobilier",
  "le-k-repare": "Réparation",
  "la-santon": "Gîtes",
};

export function BadgeSecondaire({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-5 items-center rounded-full bg-secondary px-2 text-xs font-medium whitespace-nowrap text-secondary-foreground">
      {children}
    </span>
  );
}

export function CarteProjet({ projet, hauteurImage = 260 }: { projet: Projet; hauteurImage?: number }) {
  return (
    <Link href={`${LIENS.realisations}/${projet.slug}`} className="group flex flex-1 flex-col gap-3.5">
      <div
        className="relative w-full overflow-hidden rounded-[16px] border border-border bg-muted"
        style={{ height: hauteurImage }}
      >
        {projet.image_couverture ? (
          <Image
            src={projet.image_couverture}
            alt={`Capture du site ${projet.titre}`}
            fill
            sizes="(min-width: 768px) 384px, 100vw"
            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : null}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[18px] font-semibold text-foreground">{projet.titre}</span>
        <BadgeSecondaire>{SECTEUR_COURT[projet.slug] ?? projet.secteur ?? ""}</BadgeSecondaire>
      </div>
    </Link>
  );
}

export function RealisationsAccueil({ projets }: { projets: Projet[] }) {
  return (
    <Section nom="Réalisations" className="flex flex-col gap-6 md:gap-10">
      <div className="flex items-center justify-between">
        <TitreMarqueur debut="" marqueur="Réalisations" className="[&>span]:!text-[30px] md:[&>span]:!text-[40px]" />
        <BoutonPilule href={LIENS.realisations} style="contour" taille="sm" fleche>
          Tout voir
        </BoutonPilule>
      </div>
      <div className="flex flex-col gap-7 md:flex-row md:gap-6">
        {projets.slice(0, 3).map((p) => (
          <CarteProjet key={p.id} projet={p} />
        ))}
      </div>
    </Section>
  );
}

const ETAPES = [
  { num: "01", icone: "call", titre: "Appel", texte: "On cadre votre besoin en 30 minutes." },
  { num: "02", icone: "edit", titre: "Devis", texte: "Un prix fixé avant de commencer." },
  { num: "03", icone: "code", titre: "Réalisation", texte: "Maquette, développement, points réguliers." },
  { num: "04", icone: "rocket", titre: "Mise en ligne", texte: "Prise en main et suivi après livraison." },
] as const;

export function CommentCaSePasse() {
  return (
    <Section nom="Comment ça se passe" className="flex flex-col gap-6 pb-7 md:gap-10 md:pb-12">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
        <TitreMarqueur debut="Comment ça" marqueur="se passe" />
        <LienFleche href={LIENS.methode}>Voir la méthode</LienFleche>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        {ETAPES.map((e) => (
          <div key={e.num} className={cn(CARTE, "flex flex-1 flex-col gap-4 p-6")}>
            <div className="flex items-center justify-between">
              <TuileIcone nom={e.icone} />
              <span className="text-sm font-medium text-primary">{e.num}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[18px] font-semibold">{e.titre}</span>
              <p className="text-sm">{e.texte}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function DesPrixAffiches() {
  const offres = [
    { icone: "discovery" as const, titre: "Sites web", prix: "dès 1 500 €", texte: "Vitrine, sur mesure ou refonte." },
    { icone: "workflow" as const, titre: "Automatisation IA", prix: "dès 600 €", texte: "Audit, workflow ou agent sur mesure." },
  ];
  return (
    <Section nom="Des prix affichés" className="flex flex-col gap-6 py-7 md:gap-10 md:py-12">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
        <TitreMarqueur debut="Des prix" marqueur="affichés" />
        <LienFleche href={LIENS.tarifs}>Voir tous les tarifs</LienFleche>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        {offres.map((o) => (
          <div key={o.titre} className={cn(CARTE, "flex flex-1 items-center gap-5 p-6")}>
            <TuileIcone nom={o.icone} />
            <div className="flex flex-col gap-0.5">
              <span className="text-base font-semibold">{o.titre}</span>
              <span className="text-[24px] font-bold tracking-[-0.5px] md:text-[28px]">{o.prix}</span>
              <span className="text-sm">{o.texte}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function AppelAction() {
  return (
    <div className="mx-auto w-full max-w-[1416px]">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-[20px] py-16 md:rounded-[24px] md:py-24">
        <Image src="/figma/images/nuages.webp" alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: "50% 30%" }} />
        <h2 className="relative text-[40px] font-bold tracking-[-1.2px] text-white md:text-[56px] md:tracking-[-1.68px]">
          Un <span className="font-marqueur font-normal tracking-normal">projet</span> ?
        </h2>
        <BoutonPilule href={LIENS.contact} style="noir" fleche className="relative">
          Demander un devis gratuit
        </BoutonPilule>
      </div>
    </div>
  );
}

export const FAQ_ACCUEIL = [
  { q: "Combien coûte un site ?", r: "Entre 1 500 et 9 000 € selon le besoin. Les prix sont sur la page Tarifs." },
  { q: "En combien de temps ?", r: "De 2 à 8 semaines, selon la taille du projet." },
  { q: "Que peut faire un agent IA ?", r: "Préparer des devis, relancer des clients, trier des e-mails, dans vos outils." },
  { q: "Je garde la main ?", r: "Oui : le code est à vous et les actions sensibles passent par votre validation." },
];
