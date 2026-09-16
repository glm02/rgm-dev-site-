"use client";

import { Rating } from "@appica/ui-react/rating";
import { Check, Loader2 } from "lucide-react";
import * as React from "react";

import { deposerAvis } from "@/lib/actions/compte";
import { cn } from "@/lib/utils";

const LIBELLES_NOTE = ["", "Décevant", "Moyen", "Bien", "Très bien", "Excellent"];

/**
 * Le dépôt d'un avis par le client.
 *
 * La note utilise le `Rating` d'Appica UI : clavier (flèches), survol et
 * lecteurs d'écran sont déjà traités, ce qu'une rangée de cinq boutons faite
 * main aurait mis longtemps à égaler. Sa valeur est recopiée dans un champ
 * caché pour partir avec le formulaire.
 *
 * Le libellé écrit à côté des étoiles (« Très bien ») n'est pas décoratif : il
 * confirme la note sans avoir à compter les étoiles, et la couleur n'est pas le
 * seul signal.
 */
export function FormulaireAvis({ nomParDefaut }: { nomParDefaut: string }) {
  const [etat, action, enCours] = React.useActionState(deposerAvis, { statut: "inerte" });
  const [note, setNote] = React.useState(0);
  const [survol, setSurvol] = React.useState<number | null>(null);

  if (etat.statut === "succes") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-bleu-200 bg-bleu-50 p-8 text-center dark:border-bleu-800 dark:bg-bleu-950/40"
      >
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-6" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-semibold">Merci pour votre avis</h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">{etat.message}</p>
      </div>
    );
  }

  const affichee = survol ?? note;
  const erreur = (champ: string) => etat.erreurs?.[champ]?.[0];

  return (
    <form action={action} className="space-y-6">
      {etat.statut === "erreur" && etat.message && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {etat.message}
        </p>
      )}

      <fieldset>
        <legend className="mb-3 text-sm font-medium">Votre note</legend>
        <div className="flex items-center gap-4">
          <Rating
            value={note}
            onValueChange={setNote}
            onHoverChange={setSurvol}
            aria-label="Note sur 5"
            style={{ "--rating-size": "2rem" } as React.CSSProperties}
          />
          <span className="min-w-24 text-sm font-medium text-muted-foreground" aria-live="polite">
            {LIBELLES_NOTE[affichee] ?? ""}
          </span>
        </div>
        <input type="hidden" name="note" value={note} />
        {erreur("note") && <p className="mt-2 text-xs text-destructive">{erreur("note")}</p>}
      </fieldset>

      <Champ nom="contenu" libelle="Votre avis" erreur={erreur("contenu")}>
        {(props) => (
          <textarea
            {...props}
            rows={6}
            placeholder="Ce qui vous a convaincu, comment ça s'est passé, ce que le projet a changé pour vous."
            className={cn(props.className, "min-h-36 resize-y py-3 leading-relaxed")}
          />
        )}
      </Champ>

      <div className="grid gap-5 sm:grid-cols-3">
        <Champ nom="auteur_nom" libelle="Nom affiché" erreur={erreur("auteur_nom")}>
          {(props) => <input {...props} defaultValue={nomParDefaut} autoComplete="name" />}
        </Champ>
        <Champ nom="auteur_role" libelle="Fonction" facultatif>
          {(props) => <input {...props} placeholder="Gérant" autoComplete="organization-title" />}
        </Champ>
        <Champ nom="auteur_entreprise" libelle="Entreprise" facultatif>
          {(props) => <input {...props} autoComplete="organization" />}
        </Champ>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Votre avis est publié tel quel, sans retouche. Vous pouvez demander son retrait à
          tout moment.
        </p>
        <button
          type="submit"
          disabled={enCours}
          className={cn(
            "inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6",
            "text-[15px] font-medium text-primary-foreground",
            "transition-[background-color,scale,opacity] duration-150 ease-out",
            "hover:bg-bleu-700 active:scale-96 disabled:opacity-70 dark:hover:bg-bleu-400",
          )}
        >
          {enCours && <Loader2 className="size-4 animate-spin" strokeWidth={2} aria-hidden="true" />}
          {enCours ? "Envoi…" : "Envoyer mon avis"}
        </button>
      </div>
    </form>
  );
}

function Champ({
  nom,
  libelle,
  facultatif,
  erreur,
  children,
}: {
  nom: string;
  libelle: string;
  facultatif?: boolean;
  erreur?: string;
  children: (props: {
    id: string;
    name: string;
    className: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
  }) => React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={nom} className="mb-2 block text-sm font-medium">
        {libelle}
        {facultatif && <span className="ml-1.5 font-normal text-muted-foreground">(facultatif)</span>}
      </label>
      {children({
        id: nom,
        name: nom,
        "aria-invalid": erreur ? true : undefined,
        "aria-describedby": erreur ? `${nom}-erreur` : undefined,
        className: cn(
          "h-12 w-full rounded-xl border bg-background px-4 text-[15px]",
          "transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground/70",
          "focus-visible:ring-3 focus-visible:outline-none",
          erreur
            ? "border-destructive focus-visible:ring-destructive/25"
            : "border-input focus-visible:border-ring focus-visible:ring-ring/40",
        ),
      })}
      {erreur && (
        <p id={`${nom}-erreur`} className="mt-2 text-xs text-destructive">
          {erreur}
        </p>
      )}
    </div>
  );
}
