import { STATUT_PROSPECT } from "./libelles";
import type { Activite, Prospect, StatutProspect } from "./types";

/**
 * Les calculs du CRM.
 *
 * Tout est fait côté serveur, à partir de la liste déjà chargée : le pipeline
 * d'un freelance tient en quelques centaines de lignes, et une requête SQL par
 * filtre coûterait plus cher que de trier en mémoire. Si ça devait grossir,
 * c'est ici qu'on remonterait les filtres dans la requête.
 */

export type TriCrm = "valeur" | "ponderee" | "relance" | "activite" | "nom" | "probabilite";

export type FiltresCrm = {
  /** Une étape précise, ou `ouvert` (tout sauf gagné et perdu), ou `tous`. */
  etape: StatutProspect | "ouvert" | "tous";
  source: string;
  tri: TriCrm;
  /** Fenêtre d'activité en jours ; 0 = sans limite. */
  fenetre: number;
  recherche: string;
};

export const FILTRES_PAR_DEFAUT: FiltresCrm = {
  etape: "ouvert",
  source: "toutes",
  tri: "ponderee",
  fenetre: 0,
  recherche: "",
};

const TRIS: TriCrm[] = ["valeur", "ponderee", "relance", "activite", "nom", "probabilite"];

const ETAPES = Object.keys(STATUT_PROSPECT) as StatutProspect[];

/** Lit les filtres depuis l'URL. Toute valeur inconnue retombe sur le défaut. */
export function lireFiltres(params: Record<string, string | string[] | undefined>): FiltresCrm {
  const seul = (clef: string) => {
    const valeur = params[clef];
    return (Array.isArray(valeur) ? valeur[0] : valeur)?.trim() ?? "";
  };

  const etape = seul("etape");
  const tri = seul("tri");
  const fenetre = Number(seul("fenetre"));

  return {
    etape:
      etape === "tous" || ETAPES.includes(etape as StatutProspect)
        ? (etape as FiltresCrm["etape"])
        : FILTRES_PAR_DEFAUT.etape,
    source: seul("source") || FILTRES_PAR_DEFAUT.source,
    tri: TRIS.includes(tri as TriCrm) ? (tri as TriCrm) : FILTRES_PAR_DEFAUT.tri,
    fenetre: Number.isFinite(fenetre) && fenetre > 0 ? fenetre : 0,
    recherche: seul("q"),
  };
}

/** Combien de filtres s'écartent du réglage par défaut — pour la pastille de la barre d'outils. */
export function filtresActifs(filtres: FiltresCrm): number {
  return [
    filtres.etape !== FILTRES_PAR_DEFAUT.etape,
    filtres.source !== FILTRES_PAR_DEFAUT.source,
    filtres.fenetre !== FILTRES_PAR_DEFAUT.fenetre,
    filtres.recherche !== "",
  ].filter(Boolean).length;
}

/** La valeur de l'affaire pondérée par sa probabilité : ce qu'on peut raisonnablement attendre. */
export function valeurPonderee(prospect: Prospect): number {
  return ((prospect.valeur_estimee ?? 0) * prospect.probabilite) / 100;
}

export function estOuvert(prospect: Prospect): boolean {
  return STATUT_PROSPECT[prospect.statut].ouvert;
}

/** Nombre de jours depuis la dernière activité. */
export function joursSansNouvelles(prospect: Prospect, maintenant = Date.now()): number {
  return Math.max(
    0,
    Math.floor((maintenant - new Date(prospect.derniere_activite_le).getTime()) / 86_400_000),
  );
}

/** Une relance est due si sa date est passée ou tombe aujourd'hui. */
export function relanceDue(prospect: Prospect, aujourdHui: string): boolean {
  return Boolean(prospect.relance_le) && prospect.relance_le! <= aujourdHui && estOuvert(prospect);
}

export function filtrerProspects(
  prospects: Prospect[],
  filtres: FiltresCrm,
  maintenant = Date.now(),
): Prospect[] {
  const recherche = filtres.recherche.toLowerCase();

  const retenus = prospects.filter((prospect) => {
    if (filtres.etape === "ouvert" && !estOuvert(prospect)) return false;
    if (filtres.etape !== "ouvert" && filtres.etape !== "tous" && prospect.statut !== filtres.etape) {
      return false;
    }
    if (filtres.source !== "toutes" && (prospect.source ?? "site") !== filtres.source) return false;
    if (filtres.fenetre > 0 && joursSansNouvelles(prospect, maintenant) > filtres.fenetre) return false;
    if (recherche) {
      const foin = [prospect.contact, prospect.entreprise, prospect.email, prospect.ville, prospect.besoin]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!foin.includes(recherche)) return false;
    }
    return true;
  });

  return retenus.sort((a, b) => {
    switch (filtres.tri) {
      case "valeur":
        return (b.valeur_estimee ?? 0) - (a.valeur_estimee ?? 0);
      case "probabilite":
        return b.probabilite - a.probabilite;
      case "nom":
        return (a.entreprise ?? a.contact).localeCompare(b.entreprise ?? b.contact, "fr");
      case "activite":
        return b.derniere_activite_le.localeCompare(a.derniere_activite_le);
      case "relance":
        // Les affaires sans relance prévue passent en dernier : ce tri sert à
        // savoir qui rappeler, pas à lister tout le monde.
        if (!a.relance_le) return b.relance_le ? 1 : 0;
        if (!b.relance_le) return -1;
        return a.relance_le.localeCompare(b.relance_le);
      default:
        return valeurPonderee(b) - valeurPonderee(a);
    }
  });
}

