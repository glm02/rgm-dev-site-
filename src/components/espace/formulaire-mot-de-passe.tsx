"use client";

import { Check, Loader2 } from "lucide-react";
import * as React from "react";

import { clientNavigateur } from "@/lib/supabase/navigateur";
import { cn } from "@/lib/utils";

const LONGUEUR_MIN = 10;

/**
 * Définir ou changer son mot de passe.
 *
 * Le changement passe par Supabase Auth côté navigateur, avec la session déjà
 * ouverte : Supabase ne modifie que le compte connecté, il n'y a donc rien à
 * autoriser de notre côté. Le mot de passe ne transite jamais par nos
 * serveurs ni par nos tables.
 *
 * Pratique pour un compte ouvert par Google ou par lien magique : on se
 * connecte une fois comme ça, puis on peut entrer par email + mot de passe.
 */
export function FormulaireMotDePasse() {
  const [motDePasse, setMotDePasse] = React.useState("");
  const [confirmation, setConfirmation] = React.useState("");
  const [etat, setEtat] = React.useState<"inerte" | "envoi" | "succes">("inerte");
  const [erreur, setErreur] = React.useState<string | null>(null);

  async function enregistrer(evenement: React.FormEvent) {
    evenement.preventDefault();
    if (etat === "envoi") return;

    setErreur(null);
    if (motDePasse.length < LONGUEUR_MIN) {
      setErreur(`Au moins ${LONGUEUR_MIN} caractères.`);
      return;
    }
    if (motDePasse !== confirmation) {
      setErreur("Les deux saisies ne correspondent pas.");
      return;
    }

    const supabase = clientNavigateur();
    if (!supabase) {
      setErreur("La connexion n'est pas encore active.");
      return;
    }

    setEtat("envoi");
    const { error } = await supabase.auth.updateUser({ password: motDePasse });

    if (error) {
      setErreur(
        error.code === "same_password"
          ? "C'est déjà votre mot de passe actuel."
          : error.code === "weak_password"
            ? "Mot de passe trop faible : mélangez lettres, chiffres et symboles."
            : "Le mot de passe n'a pas pu être enregistré. Réessayez.",
      );
      setEtat("inerte");
      return;
    }

    setMotDePasse("");
    setConfirmation("");
    setEtat("succes");
  }

  const classeChamp = cn(
    "h-12 w-full rounded-xl border border-input bg-background px-4 text-[15px]",
    "transition-[border-color,box-shadow] duration-150 ease-out",
    "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
  );

  return (
    <form onSubmit={enregistrer} className="space-y-4">
      {erreur && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {erreur}
        </p>
      )}
      {etat === "succes" && (
        <p role="status" className="flex items-center gap-2 rounded-xl border border-bleu-200 bg-bleu-50 px-4 py-3 text-sm text-bleu-800 dark:border-bleu-800 dark:bg-bleu-950/40 dark:text-bleu-200">
          <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
          Mot de passe enregistré.
        </p>
      )}

      <div>
        <label htmlFor="nouveau-mot-de-passe" className="mb-2 block text-sm font-medium">
          Nouveau mot de passe
        </label>
        <input
          id="nouveau-mot-de-passe"
          type="password"
          required
          minLength={LONGUEUR_MIN}
          autoComplete="new-password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className={classeChamp}
        />
      </div>

      <div>
        <label htmlFor="confirmation-mot-de-passe" className="mb-2 block text-sm font-medium">
          Confirmation
        </label>
        <input
          id="confirmation-mot-de-passe"
          type="password"
          required
          autoComplete="new-password"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className={classeChamp}
        />
      </div>

      <button
        type="submit"
        disabled={etat === "envoi"}
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6",
          "text-[15px] font-medium text-primary-foreground",
          "transition-[background-color,scale,opacity] duration-150 ease-out",
          "hover:bg-bleu-700 active:scale-96 disabled:opacity-70 dark:hover:bg-bleu-400",
        )}
      >
        {etat === "envoi" && <Loader2 className="size-4 animate-spin" strokeWidth={2} aria-hidden="true" />}
        {etat === "envoi" ? "Enregistrement…" : "Enregistrer le mot de passe"}
      </button>
    </form>
  );
}
