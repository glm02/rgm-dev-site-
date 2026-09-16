"use client";

import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import * as React from "react";

import { ETAT_INITIAL, envoyerDemandeDevis } from "@/lib/actions/devis";
import { cn } from "@/lib/utils";

const TYPES_PROJET = [
  "Site vitrine",
  "Site sur mesure / application",
  "Refonte d'un site existant",
  "E-commerce",
  "Automatisation d'un processus",
  "Agent IA",
  "Maintenance d'un site existant",
  "Je ne sais pas encore",
];

const BUDGETS = [
  "Moins de 1 500 €",
  "1 500 – 3 000 €",
  "3 000 – 6 000 €",
  "6 000 – 12 000 €",
  "Plus de 12 000 €",
  "À définir ensemble",
];

const ECHEANCES = ["Dès que possible", "Sous 1 mois", "Sous 3 mois", "Pas de date fixée"];

/**
 * Le formulaire de devis.
 *
 * Trois partis pris :
 *
 * 1. **Il fonctionne sans JavaScript.** C'est un `<form action={...}>` branché
 *    sur un Server Action : si le script n'a pas chargé, la soumission passe
 *    quand même. Sur un site dont la raison d'être est de récolter des
 *    demandes, perdre un prospect parce qu'un script a échoué est inacceptable.
 * 2. **Les saisies sont renvoyées en cas d'erreur.** Retaper un message de dix
 *    lignes parce qu'on a mal écrit son email fait abandonner.
 * 3. **Les paramètres UTM suivent en champs cachés.** C'est ce qui permettra
 *    de savoir quelle campagne Google Ads rapporte réellement.
 */
