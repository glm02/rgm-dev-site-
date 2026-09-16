"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, UserRound, X } from "lucide-react";
import * as React from "react";

import { BasculeTheme } from "./bascule-theme";
import { Logo } from "./logo";
import { NAVIGATION } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * L'entête du site.
 *
 * Elle est transparente en haut de page et prend un fond flouté dès qu'on
 * défile : le visiteur voit d'abord le contenu, pas une barre. Le seuil est à
 * 8 px pour que le changement soit franc plutôt que progressif — une entête
 * qui devient opaque petit à petit attire l'œil au mauvais moment.
 */
export function Entete() {
  const chemin = usePathname();
  const [defile, setDefile] = React.useState(false);
  const [menuOuvert, setMenuOuvert] = React.useState(false);

  React.useEffect(() => {
    const surDefilement = () => setDefile(window.scrollY > 8);
    surDefilement();
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => window.removeEventListener("scroll", surDefilement);
  }, []);

  // Une navigation doit refermer le menu. Sans ça, le panneau reste ouvert
  // par-dessus la nouvelle page.
  React.useEffect(() => setMenuOuvert(false), [chemin]);

  // Menu ouvert : on bloque le défilement du fond, sinon la page glisse
  // derrière le panneau quand on fait défiler celui-ci.
  React.useEffect(() => {
    if (!menuOuvert) return;
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = avant;
    };
  }, [menuOuvert]);

  React.useEffect(() => {
    if (!menuOuvert) return;
    const surEchap = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape") setMenuOuvert(false);
    };
    window.addEventListener("keydown", surEchap);
    return () => window.removeEventListener("keydown", surEchap);
  }, [menuOuvert]);

  const estActif = (href: string) =>
    chemin === href || (href !== "/" && chemin.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full",
          "transition-[background-color,border-color,backdrop-filter] duration-200 ease-out",
          defile
            ? "border-b border-border bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="conteneur-large flex h-16 items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {NAVIGATION.map((lien) => (
                <li key={lien.href}>
                  <Link
                    href={lien.href}
                    aria-current={estActif(lien.href) ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium",
                      "transition-[color,background-color] duration-150 ease-out",
                      estActif(lien.href)
                        ? "text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {lien.libelle}
                    {/* Le trait de la page courante. Un repère statique en plus
                        de la couleur : la couleur seule ne suffit pas. */}
                    {estActif(lien.href) && (
                      <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <BasculeTheme className="hidden sm:grid" />

            <Link
              href="/compte"
              aria-label="Espace client"
              className={cn(
                "hidden size-9 place-items-center rounded-lg text-muted-foreground sm:grid",
                "transition-[color,background-color,scale] duration-150 ease-out",
                "hover:bg-secondary hover:text-foreground active:scale-96",
              )}
            >
              <UserRound className="size-4.5" strokeWidth={1.75} />
            </Link>

            <Link
              href="/contact"
              className={cn(
                "group hidden h-9 items-center gap-1.5 rounded-lg bg-primary pr-3 pl-3.5 sm:inline-flex",
                "text-sm font-medium text-primary-foreground",
                "shadow-[0_1px_2px_oklch(0_0_0/0.08),0_6px_16px_-8px_var(--bleu-600)]",
                "transition-[background-color,scale] duration-150 ease-out",
                "hover:bg-bleu-700 active:scale-96 dark:hover:bg-bleu-400",
              )}
            >
              Demander un devis
              <ArrowRight
                className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </Link>

            <button
              type="button"
              onClick={() => setMenuOuvert((ouvert) => !ouvert)}
              aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOuvert}
              className={cn(
                "grid size-9 place-items-center rounded-lg text-foreground md:hidden",
                "transition-[background-color,scale] duration-150 ease-out",
                "hover:bg-secondary active:scale-96",
              )}
            >
              {menuOuvert ? (
                <X className="size-5" strokeWidth={1.75} />
              ) : (
                <Menu className="size-5" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>
      </header>

      <MenuMobile ouvert={menuOuvert} estActif={estActif} />
    </>
  );
}

/**
 * Le panneau mobile.
 *
 * Il reste monté et se cache par `translate` plutôt que d'être démonté : une
 * fermeture peut ainsi s'interrompre et repartir dans l'autre sens si on
 * rappuie sur le bouton, ce qu'un démontage ne permet pas.
 *
 * L'ouverture est plus lente que la fermeture (220 ms contre 150 ms) : quand
 * on ferme, la décision est déjà prise, on ne fait pas attendre.
 */
function MenuMobile({
  ouvert,
  estActif,
}: {
  ouvert: boolean;
  estActif: (href: string) => boolean;
}) {
  return (
    <div
      id="menu-mobile"
      inert={!ouvert}
      aria-hidden={!ouvert}
      className={cn(
        "fixed inset-x-0 top-16 bottom-0 z-40 md:hidden",
        "border-t border-border bg-background/95 backdrop-blur-xl",
        "transition-[opacity,translate,visibility] ease-out",
        ouvert
          ? "visible translate-y-0 opacity-100 duration-[220ms]"
          : "invisible -translate-y-2 opacity-0 duration-150",
      )}
    >
      <nav aria-label="Navigation mobile" className="conteneur flex flex-col gap-1 py-6">
        {NAVIGATION.map((lien, index) => (
          <Link
            key={lien.href}
            href={lien.href}
            style={{ transitionDelay: ouvert ? `${index * 40}ms` : "0ms" }}
            className={cn(
              "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium",
              "transition-[opacity,translate,background-color] duration-200 ease-out",
              ouvert ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
              estActif(lien.href)
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-secondary",
            )}
          >
            {lien.libelle}
            <ArrowRight className="size-4 text-muted-foreground" strokeWidth={1.75} />
          </Link>
        ))}

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-5">
          <Link
            href="/contact"
            className={cn(
              "inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl",
              "bg-primary text-sm font-medium text-primary-foreground",
              "transition-[scale] duration-150 ease-out active:scale-96",
            )}
          >
            Demander un devis
            <ArrowRight className="size-4" strokeWidth={2} />
          </Link>

          <Link
            href="/compte"
            aria-label="Espace client"
            className={cn(
              "grid size-11 place-items-center rounded-xl border border-border text-muted-foreground",
              "transition-[background-color,scale] duration-150 ease-out",
              "hover:bg-secondary active:scale-96",
            )}
          >
            <UserRound className="size-5" strokeWidth={1.75} />
          </Link>

          <BasculeTheme className="size-11 rounded-xl border border-border" />
        </div>
      </nav>
    </div>
  );
}
