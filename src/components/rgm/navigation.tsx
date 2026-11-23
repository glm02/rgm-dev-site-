"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "cn";
import { Icone } from "./icones";
import { TuileIcone } from "./primitives";
import { LIENS, MENU } from "./liens";

const SERVICES = [
  { nom: "discovery", titre: "Sites web", texte: "Vitrine, e-commerce, refonte", href: LIENS.sitesWeb },
  { nom: "workflow", titre: "Automatisation IA", texte: "Agents et workflows sur mesure", href: LIENS.automatisation },
] as const;

function PanneauServices({ onChoix }: { onChoix?: () => void }) {
  return (
    <div className="w-[440px] rounded-[20px] border border-border bg-white p-3 shadow-[0_12px_32px_-8px_rgba(10,18,51,0.12)]">
      {SERVICES.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          onClick={onChoix}
          className="flex items-center gap-3.5 rounded-[12px] p-3 transition-colors hover:bg-muted"
        >
          <TuileIcone nom={s.nom} />
          <span className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold text-foreground">{s.titre}</span>
            <span className="text-[13px] text-foreground">{s.texte}</span>
          </span>
        </Link>
      ))}
      <div className="my-1 h-px bg-border" />
      <Link
        href={LIENS.lyon}
        onClick={onChoix}
        className="flex items-center gap-2 rounded-[10px] px-3 pt-2.5 pb-1.5 text-[13px] font-medium text-foreground hover:underline"
      >
        <Icone nom="location" taille={16} />
        Développeur web freelance à Lyon
      </Link>
    </div>
  );
}

function MenuMobile({ ouvert, fermer }: { ouvert: boolean; fermer: () => void }) {
  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && fermer();
    document.addEventListener("keydown", surTouche);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", surTouche);
      document.body.style.overflow = "";
    };
  }, [ouvert, fermer]);

  if (!ouvert) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 overflow-y-auto bg-white px-4 pt-4 pb-6 text-foreground md:hidden">
      <div className="flex items-center justify-between pb-4">
        <span className="text-[20px] font-bold tracking-[-0.6px]">RGM DEV</span>
        <button type="button" onClick={fermer} aria-label="Fermer le menu" className="rounded-md p-1">
          <Icone nom="fermer" taille={24} />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {SERVICES.map((s) => (
          <Link key={s.href} href={s.href} onClick={fermer} className="flex items-center gap-3.5 py-2">
            <TuileIcone nom={s.nom} />
            <span className="text-[17px] font-semibold">{s.titre}</span>
          </Link>
        ))}
        <div className="my-2 h-px bg-border" />
        {[...MENU.slice(0, 2), { libelle: "Avis", href: LIENS.avis }, ...MENU.slice(2), { libelle: "Contact", href: LIENS.contact }].map((l) => (
          <Link key={l.href} href={l.href} onClick={fermer} className="flex items-center justify-between py-3 text-[17px] font-medium">
            {l.libelle}
            <Icone nom="fleche-droite" taille={18} />
          </Link>
        ))}
        <div className="flex flex-col gap-2.5 pt-4">
          <Link href={LIENS.contact} onClick={fermer} className="inline-flex h-11 items-center justify-center rounded-full bg-[#0a0a0d] text-sm font-medium text-white">
            Demander un devis
          </Link>
          <Link href={LIENS.espaceClient} onClick={fermer} className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white text-sm font-medium text-[#0a0a0d]">
            Espace client
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Barre de navigation posée sur le visuel du haut de page (composant Figma « Navigation / Desktop » et « / Mobile »). */
export function Navigation() {
  const [services, setServices] = useState(false);
  const [mobile, setMobile] = useState(false);
  const zone = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!services) return;
    const clic = (e: MouseEvent) => {
      if (zone.current && !zone.current.contains(e.target as Node)) setServices(false);
    };
    const touche = (e: KeyboardEvent) => e.key === "Escape" && setServices(false);
    document.addEventListener("mousedown", clic);
    document.addEventListener("keydown", touche);
    return () => {
      document.removeEventListener("mousedown", clic);
      document.removeEventListener("keydown", touche);
    };
  }, [services]);

  return (
    <nav aria-label="Navigation principale" className="relative z-20 flex w-full items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
      <Link href={LIENS.accueil} className="inline-flex items-center justify-self-start text-[20px] font-bold tracking-[-0.6px] text-white max-md:min-h-11 md:text-[22px] md:tracking-[-0.66px]">
        RGM DEV
      </Link>

      <div
        ref={zone}
        className="relative hidden items-start gap-0.5 rounded-full bg-[rgba(10,10,13,0.35)] p-1.5 backdrop-blur-[8px] md:flex"
      >
        <button
          type="button"
          aria-expanded={services}
          aria-haspopup="true"
          onClick={() => setServices((v) => !v)}
          onMouseEnter={() => setServices(true)}
          className="flex items-center rounded-full pr-2.5 text-sm font-medium leading-5 text-white"
        >
          <span className="py-2 pr-1 pl-4">Services</span>
          <Icone nom="chevron-bas" taille={14} className={cn("transition-transform duration-200", services && "rotate-180")} />
        </button>
        {MENU.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors hover:bg-white/10">
            {l.libelle}
          </Link>
        ))}
        {services ? (
          <div className="absolute top-[calc(100%+8px)] left-0" onMouseLeave={() => setServices(false)}>
            <PanneauServices onChoix={() => setServices(false)} />
          </div>
        ) : null}
      </div>

      <div className="hidden items-start gap-2 justify-self-end md:flex">
        <Link href={LIENS.espaceClient} className="inline-flex h-7 items-center rounded-full px-2.5 text-xs font-medium text-white hover:bg-white/10">
          Espace client
        </Link>
        <Link href={LIENS.contact} className="inline-flex h-7 items-center rounded-full bg-white px-2.5 text-xs font-medium text-[#0a0a0d] hover:bg-white/90">
          Demander un devis
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setMobile(true)}
        aria-label="Ouvrir le menu"
        className="inline-flex size-11 items-center justify-center rounded-full bg-[rgba(10,10,13,0.35)] text-white backdrop-blur-[16px] md:hidden"
      >
        <Icone nom="menu" taille={16} />
      </button>
      <MenuMobile ouvert={mobile} fermer={() => setMobile(false)} />
    </nav>
  );
}
