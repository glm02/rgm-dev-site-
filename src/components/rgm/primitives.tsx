import Link from "next/link";
import { cn } from "cn";
import { Icone as IconeSvg, type NomIcone } from "./icones";

/** Titre de section : le dernier mot passe en Permanent Marker, comme dans Figma. */
export function TitreMarqueur({
  debut,
  marqueur,
  apres,
  niveau: Balise = "h2",
  taille = "section",
  className,
}: {
  debut: string;
  marqueur: string;
  apres?: string;
  niveau?: "h1" | "h2" | "h3";
  taille?: "section" | "carte" | "page";
  className?: string;
}) {
  const tailles = {
    section: "text-[30px] tracking-[-0.9px] md:text-[40px] md:tracking-[-1.2px] [&>span]:text-[28px] md:[&>span]:text-[38px]",
    carte: "text-[22px] font-semibold md:text-[26px] [&>span]:text-[20px] md:[&>span]:text-[24px]",
    page: "text-[40px] tracking-[-1.6px] md:text-[72px] md:tracking-[-2.88px] [&>span]:text-[38px] md:[&>span]:text-[66px]",
  } as const;
  return (
    <Balise className={cn("font-bold leading-normal text-foreground", tailles[taille], className)}>
      {debut} <span className="font-marqueur font-normal tracking-normal">{marqueur}</span>
      {apres}
    </Balise>
  );
}

/** Tuile d'icône « premium » : dégradé bleu très clair, bordure fine, ombre douce, icône Two-tone bleue. */
export function TuileIcone({ nom, taille = 22, className }: { nom: NomIcone; taille?: number; className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-[12px] border border-[#d1dbff] p-[11px] text-primary shadow-[0_2px_6px_rgba(64,92,229,0.14),inset_0_1px_0_rgba(255,255,255,0.9)]",
        className,
      )}
      style={{ backgroundImage: "linear-gradient(135deg, #f5f7ff 0%, #d9e0ff 71.4%)" }}
    >
      <IconeSvg nom={nom} taille={taille} ton="deux" />
    </span>
  );
}

/** Logo d'entreprise exporté de Figma (public/figma/logos). */
export function Logo({ src, taille = 24, rond, className, alt = "" }: { src: string; taille?: number; rond?: "cercle" | "carre"; className?: string; alt?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={taille}
      height={taille}
      className={cn("block shrink-0 object-cover", rond === "cercle" && "rounded-full", rond === "carre" && "rounded-[25%]", className)}
    />
  );
}

/** Lien texte bleu avec flèche (Button variant Link du kit shadcn). */
export function LienFleche({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group/lien inline-flex h-8 items-center gap-1 rounded-[10px] px-2.5 text-sm font-medium text-primary underline-offset-4 hover:underline max-md:min-h-11",
        className,
      )}
    >
      {children}
      <IconeSvg nom="fleche-droite" taille={16} className="transition-transform duration-150 group-hover/lien:translate-x-0.5 motion-reduce:transform-none" />
    </Link>
  );
}

const STYLES_BOUTON = {
  noir: "bg-[rgba(10,10,13,0.92)] text-white hover:bg-[#0a0a0d]",
  blanc: "border border-border bg-white text-[#0a0a0d] hover:bg-muted",
  bleu: "bg-primary text-primary-foreground hover:bg-primary/90",
  contour: "border border-border bg-white text-[#0a0a0d] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-muted",
  fantome: "text-white hover:bg-white/10",
} as const;

/** Bouton pilule (Button shadcn, Roundness=Rounded). */
export function BoutonPilule({
  href,
  children,
  style = "noir",
  taille = "lg",
  fleche,
  className,
}: {
  href: string;
  children: React.ReactNode;
  style?: keyof typeof STYLES_BOUTON;
  taille?: "sm" | "lg";
  fleche?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1 rounded-full px-2.5 font-medium whitespace-nowrap focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.97] motion-reduce:transform-none max-md:min-h-11",
        taille === "lg" ? "h-9 text-sm" : "h-7 text-xs",
        STYLES_BOUTON[style],
        className,
      )}
    >
      {children}
      {fleche ? <IconeSvg nom="fleche-droite" taille={16} /> : null}
    </Link>
  );
}

/** Section du site : largeur de contenu 1200, marges Figma (108 + 12 en desktop, 16 en mobile). */
export function Section({
  children,
  className,
  id,
  nom,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  nom?: string;
}) {
  return (
    <section id={id} data-section={nom} className={cn("mx-auto w-full max-w-[1416px] px-4 py-14 md:px-[108px] md:py-24", className)}>
      {children}
    </section>
  );
}

export const CARTE = "rounded-[16px] border border-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]";
