import type {
  StatutDemande,
  StatutDocument,
  StatutJalon,
  StatutMission,
  StatutProspect,
  TypeActivite,
  TypeAlerte,
  TypeDocument,
} from "./types";

/**
 * Les libellés des valeurs d'énumération.
 *
 * La base parle en `devis_envoye` ; l'interface en « Devis envoyé ». Un seul
 * endroit pour la traduction, et `Record<…>` garantit qu'une valeur ajoutée
 * au schéma sans libellé fait échouer la compilation.
 */

/** Le ton d'un badge : neutre, en cours, réussi, attention, échec. */
export type Ton = "neutre" | "bleu" | "succes" | "attention" | "echec";

export const STATUT_MISSION: Record<StatutMission, { libelle: string; ton: Ton }> = {
  cadrage: { libelle: "Cadrage", ton: "neutre" },
  en_cours: { libelle: "En cours", ton: "bleu" },
  revue: { libelle: "En relecture", ton: "attention" },
  livre: { libelle: "Livré", ton: "succes" },
  maintenance: { libelle: "Maintenance", ton: "succes" },
  suspendu: { libelle: "Suspendu", ton: "echec" },
};

export const STATUT_JALON: Record<StatutJalon, { libelle: string; ton: Ton }> = {
  a_faire: { libelle: "À venir", ton: "neutre" },
  en_cours: { libelle: "En cours", ton: "bleu" },
  fait: { libelle: "Terminé", ton: "succes" },
  bloque: { libelle: "Bloqué", ton: "echec" },
};

export const TYPE_DOCUMENT: Record<TypeDocument, string> = {
  devis: "Devis",
  facture: "Facture",
  livrable: "Livrable",
  contrat: "Contrat",
  autre: "Document",
};

export const STATUT_DOCUMENT: Record<StatutDocument, { libelle: string; ton: Ton }> = {
  brouillon: { libelle: "Brouillon", ton: "neutre" },
  envoye: { libelle: "Envoyé", ton: "bleu" },
  accepte: { libelle: "Accepté", ton: "succes" },
  refuse: { libelle: "Refusé", ton: "echec" },
  paye: { libelle: "Payé", ton: "succes" },
};

export const STATUT_DEMANDE: Record<StatutDemande, { libelle: string; ton: Ton }> = {
  nouveau: { libelle: "Nouvelle", ton: "bleu" },
  contacte: { libelle: "Contacté", ton: "attention" },
  devis_envoye: { libelle: "Devis envoyé", ton: "attention" },
  gagne: { libelle: "Gagnée", ton: "succes" },
  perdu: { libelle: "Perdue", ton: "echec" },
};

/**
 * Les étapes du pipeline, dans l'ordre où on les traverse.
 *
 * `probabilite` est la valeur proposée quand on fait avancer une affaire : on
 * peut toujours la corriger à la main, mais partir de zéro à chaque fois
 * donnerait un pipeline pondéré faux.
 */
export const STATUT_PROSPECT: Record<
  StatutProspect,
  { libelle: string; ton: Ton; probabilite: number; ouvert: boolean }
> = {
  nouveau: { libelle: "Nouveau", ton: "bleu", probabilite: 20, ouvert: true },
  qualifie: { libelle: "Qualifié", ton: "bleu", probabilite: 40, ouvert: true },
  devis_envoye: { libelle: "Devis envoyé", ton: "attention", probabilite: 60, ouvert: true },
  negociation: { libelle: "En négociation", ton: "attention", probabilite: 80, ouvert: true },
  gagne: { libelle: "Gagné", ton: "succes", probabilite: 100, ouvert: false },
  perdu: { libelle: "Perdu", ton: "echec", probabilite: 0, ouvert: false },
};

export const TYPE_ACTIVITE: Record<TypeActivite, { libelle: string; icone: string }> = {
  appel: { libelle: "Appel", icone: "appel" },
  email: { libelle: "Email", icone: "email" },
  rdv: { libelle: "Rendez-vous", icone: "rdv" },
  devis: { libelle: "Devis", icone: "devis" },
  relance: { libelle: "Relance", icone: "relance" },
  note: { libelle: "Note", icone: "note" },
};

export const TYPE_ALERTE: Record<TypeAlerte, { libelle: string; ton: Ton }> = {
  hors_ligne: { libelle: "Hors ligne", ton: "echec" },
  lenteur: { libelle: "Lenteur", ton: "attention" },
  erreur_http: { libelle: "Erreur HTTP", ton: "echec" },
  tls_bientot_expire: { libelle: "Certificat bientôt expiré", ton: "attention" },
  retour_en_ligne: { libelle: "Retour en ligne", ton: "succes" },
};
