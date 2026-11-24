import Link from "next/link";
import { cn } from "cn";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BoutonDegrade } from "./bandeau";
import { Icone, type NomIcone } from "./icones";
import { LienFleche, Logo, TuileIcone } from "./primitives";
import { LIENS } from "./liens";

/** Colonne de contenu des pages intérieures : 1200 de large, 52 entre les blocs (Figma). */
export function ColonnePage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto flex w-full max-w-[1232px] flex-col gap-10 px-4 pt-10 pb-14 md:gap-[52px] md:pt-[52px] md:pb-24", className)}>
      {children}
    </div>
  );
}

export const CARTE_PLATE = "rounded-[16px] border border-border bg-white";

/** Fond bleuté texturé des encarts (FAQ, parcours). */
export const FOND_TEXTURE = {
  backgroundImage:
    "url(/figma/images/texture-faq.png), radial-gradient(ellipse 582px 141px at 85% 7%, rgba(224,236,255,0.32), rgba(229,237,250,0.13) 65%, rgba(229,237,250,0) 100%), linear-gradient(138.7deg, #edf4ff 10.9%, #fafcff 41.1%, #ffffff 66.7%, #edf4ff 88.4%)",
  backgroundSize: "100px 100px, auto, auto",
} as const;

export function TitreBloc({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-[26px] leading-[1.4] font-bold text-foreground md:text-[34px]", className)}>{children}</h2>;
}

export function Marqueur({ children, taille = 32 }: { children: React.ReactNode; taille?: number }) {
  return (
    <span className="font-marqueur font-normal md:text-[length:var(--m)]" style={{ ["--m" as string]: `${taille}px` }}>
      {children}
    </span>
  );
}

export type Prestation = { visuel: { icone: NomIcone } | { logos: string[] }; titre: string; texte: string };

export function Prestations({ titre, items }: { titre: React.ReactNode; items: Prestation[] }) {
  return (
    <section className="flex flex-col gap-[22px]">
      <TitreBloc>{titre}</TitreBloc>
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        {items.map((p) => (
          <div key={p.titre} className={cn(CARTE_PLATE, "flex flex-1 flex-col items-start gap-4 p-7")}>
            {"icone" in p.visuel ? (
              <TuileIcone nom={p.visuel.icone} />
            ) : (
              <div className="flex gap-2">
                {p.visuel.logos.map((l) => (
                  <Logo key={l} src={l} taille={l.endsWith(".svg") ? 24 : 22} className="rounded-[4px] object-contain" />
                ))}
              </div>
            )}
            <h3 className="text-[20px] leading-[1.4] font-bold">{p.titre}</h3>
            <p className="text-[15px] leading-[1.4]">{p.texte}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ExempleEtBudget({
  exemple,
  lienExemple,
  libelleBudget,
  prix,
}: {
  exemple: string;
  lienExemple: string;
  libelleBudget: string;
  prix: string;
}) {
  return (
    <section className="flex flex-col gap-4 md:flex-row md:gap-6">
      <div className={cn(CARTE_PLATE, "flex flex-1 flex-col items-start gap-4 p-7")}>
        <span className="text-sm leading-[1.4] font-semibold text-primary">Exemple client</span>
        <div className="flex items-center gap-[5px]">
          <Logo src="/figma/logos/atout-travaux.png" taille={17} className="object-contain" />
          <span className="text-[25px] leading-[1.4] font-bold">Atout Travaux</span>
        </div>
        <p className="text-base leading-[1.4]">{exemple}</p>
        <LienFleche href={lienExemple}>Voir la réalisation</LienFleche>
      </div>
      <div className={cn(CARTE_PLATE, "flex flex-1 flex-col items-start gap-4 p-7")}>
        <span className="text-[15px] leading-[1.4] font-semibold">{libelleBudget}</span>
        <span className="text-[36px] leading-[1.1] font-bold">{prix}</span>
        <Link href={LIENS.tarifs} className="inline-flex h-11 items-center rounded-[8px] border border-border bg-white px-4 text-sm font-medium">
          Voir les tarifs
        </Link>
      </div>
    </section>
  );
}

export function CarteFaq({ questions }: { questions: { q: string; r: string }[] }) {
  return (
    <section className="flex flex-col items-center gap-5 rounded-[16px] border border-border px-5 py-[29px]" style={FOND_TEXTURE}>
      <div className="flex w-full max-w-[760px] flex-col gap-5">
        <h2 className="text-[30px] leading-[1.14] font-bold tracking-[-1.17px] text-[#1a1a1a] md:text-[39px]">Questions fréquentes</h2>
        <Accordion multiple defaultValue={questions.map((_, i) => String(i))} className="w-full">
          {questions.map((item, i) => (
            <AccordionItem key={item.q} value={String(i)}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.r}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/** Encart final « Échangeons sur votre besoin », avec ou sans paysage à droite. */
export function AppelBesoin({ texte, avecPaysage }: { texte: string; avecPaysage?: boolean }) {
  return (
    <section className="relative flex flex-col items-start gap-3 overflow-hidden rounded-[16px] border border-border bg-muted p-7">
      {avecPaysage ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-no-repeat"
            style={{ backgroundImage: "url(/figma/images/sommets.webp)", backgroundSize: "100% 303.8%", backgroundPosition: "50% 0%", top: -167, height: 530 }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: "linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.99) 48%, rgba(255,255,255,0.77) 68%, rgba(255,255,255,0.12) 100%)" }}
          />
        </>
      ) : null}
      <h2 className="relative text-[26px] leading-[1.4] font-bold md:text-[34px]">
        Échangeons sur votre <Marqueur>besoin</Marqueur>
      </h2>
      <p className="relative text-base leading-[1.4]">{texte}</p>
      <BoutonDegrade href={LIENS.contact} className="relative">
        Demander un devis
      </BoutonDegrade>
    </section>
  );
}

const ETAPES_PARCOURS = [
  { icone: "boite" as NomIcone, titre: "Reçoit", texte: "Un e-mail arrive.", style: { left: 59, top: 107, transform: "translateZ(12px) rotateX(7deg) rotateY(10deg)" } },
  { icone: "edit" as NomIcone, titre: "Prépare", texte: "L’agent prépare le devis.", style: { left: 434, top: 74, transform: "translateZ(46px) rotateX(6deg) rotateY(4deg)" } },
  { icone: "send" as NomIcone, titre: "Agit", texte: "Après votre validation, il l’envoie.", style: { left: 809, top: 42, transform: "translateZ(82px) rotateX(5deg) rotateY(-5deg)" } },
];

function EtapeParcours({ e, className, style }: { e: (typeof ETAPES_PARCOURS)[number]; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn("flex items-center gap-3 rounded-[12px] border border-border bg-white py-3.5 pr-3.5 pl-[18px] shadow-[0_11px_24px_rgba(8,26,99,0.13)]", className)}
      style={style}
    >
      <TuileIcone nom={e.icone} />
      <div className="flex flex-col gap-[3px] text-[#1a1a1a]">
        <span className="text-[19px] font-semibold">{e.titre}</span>
        <span className="text-sm">{e.texte}</span>
      </div>
    </div>
  );
}

/** « De l’e-mail au devis » : trois cartes en perspective (desktop), empilées en mobile. */
export function ParcoursDevis() {
  return (
    <section className="flex flex-col gap-[18px]">
      <h2 className="text-[26px] font-semibold text-[#1a1a1a] md:text-[34px]">
        De l’e-mail <Marqueur>au devis</Marqueur>
      </h2>
      <div className="relative overflow-hidden rounded-[16px] md:h-[228px]" style={FOND_TEXTURE}>
        <div className="hidden md:block" style={{ perspective: 1430 }}>
          <div className="relative h-[228px] w-[1200px]" style={{ transformStyle: "preserve-3d" }}>
            <span className="absolute text-[#1a1a1a]" style={{ left: 395, top: 113 }}>
              <Icone nom="fleche-droite" taille={22} />
            </span>
            <span className="absolute text-[#1a1a1a]" style={{ left: 765, top: 84 }}>
              <Icone nom="fleche-droite" taille={22} />
            </span>
            {ETAPES_PARCOURS.map((e) => (
              <EtapeParcours key={e.titre} e={e} className="absolute w-[322px]" style={e.style} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 p-4 md:hidden">
          {ETAPES_PARCOURS.map((e) => (
            <EtapeParcours key={e.titre} e={e} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Encart bleu texturé « Parlons de votre projet ». */
export function AppelProjet({ texte = "Décrivez votre besoin pour obtenir un devis adapté." }: { texte?: string }) {
  return (
    <section
      className="flex flex-col items-start gap-3 rounded-[16px] p-7 text-white md:p-11"
      style={{
        backgroundImage:
          "url(/figma/images/texture-bouton.png), radial-gradient(ellipse 536px 78px at 82% 17%, rgba(112,167,255,0.12), rgba(112,167,255,0.05) 49%, rgba(112,167,255,0) 100%), linear-gradient(154.7deg, #2244bb 8.1%, #2453cd 39.8%, #2460de 69.9%, #1d54d5 89.4%)",
        backgroundSize: "100px 100px, auto, auto",
      }}
    >
      <h2 className="text-[26px] leading-[1.4] font-bold md:text-[34px] [text-shadow:0_2px_24px_rgba(4,14,64,0.55)]">
        Parlons de votre <Marqueur>projet</Marqueur>
      </h2>
      <p className="text-base leading-[1.4]">{texte}</p>
      <Link href={LIENS.contact} className="inline-flex h-11 items-center rounded-[8px] bg-white px-4 text-sm font-medium text-[#081d77]">
        Demander un devis
      </Link>
    </section>
  );
}

export function ListeCoches({ items }: { items: string[] }) {
  return (
    <ul className="flex w-full flex-col gap-2.5">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-3 text-sm leading-[1.4]">
          <Icone nom="tick-square" taille={16} />
          {t}
        </li>
      ))}
    </ul>
  );
}

export const LOGOS_CLIENTS: Record<string, { src: string; largeur: number }> = {
  "atout-travaux": { src: "/figma/logos/atout-travaux.png", largeur: 17 },
  "campagne-vallauris": { src: "/figma/logos/campagne-vallauris.webp", largeur: 26 },
  "liccia-immo": { src: "/figma/logos/liccia-immo.png", largeur: 31 },
  "le-k-repare": { src: "/figma/logos/le-k-repare.png", largeur: 17 },
  "la-santon": { src: "/figma/logos/la-santon.png", largeur: 26 },
};
