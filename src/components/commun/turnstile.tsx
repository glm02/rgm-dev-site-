"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Le widget Cloudflare Turnstile : la vérification anti-robot sans puzzle.
 *
 * Chez un visiteur normal, il se valide seul en une seconde. Il glisse le
 * jeton dans un champ caché `cf-turnstile-response` du formulaire parent,
 * que le Server Action vérifie ensuite auprès de Cloudflare.
 *
 * Sans `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, rien ne s'affiche : le site
 * fonctionne avant que les clés soient posées (le serveur ignore alors la
 * vérification, voir `lib/turnstile.ts`).
 *
 * Le script n'est chargé que sur les pages qui ont un formulaire, pas sur
 * tout le site : les pages publiques restent légères pour le référencement.
 */

const CLE_SITE = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
const URL_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type OptionsTurnstile = {
  sitekey: string;
  action?: string;
  theme?: "auto" | "light" | "dark";
  size?: "normal" | "flexible" | "compact";
  language?: string;
  appearance?: "always" | "execute" | "interaction-only";
  callback?: (jeton: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

type ApiTurnstile = {
  render: (element: HTMLElement, options: OptionsTurnstile) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: ApiTurnstile;
  }
}

let chargement: Promise<ApiTurnstile> | null = null;

/** Charge le script une seule fois, même avec plusieurs widgets. */
function chargerTurnstile(): Promise<ApiTurnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  chargement ??= new Promise((resoudre, rejeter) => {
    const script = document.createElement("script");
    script.src = URL_SCRIPT;
    script.async = true;
    script.onload = () => (window.turnstile ? resoudre(window.turnstile) : rejeter(new Error("turnstile absent")));
    script.onerror = () => {
      chargement = null;
      rejeter(new Error("script Turnstile non chargé"));
    };
    document.head.appendChild(script);
  });
  return chargement;
}

export function turnstileConfigure(): boolean {
  return CLE_SITE !== "";
}

export function Turnstile({
  action,
  reinitialiser,
  onJeton,
  className,
}: {
  /** Le nom du formulaire, revérifié côté serveur. */
  action: string;
  /** Toute nouvelle valeur réinitialise le widget : un jeton ne sert qu'une fois. */
  reinitialiser?: unknown;
  /** Pour les formulaires gérés en JavaScript (connexion Supabase). */
  onJeton?: (jeton: string | null) => void;
  className?: string;
}) {
  const conteneur = React.useRef<HTMLDivElement>(null);
  const identifiant = React.useRef<string | null>(null);
  const rappel = React.useRef(onJeton);
  const [echec, setEchec] = React.useState(false);

  React.useEffect(() => {
    rappel.current = onJeton;
  });

  React.useEffect(() => {
    if (!CLE_SITE || !conteneur.current) return;
    let annule = false;

    chargerTurnstile()
      .then((api) => {
        if (annule || !conteneur.current) return;
        identifiant.current = api.render(conteneur.current, {
          sitekey: CLE_SITE,
          action,
          theme: "auto",
          size: "flexible",
          language: "fr",
          callback: (jeton) => rappel.current?.(jeton),
          "expired-callback": () => rappel.current?.(null),
          "error-callback": () => rappel.current?.(null),
        });
      })
      .catch(() => setEchec(true));

    return () => {
      annule = true;
      if (identifiant.current) window.turnstile?.remove(identifiant.current);
      identifiant.current = null;
    };
  }, [action]);

  // Après une soumission, le jeton a été consommé : on en demande un neuf.
  const premierRendu = React.useRef(true);
  React.useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    if (identifiant.current) {
      window.turnstile?.reset(identifiant.current);
      rappel.current?.(null);
    }
  }, [reinitialiser]);

  if (!CLE_SITE) return null;

  return (
    <div className={cn("min-h-[65px]", className)}>
      <div ref={conteneur} />
      {echec && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          La vérification anti-robot n&apos;a pas pu se charger. Désactivez un éventuel
          bloqueur pour ce site, ou écrivez-moi directement par email.
        </p>
      )}
    </div>
  );
}
