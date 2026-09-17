"use client";

import { Check, Loader2 } from "lucide-react";
import * as React from "react";

import { majProfil } from "@/lib/actions/compte";
import type { Profil } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Le profil du client.
 *
 * L'email n'est pas modifiable ici : c'est l'identifiant de connexion, fourni
 * par Google, GitHub ou le lien magique. Le changer passe par le fournisseur.
 */
export function FormulaireProfil({ profil }: { profil: Profil }) {
  const [etat, action, enCours] = React.useActionState(majProfil, { statut: "inerte" });
  const erreur = (champ: string) => etat.erreurs?.[champ]?.[0];

  const classeChamp = (enErreur?: string) =>
    cn(
      "h-12 w-full rounded-xl border bg-background px-4 text-[15px]",
      "transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground/70",
      "focus-visible:ring-3 focus-visible:outline-none",
      enErreur
        ? "border-destructive focus-visible:ring-destructive/25"
        : "border-input focus-visible:border-ring focus-visible:ring-ring/40",
    );

  return (
    <form action={action} className="space-y-5">
      {etat.statut === "erreur" && etat.message && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {etat.message}
        </p>
      )}
      {etat.statut === "succes" && (
        <p role="status" className="flex items-center gap-2 rounded-xl border border-bleu-200 bg-bleu-50 px-4 py-3 text-sm text-bleu-800 dark:border-bleu-800 dark:bg-bleu-950/40 dark:text-bleu-200">
          <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
          {etat.message}
        </p>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          value={profil.email}
          readOnly
          aria-describedby="email-aide"
          className={cn(classeChamp(), "bg-secondary/60")}
        />
        <p id="email-aide" className="mt-2 text-xs text-muted-foreground">
          C&apos;est votre identifiant de connexion : il ne se modifie pas ici.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nom" className="mb-2 block text-sm font-medium">
            Nom
          </label>
          <input
            id="nom"
            name="nom"
            required
            autoComplete="name"
            defaultValue={profil.nom ?? ""}
            aria-invalid={erreur("nom") ? true : undefined}
            className={classeChamp(erreur("nom"))}
          />
          {erreur("nom") && <p className="mt-2 text-xs text-destructive">{erreur("nom")}</p>}
        </div>

        <div>
          <label htmlFor="telephone" className="mb-2 block text-sm font-medium">
            Téléphone <span className="font-normal text-muted-foreground">(facultatif)</span>
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            autoComplete="tel"
            defaultValue={profil.telephone ?? ""}
            aria-invalid={erreur("telephone") ? true : undefined}
            className={classeChamp(erreur("telephone"))}
          />
          {erreur("telephone") && <p className="mt-2 text-xs text-destructive">{erreur("telephone")}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="entreprise" className="mb-2 block text-sm font-medium">
          Entreprise <span className="font-normal text-muted-foreground">(facultatif)</span>
        </label>
        <input
          id="entreprise"
          name="entreprise"
          autoComplete="organization"
          defaultValue={profil.entreprise ?? ""}
          className={classeChamp()}
        />
      </div>

      <button
        type="submit"
        disabled={enCours}
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6",
          "text-[15px] font-medium text-primary-foreground",
          "transition-[background-color,scale,opacity] duration-150 ease-out",
          "hover:bg-bleu-700 active:scale-96 disabled:opacity-70 dark:hover:bg-bleu-400",
        )}
      >
        {enCours && <Loader2 className="size-4 animate-spin" strokeWidth={2} aria-hidden="true" />}
        {enCours ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
