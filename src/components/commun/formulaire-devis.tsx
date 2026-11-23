"use client";

import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { Turnstile } from "@/components/commun/turnstile";
import { TuileIcone } from "@/components/rgm/primitives";
import { envoyerDemandeDevis, type EtatDevis } from "@/lib/actions/devis";

// Ici et pas dans `actions/devis.ts` : un fichier « use server » ne peut
// exporter que des fonctions async, un objet y fait planter l'action en prod.
const ETAT_INITIAL: EtatDevis = { statut: "inerte" };
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
    <form action={action} className={cn("flex flex-col gap-5", className)} noValidate>
      <ChampsCaches />

      {etat.statut === "erreur" && etat.message && (
        <p
          role="alert"
          className="rounded-[10px] border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {etat.message}
        </p>
      )}

      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <Champ
          nom="nom"
          libelle="Votre nom"
          requis
          autoComplete="name"
          etat={etat}
        />
        <Champ
          nom="email"
          libelle="Email"
          type="email"
          requis
          autoComplete="email"
          etat={etat}
        />
        <Champ
          nom="telephone"
          libelle="Téléphone"
          type="tel"
          autoComplete="tel"
          etat={etat}
        />
        <Champ
          nom="entreprise"
          libelle="Entreprise"
          autoComplete="organization"
          etat={etat}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Liste nom="type_projet" libelle="Type de projet *" options={TYPES_PROJET} etat={etat} />
        <Liste nom="budget" libelle="Budget envisagé" options={BUDGETS} etat={etat} />
        <Liste nom="echeance" libelle="Échéance" options={ECHEANCES} etat={etat} />
      </div>

      <Champ
        nom="message"
        libelle="Votre projet"
        requis
        etat={etat}
        multiligne
        placeholder="Décrivez votre besoin en quelques lignes"
      />

      <Turnstile action="devis" reinitialiser={etat} />

      <button
        type="submit"
        disabled={enCours}
        className="inline-flex h-9 w-full items-center justify-center gap-1 rounded-full px-2.5 text-sm font-medium text-[#fafafa] transition-opacity duration-150 disabled:opacity-70"
        style={{
          backgroundImage:
            "url(/figma/images/texture-bouton.png), linear-gradient(176deg, #2244bb 8.1%, #2453cd 39.8%, #2460de 69.9%, #1d54d5 89.4%)",
          backgroundSize: "100px 100px, auto",
        }}
      >
        {enCours ? (
          <>
            <Loader2 className="size-4 animate-spin" strokeWidth={2} aria-hidden="true" />
            Envoi…
          </>
        ) : (
          "Envoyer la demande"
        )}
      </button>
      <p className="text-xs">
        Protection anti-spam · Cloudflare Turnstile ·{" "}
        <a href="/confidentialite" className="underline underline-offset-2">
          Vos données
        </a>
      </p>
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
    "w-full rounded-[10px] border bg-white px-2.5 text-sm",
    "transition-[border-color,box-shadow] duration-150 ease-out",
    "placeholder:text-[#1a1a1a]/60",
    "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
    erreurs
      ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25"
      : "border-input focus-visible:border-ring",
    multiligne ? "h-[140px] resize-y py-2 leading-relaxed" : "h-8",
  );

  return (
    <div className={multiligne ? undefined : "min-w-0"}>
      <label htmlFor={nom} className="mb-2 block text-sm font-medium">
        {libelle}
        {requis ? " *" : null}
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
        <p id={idAide} className="mt-2 text-xs">
          {aide}
        </p>
      )}

      {erreurs && (
        <p id={idErreur} className="mt-2 text-xs font-medium text-destructive">
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
          "h-9 w-full rounded-[8px] border border-input bg-white px-2.5 text-sm",
          "transition-[border-color,box-shadow] duration-150 ease-out",
          "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        )}
      >
        <option value="">Choisir…</option>
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
function Confirmation({ className }: { message?: string; className?: string }) {
  return (
    <div role="status" className={cn("flex flex-col items-center gap-5 px-4 py-16 text-center md:py-24", className)}>
      <TuileIcone nom="tick-square" taille={28} className="rounded-[16px] p-[14px]" />
      <h2 className="text-[32px] font-bold md:text-[40px]">Demande envoyée</h2>
      <p className="text-base">Merci. Je vous réponds par email avec un devis.</p>
      <div className="flex flex-wrap justify-center gap-2.5 pt-3">
        <Link href="/realisations" className="inline-flex h-9 items-center rounded-full bg-primary px-2.5 text-sm font-medium text-primary-foreground">
          Voir les réalisations
        </Link>
        <Link href="/" className="inline-flex h-9 items-center rounded-full border border-border bg-white px-2.5 text-sm font-medium">
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