export function FormulaireDevis({ className }: { className?: string }) {
  const [etat, action, enCours] = React.useActionState(
    envoyerDemandeDevis,
    ETAT_INITIAL,
  );

  if (etat.statut === "succes") {
    return <Confirmation message={etat.message} className={className} />;
  }

  return (
    <form action={action} className={cn("space-y-5", className)} noValidate>
      <ChampsCaches />

      {etat.statut === "erreur" && etat.message && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {etat.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Champ
          nom="nom"
          libelle="Votre nom"
          requis
          autoComplete="name"
          etat={etat}
          placeholder="Marie Dupont"
        />
        <Champ
          nom="email"
          libelle="Email"
          type="email"
          requis
          autoComplete="email"
          etat={etat}
          placeholder="marie@entreprise.fr"
        />
        <Champ
          nom="telephone"
          libelle="Téléphone"
          type="tel"
          autoComplete="tel"
          etat={etat}
          placeholder="06 12 34 56 78"
          facultatif
        />
        <Champ
          nom="entreprise"
          libelle="Entreprise"
          autoComplete="organization"
          etat={etat}
          placeholder="Nom de votre société"
          facultatif
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Liste nom="type_projet" libelle="Type de projet" options={TYPES_PROJET} etat={etat} />
        <Liste nom="budget" libelle="Budget envisagé" options={BUDGETS} etat={etat} />
        <Liste nom="echeance" libelle="Échéance" options={ECHEANCES} etat={etat} />
      </div>

      <Champ
        nom="message"
        libelle="Votre projet"
        requis
        etat={etat}
        multiligne
        placeholder="Ce que vous faites, ce dont vous avez besoin, et ce qui vous ferait dire que le projet est réussi. Trois phrases suffisent pour commencer."
        aide="Plus vous êtes précis, plus mon retour le sera."
      />

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Vos données servent uniquement à vous répondre. Elles ne sont ni revendues ni
          transmises.{" "}
          <a href="/confidentialite" className="underline underline-offset-2">
            En savoir plus
          </a>
        </p>

        <button
          type="submit"
          disabled={enCours}
          className={cn(
            "group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-6",
            "bg-primary text-[15px] font-medium text-primary-foreground",
            "shadow-[0_1px_2px_oklch(0_0_0/0.10),0_10px_30px_-12px_var(--bleu-600)]",
            "transition-[background-color,scale,opacity] duration-150 ease-out",
            "hover:bg-bleu-700 active:scale-96 dark:hover:bg-bleu-400",
            "disabled:pointer-events-none disabled:opacity-70",
          )}
        >
          {enCours ? (
            <>
              <Loader2 className="size-4 animate-spin" strokeWidth={2} aria-hidden="true" />
              Envoi…
            </>
          ) : (
            <>
              Envoyer ma demande
              <ArrowRight
                className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/**
 * Le piège à robots et le suivi de campagne.
 *
 * Le champ `site_web` est invisible mais pas `display:none` : certains robots
 * ignorent les champs masqués. Il est sorti de l'écran et retiré de l'ordre de
 * tabulation, ce qu'un lecteur d'écran comprend correctement.
 */
function ChampsCaches() {
  const parametres = useSearchParams();
  const chemin = usePathname();

  return (
    <>
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="site_web">Ne pas remplir ce champ</label>
        <input id="site_web" name="site_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <input type="hidden" name="page_origine" value={chemin} />
      <input type="hidden" name="utm_source" value={parametres.get("utm_source") ?? ""} />
      <input type="hidden" name="utm_medium" value={parametres.get("utm_medium") ?? ""} />
      <input
        type="hidden"
        name="utm_campaign"
        value={parametres.get("utm_campaign") ?? ""}
      />
    </>
  );
}

type EtatFormulaire = {
  erreurs?: Record<string, string[]>;
  valeurs?: Record<string, string>;
};

function Champ({
  nom,
  libelle,
  type = "text",
  requis,
  facultatif,
  multiligne,
  placeholder,
  aide,
  autoComplete,
  etat,
}: {
  nom: string;
  libelle: string;
  type?: string;
  requis?: boolean;
  facultatif?: boolean;
  multiligne?: boolean;
  placeholder?: string;
  aide?: string;
  autoComplete?: string;
  etat: EtatFormulaire;
}) {
  const erreurs = etat.erreurs?.[nom];
  const idAide = aide ? `${nom}-aide` : undefined;
  const idErreur = erreurs ? `${nom}-erreur` : undefined;

  const classes = cn(
    "w-full rounded-xl border bg-background px-4 text-[15px]",
    "transition-[border-color,box-shadow] duration-150 ease-out",
    "placeholder:text-muted-foreground/70",
    "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
    erreurs
      ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25"
      : "border-input focus-visible:border-ring",
    multiligne ? "min-h-36 resize-y py-3 leading-relaxed" : "h-12",
  );

  return (
    <div className={multiligne ? undefined : "min-w-0"}>
      <label htmlFor={nom} className="mb-2 block text-sm font-medium">
        {libelle}
        {facultatif && (
          <span className="ml-1.5 font-normal text-muted-foreground">(facultatif)</span>
        )}
      </label>

      {multiligne ? (
        <textarea
          id={nom}
          name={nom}
          required={requis}
          placeholder={placeholder}
          defaultValue={etat.valeurs?.[nom]}
          aria-invalid={erreurs ? true : undefined}
          aria-describedby={[idAide, idErreur].filter(Boolean).join(" ") || undefined}
          className={classes}
        />
      ) : (
        <input
          id={nom}
          name={nom}
          type={type}
          required={requis}
          autoComplete={autoComplete}
          placeholder={placeholder}
          defaultValue={etat.valeurs?.[nom]}
          aria-invalid={erreurs ? true : undefined}
          aria-describedby={[idAide, idErreur].filter(Boolean).join(" ") || undefined}
          className={classes}
        />
      )}

      {aide && !erreurs && (
        <p id={idAide} className="mt-2 text-xs text-muted-foreground">
          {aide}
        </p>
      )}

      {erreurs && (
        <p id={idErreur} className="mt-2 text-xs text-destructive">
          {erreurs[0]}
        </p>
      )}
    </div>
  );
}

function Liste({
  nom,
  libelle,
  options,
  etat,
}: {
  nom: string;
  libelle: string;
  options: string[];
  etat: EtatFormulaire;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={nom} className="mb-2 block text-sm font-medium">
        {libelle}
      </label>
      {/* Un `<select>` natif plutôt qu'un composant : sur mobile il ouvre la
          roulette du système, que tout le monde sait manipuler. */}
      <select
        id={nom}
        name={nom}
        defaultValue={etat.valeurs?.[nom] ?? ""}
        className={cn(
          "h-12 w-full rounded-xl border border-input bg-background px-3.5 text-[15px]",
          "transition-[border-color,box-shadow] duration-150 ease-out",
          "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        )}
      >
        <option value="">À préciser</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * La confirmation.
 *
 * Elle remplace le formulaire au lieu de s'afficher au-dessus : le visiteur a
 * terminé, lui laisser le formulaire sous les yeux l'inviterait à renvoyer.
 */
function Confirmation({ message, className }: { message?: string; className?: string }) {
  return (
    <div
      role="status"
      className={cn(
        "rounded-2xl border border-bleu-200 bg-bleu-50 p-8 text-center dark:border-bleu-800 dark:bg-bleu-950/40",
        className,
      )}
    >
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
        <Check className="size-6" strokeWidth={2.5} aria-hidden="true" />
      </span>

      <h2 className="mt-5 text-xl font-semibold">Demande envoyée</h2>

      <p className="mx-auto mt-3 max-w-md leading-relaxed text-balance text-muted-foreground">
        {message}
      </p>
    </div>
  );
}
