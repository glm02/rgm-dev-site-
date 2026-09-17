import type { Offre, UnitePrix } from "./types";

/**
 * Mise en forme des prix, des dates et des durées.
 *
 * Un seul endroit, pour que « à partir de 1 500 € » s'écrive pareil sur la page
 * tarifs, sur une fiche projet et dans un email.
 */

const EUROS = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function euros(montant: number): string {
  return EUROS.format(montant);
}

const SUFFIXE: Record<UnitePrix, string> = {
  forfait: "",
  mois: " / mois",
  jour: " / jour",
  heure: " / heure",
};

/**
 * La fourchette d'une offre, telle qu'elle s'affiche.
 *
 * Une borne haute absente ne veut pas dire « gratuit au-delà » : on écrit
 * « à partir de », qui est ce que ça signifie vraiment.
 */
export function fourchette(offre: Pick<Offre, "prix_min" | "prix_max" | "unite">): string {
  const suffixe = SUFFIXE[offre.unite];

  if (offre.prix_max == null || offre.prix_max === offre.prix_min) {
    return `à partir de ${euros(offre.prix_min)}${suffixe}`;
  }

  return `${euros(offre.prix_min)} – ${euros(offre.prix_max)}${suffixe}`;
}

/** La fourchette d'un projet livré, ou `null` s'il n'y a rien à annoncer. */
export function fourchetteProjet(
  prixMin: number | null,
  prixMax: number | null,
): string | null {
  if (prixMin == null) return null;
  if (prixMax == null || prixMax === prixMin) return euros(prixMin);
  return `${euros(prixMin)} – ${euros(prixMax)}`;
}

export function duree(jours: number | null): string | null {
  if (jours == null) return null;
  if (jours < 7) return `${jours} jours`;

  const semaines = Math.round(jours / 5);
  if (semaines < 9) return `${semaines} semaines`;

  return `${Math.round(jours / 21)} mois`;
}

const DATE_LONGUE = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const DATE_COURTE = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function dateLongue(valeur: string | Date | null): string {
  if (!valeur) return "—";
  return DATE_LONGUE.format(new Date(valeur));
}

export function dateCourte(valeur: string | Date | null): string {
  if (!valeur) return "—";
  return DATE_COURTE.format(new Date(valeur));
}

/** « il y a 3 jours ». Utile dans le tableau de bord admin. */
export function depuis(valeur: string | Date | null): string {
  if (!valeur) return "—";

  const secondes = (Date.now() - new Date(valeur).getTime()) / 1000;
  const relatif = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });

  const paliers: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [604800, "day"],
    [2629800, "week"],
    [31557600, "month"],
  ];

  let precedent = 1;
  for (const [limite, unite] of paliers) {
    if (secondes < limite) {
      return relatif.format(-Math.round(secondes / precedent), unite);
    }
    precedent = limite;
  }

  return relatif.format(-Math.round(secondes / 31557600), "year");
}

/** Moyenne des notes, arrondie au dixième. `null` s'il n'y a pas d'avis. */
export function moyenne(notes: number[]): number | null {
  if (notes.length === 0) return null;
  const somme = notes.reduce((total, note) => total + note, 0);
  return Math.round((somme / notes.length) * 10) / 10;
}

/**
 * Les calculs relatifs à « maintenant ».
 *
 * Sortis des composants : lire l'horloge pendant un rendu le rend impur, et
 * React (règle `react-hooks/purity`) le signale à raison.
 */
export function ilYA(jours: number): string {
  return new Date(Date.now() - jours * 86_400_000).toISOString();
}

/** Jours entiers restants avant une date (négatif si elle est passée). */
export function joursAvant(valeur: string | Date): number {
  return Math.floor((new Date(valeur).getTime() - Date.now()) / 86_400_000);
}
