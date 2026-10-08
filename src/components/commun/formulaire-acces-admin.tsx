"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import * as React from "react";

import { connexionAdmin } from "@/lib/actions/acces-admin";
import { cn } from "@/lib/utils";

/** Un seul champ : le mot de passe d'administration défini sur Vercel. */
export function FormulaireAccesAdmin() {
  const [etat, action, enCours] = React.useActionState(connexionAdmin, {});

  return (
    <form action={action} className="space-y-4">
      {etat.erreur && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {etat.erreur}
        </p>
      )}

      <div>
        <label htmlFor="mot_de_passe" className="mb-2 block text-sm font-medium">
          Mot de passe
        </label>
        <input
          id="mot_de_passe"
          name="mot_de_passe"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className={cn(
            "h-12 w-full rounded-xl border border-input bg-background px-4 text-[15px]",
            "transition-[border-color,box-shadow] duration-150 ease-out",
            "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
          )}
        />
      </div>

      <button
        type="submit"
        disabled={enCours}
        className={cn(
          "group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl",
          "bg-primary text-[15px] font-medium text-primary-foreground",
          "transition-[background-color,scale,opacity] duration-150 ease-out",
          "hover:bg-bleu-700 active:scale-96 dark:hover:bg-bleu-400",
          "disabled:pointer-events-none disabled:opacity-70",
        )}
      >
        {enCours ? (
          <>
            <Loader2 className="size-4 animate-spin" strokeWidth={2} aria-hidden="true" />
            Connexion…
          </>
        ) : (
          <>
            Entrer
            <ArrowRight
              className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
              strokeWidth={2}
              aria-hidden="true"
            />
          </>
        )}
      </button>
    </form>
  );
}
