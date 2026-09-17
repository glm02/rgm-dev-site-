import { CircleAlert, CircleCheck } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Les briques de formulaire de l'administration.
 *
 * Composants serveur : les formulaires admin sont de simples `<form action>`
 * branchés sur des Server Actions. Seuls les boutons qui ont besoin d'un état
 * (envoi en cours, confirmation) sont des composants client, dans
 * `boutons.tsx`.
 */

const CLASSE_CHAMP = cn(
  "w-full rounded-lg border border-input bg-background px-3 text-sm",
  "transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground/70",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
);

type Commun = {
  nom: string;
  libelle: string;
  aide?: string;
  className?: string;
};

export function Champ({
  nom,
  libelle,
  aide,
  className,
  type = "text",
  valeur,
  requis,
  placeholder,
}: Commun & {
  type?: string;
  valeur?: string | number | null;
  requis?: boolean;
  placeholder?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={nom} className="mb-1.5 block text-sm font-medium">
        {libelle}
      </label>
      <input
        id={nom}
        name={nom}
        type={type}
        required={requis}
        placeholder={placeholder}
        defaultValue={valeur ?? ""}
        className={cn(CLASSE_CHAMP, "h-10")}
      />
      {aide && <p className="mt-1.5 text-xs text-muted-foreground">{aide}</p>}
    </div>
  );
}

export function ZoneTexte({
  nom,
  libelle,
  aide,
  className,
  valeur,
  lignes = 4,
  requis,
  placeholder,
  mono,
}: Commun & {
  valeur?: string | null;
  lignes?: number;
  requis?: boolean;
  placeholder?: string;
  /** Police à chasse fixe, pour le Markdown des articles. */
  mono?: boolean;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={nom} className="mb-1.5 block text-sm font-medium">
        {libelle}
      </label>
      <textarea
        id={nom}
        name={nom}
        rows={lignes}
        required={requis}
        placeholder={placeholder}
        defaultValue={valeur ?? ""}
        className={cn(CLASSE_CHAMP, "resize-y py-2 leading-relaxed", mono && "font-mono text-[13px]")}
      />
      {aide && <p className="mt-1.5 text-xs text-muted-foreground">{aide}</p>}
    </div>
  );
}

export function Liste({
  nom,
  libelle,
  aide,
  className,
  valeur,
  options,
  vide,
}: Commun & {
  valeur?: string | null;
  options: { valeur: string; libelle: string }[];
  /** Libellé d'une option vide en tête, si le champ est facultatif. */
  vide?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={nom} className="mb-1.5 block text-sm font-medium">
        {libelle}
      </label>
      <select id={nom} name={nom} defaultValue={valeur ?? ""} className={cn(CLASSE_CHAMP, "h-10")}>
        {vide !== undefined && <option value="">{vide}</option>}
        {options.map((option) => (
          <option key={option.valeur} value={option.valeur}>
            {option.libelle}
          </option>
        ))}
      </select>
      {aide && <p className="mt-1.5 text-xs text-muted-foreground">{aide}</p>}
    </div>
  );
}

export function Case({
  nom,
  libelle,
  aide,
  coche,
}: {
  nom: string;
  libelle: string;
  aide?: string;
  coche?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-[background-color] duration-150 ease-out hover:bg-secondary/60">
      <input
        type="checkbox"
        name={nom}
        defaultChecked={coche}
        className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
      />
      <span>
        <span className="block text-sm font-medium">{libelle}</span>
        {aide && <span className="mt-0.5 block text-xs text-muted-foreground">{aide}</span>}
      </span>
    </label>
  );
}

/**
 * Le retour d'une action, lu dans l'URL (`?ok=` / `?erreur=`).
 *
 * Posé en tête de chaque page admin. `role="status"` ou `role="alert"` : le
 * résultat est annoncé aux lecteurs d'écran, pas seulement affiché.
 */
export function Bandeau({ ok, erreur }: { ok?: string | string[]; erreur?: string | string[] }) {
  const message = (valeur?: string | string[]) => (Array.isArray(valeur) ? valeur[0] : valeur);
  const succes = message(ok);
  const echec = message(erreur);

  if (echec) {
    return (
      <p
        role="alert"
        className="mb-6 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        <CircleAlert className="mt-px size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
        {echec}
      </p>
    );
  }

  if (succes) {
    return (
      <p
        role="status"
        className="mb-6 flex items-start gap-2.5 rounded-xl border border-bleu-200 bg-bleu-50 px-4 py-3 text-sm text-bleu-800 dark:border-bleu-800 dark:bg-bleu-950/40 dark:text-bleu-200"
      >
        <CircleCheck className="mt-px size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
        {succes}
      </p>
    );
  }

  return null;
}

/**
 * Un champ de dépôt de fichier.
 *
 * Laissé vide, il n'écrase rien : l'action ne remplace l'image ou le document
 * existant que si un fichier a vraiment été choisi.
 */
export function ChampFichier({
  nom,
  libelle,
  aide,
  accept,
  className,
}: {
  nom: string;
  libelle: string;
  aide?: string;
  accept?: string;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={nom} className="mb-1.5 block text-sm font-medium">
        {libelle}
      </label>
      <input
        id={nom}
        name={nom}
        type="file"
        accept={accept}
        className={cn(
          "block w-full cursor-pointer rounded-lg border border-dashed border-input bg-background text-sm",
          "file:mr-3 file:cursor-pointer file:border-0 file:bg-bleu-50 file:px-3 file:py-2.5 file:text-sm file:font-medium file:text-bleu-700",
          "transition-[border-color] duration-150 ease-out hover:border-bleu-300",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
          "dark:file:bg-bleu-950 dark:file:text-bleu-200",
        )}
      />
      <p className="mt-1.5 text-xs text-muted-foreground">
        {aide ? `${aide} ` : ""}4 Mo maximum.
      </p>
    </div>
  );
}
