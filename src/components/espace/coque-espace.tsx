"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  FileText,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Newspaper,
  Star,
  Tags,
  Users,
  type LucideIcon,
} from "lucide-react";

import { BasculeTheme } from "@/components/site/bascule-theme";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

/**
 * Les icônes utilisables dans la navigation d'un espace.
 *
 * Passées par nom plutôt que par composant : la coque est un composant client,
 * et une fonction ne traverse pas la frontière serveur → client.
 */
const ICONES = {
  tableau: LayoutDashboard,
  projets: FolderKanban,
  avis: Star,
  demandes: Inbox,
  realisations: FileText,
  offres: Tags,
  moderation: MessageSquareQuote,
  clients: Users,
  articles: Newspaper,
  supervision: Activity,
} satisfies Record<string, LucideIcon>;

export type LienEspace = {
  href: string;
  libelle: string;
  icone: keyof typeof ICONES;
  /** Petit compteur à droite du lien (demandes non traitées, alertes…). */
  compteur?: number;
};

/**
 * La coque commune à l'espace client et à l'admin.
 *
 * Barre latérale sur grand écran, barre d'onglets défilante en haut sur
 * mobile. Même structure pour les deux espaces : un client qui devient admin
 * ne réapprend rien, et le code n'existe qu'une fois.
 */
export function CoqueEspace({
  titre,
  liens,
  utilisateur,
  children,
}: {
  titre: string;
  liens: LienEspace[];
  utilisateur: { nom: string; email: string };
  children: React.ReactNode;
}) {
  const chemin = usePathname();

  // Le lien racine d'un espace ne doit être actif que sur lui-même, sinon
  // « Tableau de bord » resterait allumé sur toutes les sous-pages.
  const racine = liens[0]?.href;
  const estActif = (href: string) =>
    href === racine ? chemin === href : chemin === href || chemin.startsWith(`${href}/`);

  return (
    <div className="flex min-h-dvh flex-col bg-secondary/30 lg:flex-row">
      <aside className="border-b border-border bg-background lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex h-16 items-center justify-between gap-3 px-5 lg:h-auto lg:flex-col lg:items-start lg:px-5 lg:pt-6 lg:pb-4">
          <Logo />
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {titre}
          </p>
        </div>

        <nav
          aria-label={titre}
          className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0"
        >
          {liens.map((lien) => {
            const Icone = ICONES[lien.icone];
            const actif = estActif(lien.href);

            return (
              <Link
                key={lien.href}
                href={lien.href}
                aria-current={actif ? "page" : undefined}
                className={cn(
                  "flex h-9 shrink-0 items-center gap-2.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap",
                  "transition-[background-color,color] duration-150 ease-out",
                  actif
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icone className="size-4" strokeWidth={actif ? 2 : 1.75} aria-hidden="true" />
                <span className="flex-1">{lien.libelle}</span>
                {lien.compteur ? (
                  <span className="rounded-full bg-primary px-1.5 py-px text-[11px] leading-4 font-semibold text-primary-foreground tabular-nums">
                    {lien.compteur}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-border p-4 lg:block">
          <p className="truncate text-sm font-medium">{utilisateur.nom}</p>
          <p className="truncate text-xs text-muted-foreground">{utilisateur.email}</p>

          <div className="mt-3 flex items-center gap-1">
            <FormulaireDeconnexion />
            <BasculeTheme />
          </div>
        </div>
      </aside>

      <main id="contenu" className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-10">{children}</div>

        <div className="flex items-center justify-between border-t border-border px-5 py-4 lg:hidden">
          <p className="truncate text-sm text-muted-foreground">{utilisateur.email}</p>
          <div className="flex items-center gap-1">
            <FormulaireDeconnexion />
            <BasculeTheme />
          </div>
        </div>
      </main>
    </div>
  );
}

/** Déconnexion en POST : un lien en GET partirait au premier préchargeur. */
function FormulaireDeconnexion() {
  return (
    <form action="/auth/deconnexion" method="post" className="flex-1">
      <button
        type="submit"
        className={cn(
          "inline-flex h-9 w-full items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground",
          "transition-[background-color,color] duration-150 ease-out hover:bg-secondary hover:text-foreground",
        )}
      >
        <LogOut className="size-4" strokeWidth={1.75} aria-hidden="true" />
        Déconnexion
      </button>
    </form>
  );
}
