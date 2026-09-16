/**
 * Les types du domaine.
 *
 * Écrits à la main tant que le projet Supabase n'existe pas. Dès qu'il est
 * créé, on les remplace par la génération automatique :
 *
 *   npx supabase gen types typescript --project-id <id> > src/lib/database.types.ts
 *
 * Ils suivent exactement `supabase/migrations/0001_schema.sql`. Si l'un des
 * deux change, l'autre change aussi.
 */

export type Role = "admin" | "client";
export type UnitePrix = "forfait" | "mois" | "jour" | "heure";
export type StatutDemande =
  | "nouveau"
  | "contacte"
  | "devis_envoye"
  | "gagne"
  | "perdu";
export type StatutMission =
  | "cadrage"
  | "en_cours"
  | "revue"
  | "livre"
  | "maintenance"
  | "suspendu";
export type StatutJalon = "a_faire" | "en_cours" | "fait" | "bloque";
export type TypeDocument = "devis" | "facture" | "livrable" | "contrat" | "autre";
export type StatutDocument =
  | "brouillon"
  | "envoye"
  | "accepte"
  | "refuse"
  | "paye";
export type TypeAlerte =
  | "hors_ligne"
  | "lenteur"
  | "erreur_http"
  | "tls_bientot_expire"
  | "retour_en_ligne";

export type Profil = {
  id: string;
  email: string;
  nom: string | null;
  entreprise: string | null;
  telephone: string | null;
  avatar_url: string | null;
  role: Role;
  cree_le: string;
};

export type Service = {
  id: string;
  slug: string;
  titre: string;
  accroche: string;
  description: string | null;
  icone: string | null;
  ordre: number;
  actif: boolean;
  seo_titre: string | null;
  seo_description: string | null;
};

export type Offre = {
  id: string;
  service_id: string | null;
  nom: string;
  description: string | null;
  prix_min: number;
  prix_max: number | null;
  unite: UnitePrix;
  delai: string | null;
  inclus: string[];
  en_vedette: boolean;
  ordre: number;
  actif: boolean;
};

export type Projet = {
  id: string;
  slug: string;
  titre: string;
  client_nom: string | null;
  secteur: string | null;
  resume: string;
  probleme: string | null;
  solution: string | null;
  resultat: string | null;
  stack: string[];
  url_live: string | null;
  url_depot: string | null;
  image_couverture: string | null;
  images: string[];
  prix_min: number | null;
  prix_max: number | null;
  duree_jours: number | null;
  livre_le: string | null;
  en_vedette: boolean;
  publie: boolean;
  ordre: number;
  seo_titre: string | null;
  seo_description: string | null;
};

export type Avis = {
  id: string;
  projet_id: string | null;
  profil_id: string | null;
  auteur_nom: string;
  auteur_role: string | null;
  auteur_entreprise: string | null;
  auteur_avatar: string | null;
  note: number;
  contenu: string;
  source: string;
  publie: boolean;
  en_vedette: boolean;
  cree_le: string;
};

export type Article = {
  id: string;
  slug: string;
  titre: string;
  chapo: string | null;
  contenu: string;
  image: string | null;
  tags: string[];
  temps_lecture: number | null;
  publie: boolean;
  publie_le: string | null;
  seo_titre: string | null;
  seo_description: string | null;
};

export type DemandeDevis = {
  id: string;
  nom: string;
  email: string;
  telephone: string | null;
  entreprise: string | null;
  type_projet: string | null;
  budget: string | null;
  echeance: string | null;
  message: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  page_origine: string | null;
  statut: StatutDemande;
  note_interne: string | null;
  cree_le: string;
};

export type Mission = {
  id: string;
  profil_id: string;
  titre: string;
  description: string | null;
  statut: StatutMission;
  avancement: number;
  montant: number | null;
  debut_le: string | null;
  fin_prevue_le: string | null;
  url_live: string | null;
  cree_le: string;
};

export type Jalon = {
  id: string;
  mission_id: string;
  titre: string;
  description: string | null;
  statut: StatutJalon;
  ordre: number;
  prevu_le: string | null;
  fait_le: string | null;
};

export type Document = {
  id: string;
  mission_id: string;
  type: TypeDocument;
  titre: string;
  url: string | null;
  reference: string | null;
  montant: number | null;
  statut: StatutDocument;
  echeance_le: string | null;
  cree_le: string;
};

export type Message = {
  id: string;
  mission_id: string;
  auteur_id: string;
  contenu: string;
  lu_le: string | null;
  cree_le: string;
};

export type SiteSupervise = {
  id: string;
  projet_id: string | null;
  nom: string;
  url: string;
  actif: boolean;
  statut_attendu: number;
  seuil_lenteur_ms: number;
  tls_expire_le: string | null;
  dernier_controle_le: string | null;
  dernier_ok: boolean | null;
};

export type Controle = {
  id: string;
  site_id: string;
  ok: boolean;
  statut_http: number | null;
  temps_ms: number | null;
  erreur: string | null;
  verifie_le: string;
};

export type Alerte = {
  id: string;
  site_id: string;
  type: TypeAlerte;
  message: string;
  notifiee_le: string | null;
  resolue_le: string | null;
  cree_le: string;
};

/** Une offre telle qu'on l'affiche : jointe à son service. */
export type OffreAvecService = Offre & {
  services: Pick<Service, "slug" | "titre"> | null;
};

/** Un avis tel qu'on l'affiche : joint au projet qu'il concerne. */
export type AvisAvecProjet = Avis & {
  projets: Pick<Projet, "slug" | "titre"> | null;
};