export type ResumePipeline = {
  ouvertes: number;
  valeur: number;
  ponderee: number;
  gagnees: number;
  perdues: number;
  chiffreGagne: number;
  /** Part des affaires tranchées qui ont été gagnées, en %. */
  tauxConversion: number | null;
  /** Panier moyen des affaires gagnées, en euros. */
  panierMoyen: number | null;
  etapes: { statut: StatutProspect; nombre: number; valeur: number }[];
};

export function resumePipeline(prospects: Prospect[]): ResumePipeline {
  const ouvertes = prospects.filter(estOuvert);
  const gagnees = prospects.filter((p) => p.statut === "gagne");
  const perdues = prospects.filter((p) => p.statut === "perdu");
  const tranchees = gagnees.length + perdues.length;
  const chiffreGagne = gagnees.reduce((total, p) => total + (p.valeur_estimee ?? 0), 0);
  const chiffrees = gagnees.filter((p) => p.valeur_estimee != null);

  return {
    ouvertes: ouvertes.length,
    valeur: ouvertes.reduce((total, p) => total + (p.valeur_estimee ?? 0), 0),
    ponderee: ouvertes.reduce((total, p) => total + valeurPonderee(p), 0),
    gagnees: gagnees.length,
    perdues: perdues.length,
    chiffreGagne,
    tauxConversion: tranchees > 0 ? Math.round((gagnees.length / tranchees) * 100) : null,
    panierMoyen: chiffrees.length > 0 ? chiffreGagne / chiffrees.length : null,
    etapes: (Object.keys(STATUT_PROSPECT) as StatutProspect[])
      .filter((statut) => STATUT_PROSPECT[statut].ouvert)
      .map((statut) => {
        const lot = prospects.filter((p) => p.statut === statut);
        return {
          statut,
          nombre: lot.length,
          valeur: lot.reduce((total, p) => total + (p.valeur_estimee ?? 0), 0),
        };
      }),
  };
}

/**
 * Le nombre d'échanges par semaine, de la plus ancienne à cette semaine.
 *
 * Sert de petite courbe de tendance : une affaire sans barre depuis trois
 * semaines se voit d'un coup d'œil dans la liste.
 */
export function tendanceActivite(
  activites: Pick<Activite, "fait_le">[],
  semaines = 12,
  maintenant = Date.now(),
): number[] {
  const seaux = Array.from({ length: semaines }, () => 0);
  for (const activite of activites) {
    const ecart = Math.floor((maintenant - new Date(activite.fait_le).getTime()) / (7 * 86_400_000));
    if (ecart >= 0 && ecart < semaines) seaux[semaines - 1 - ecart] += 1;
  }
  return seaux;
}

/** Le tableau tel qu'il part dans un tableur. Point-virgule : c'est ce qu'attend Excel en français. */
export function lignesCsv(prospects: Prospect[]): string {
  const entetes = [
    "Contact",
    "Entreprise",
    "Email",
    "Téléphone",
    "Ville",
    "Besoin",
    "Source",
    "Étape",
    "Valeur estimée",
    "Probabilité",
    "Valeur pondérée",
    "Relance le",
    "Dernière activité",
  ];

  const cellule = (valeur: string | number | null) => {
    const texte = valeur === null ? "" : String(valeur);
    return /[";\n]/.test(texte) ? `"${texte.replaceAll('"', '""')}"` : texte;
  };

  const lignes = prospects.map((p) =>
    [
      p.contact,
      p.entreprise,
      p.email,
      p.telephone,
      p.ville,
      p.besoin,
      p.source,
      STATUT_PROSPECT[p.statut].libelle,
      p.valeur_estimee,
      `${p.probabilite} %`,
      Math.round(valeurPonderee(p)),
      p.relance_le,
      p.derniere_activite_le.slice(0, 10),
    ]
      .map(cellule)
      .join(";"),
  );

  // Le BOM évite les « Ã© » quand Excel ouvre le fichier sans se poser de question.
  return `﻿${[entetes.join(";"), ...lignes].join("\r\n")}\r\n`;
}
