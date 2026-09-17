"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { AccesRefuse, exigerAdmin } from "@/lib/auth";
import { PREFIXE_STOCKAGE, deposerFichier, deposerImage, fichierFourni } from "@/lib/stockage";
import { executerSupervision } from "@/lib/supervision";

/**
 * Les actions de l'administration — le CRUD qui tient lieu de CMS.
 *
 * Convention commune :
 * - chaque action commence par `exigerAdmin()` : joignable par POST direct,
 *   elle ne fait confiance à rien de ce qu'affiche la page ;
 * - elle se termine par une redirection vers la page d'origine, avec `?ok=` ou
 *   `?erreur=`. Le résultat s'affiche donc même sans JavaScript, et un
 *   rechargement ne rejoue pas l'envoi du formulaire.
 *
 * `redirect()` fonctionne en levant une exception : il est toujours appelé
 * **hors** des `try`, sinon le `catch` l'avalerait.
 */

/** `vers` remplace la page de retour en cas de succès (ex. : le projet tout juste créé). */
type Resultat = { ok: string; vers?: string } | { erreur: string };

function revenir(chemin: string, resultat: Resultat): never {
  const [base, fragment] = ("ok" in resultat && resultat.vers ? resultat.vers : chemin).split("#");
  const url = new URL(base, "http://x");
  url.searchParams.delete("ok");
  url.searchParams.delete("erreur");
  if ("ok" in resultat) url.searchParams.set("ok", resultat.ok);
  else url.searchParams.set("erreur", resultat.erreur);
  redirect(`${url.pathname}${url.search}${fragment ? `#${fragment}` : ""}`);
}

async function executer(
  chemin: string,
  aRevalider: string[],
  travail: (session: Awaited<ReturnType<typeof exigerAdmin>>) => Promise<Resultat>,
): Promise<never> {
  let resultat: Resultat;
  try {
    const session = await exigerAdmin();
    resultat = await travail(session);
  } catch (erreur) {
    if (erreur instanceof AccesRefuse) resultat = { erreur: erreur.message };
    else {
      console.error("[admin]", erreur);
      const message =
        erreur && typeof erreur === "object" && "message" in erreur
          ? String((erreur as { message: unknown }).message)
          : "Erreur inconnue";
      resultat = { erreur: `L'enregistrement a échoué : ${message}` };
    }
  }
  if ("ok" in resultat) for (const p of aRevalider) revalidatePath(p);
  revenir(chemin, resultat);
}

const texte = (max = 500) => z.string().trim().max(max);
const texteOptionnel = (max = 500) =>
  z.string().trim().max(max).optional().transform((v) => (v ? v : null));
const entierOptionnel = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? Number(v) : null))
  .refine((v) => v === null || (Number.isInteger(v) && v >= 0), "Nombre entier positif attendu.");
const dateOptionnelle = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null));
const coche = z
  .string()
  .optional()
  .transform((v) => v === "on" || v === "true");
const slug = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Le slug ne contient que des minuscules, chiffres et tirets.");

/** Une liste saisie une valeur par ligne (ou séparée par des virgules). */
const liste = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split(/\r?\n|,/)
      .map((ligne) => ligne.trim())
      .filter(Boolean),
  );

/**
 * Une liste saisie **une valeur par ligne**, virgules comprises : « Connexion à
 * vos outils (mail, CRM, tableur) » est une seule ligne d'offre, pas quatre.
 */
const lignes = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split(/\r?\n/)
      .map((ligne) => ligne.trim())
      .filter(Boolean),
  );

function lire<T extends z.ZodTypeAny>(schema: T, donnees: FormData): z.infer<T> | string {
  const analyse = schema.safeParse(Object.fromEntries(donnees));
  if (analyse.success) return analyse.data;
  const premiere = analyse.error.issues[0];
  return `${premiere.path.join(".") || "formulaire"} : ${premiere.message}`;
}

// ---------------------------------------------------------------------------
// Demandes de devis
// ---------------------------------------------------------------------------

export async function majDemande(donnees: FormData) {
  const schema = z.object({
    id: z.uuid(),
    statut: z.enum(["nouveau", "contacte", "devis_envoye", "gagne", "perdu"]),
    note_interne: texteOptionnel(4000),
  });
  await executer("/admin/demandes", ["/admin", "/admin/demandes"], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };
    const { id, ...champs } = v;
    const { error } = await supabase.from("demandes_devis").update(champs).eq("id", id);
    if (error) throw error;
    return { ok: "Demande mise à jour." };
  });
}

// ---------------------------------------------------------------------------
// Avis
// ---------------------------------------------------------------------------

export async function basculerAvis(donnees: FormData) {
  const schema = z.object({
    id: z.uuid(),
    champ: z.enum(["publie", "en_vedette"]),
    valeur: z.enum(["true", "false"]).transform((v) => v === "true"),
  });
  await executer("/admin/avis", ["/", "/avis", "/admin/avis", "/admin"], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };
    const { error } = await supabase.from("avis").update({ [v.champ]: v.valeur }).eq("id", v.id);
    if (error) throw error;
    return { ok: v.champ === "publie" ? (v.valeur ? "Avis publié." : "Avis retiré.") : "Mise en avant modifiée." };
  });
}

export async function supprimerAvis(donnees: FormData) {
  await executer("/admin/avis", ["/", "/avis", "/admin/avis"], async ({ supabase }) => {
    const id = z.uuid().safeParse(donnees.get("id"));
    if (!id.success) return { erreur: "Identifiant invalide." };
    const { error } = await supabase.from("avis").delete().eq("id", id.data);
    if (error) throw error;
    return { ok: "Avis supprimé." };
  });
}

/**
 * Saisie manuelle d'un avis reçu ailleurs (Google, mail, LinkedIn).
 * La source est obligatoire : un avis saisi à la main doit dire d'où il vient.
 */
export async function ajouterAvis(donnees: FormData) {
  const schema = z.object({
    auteur_nom: texte(120).min(2, "Nom requis."),
    auteur_role: texteOptionnel(120),
    auteur_entreprise: texteOptionnel(160),
    note: z.coerce.number().int().min(1).max(5),
    contenu: texte(2000).min(10, "Texte trop court."),
    source: texte(60).min(2, "Précisez la source (Google, mail…)."),
    projet_id: z
      .string()
      .optional()
      .transform((v) => (v ? v : null)),
  });
  await executer("/admin/avis", ["/admin/avis"], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };
    const { error } = await supabase.from("avis").insert({ ...v, publie: false });
    if (error) throw error;
    return { ok: "Avis ajouté, non publié. Publiez-le après vérification." };
  });
}

// ---------------------------------------------------------------------------
// Réalisations
// ---------------------------------------------------------------------------

export async function enregistrerProjet(donnees: FormData) {
  const schema = z.object({
    id: z.string().optional(),
    slug,
    titre: texte(160).min(2),
    client_nom: texteOptionnel(160),
    secteur: texteOptionnel(120),
    resume: texte(600).min(10, "Résumé trop court."),
    probleme: texteOptionnel(4000),
    solution: texteOptionnel(4000),
    resultat: texteOptionnel(4000),
    stack: liste,
    url_live: texteOptionnel(300),
    url_depot: texteOptionnel(300),
    image_couverture: texteOptionnel(500),
    prix_min: entierOptionnel,
    prix_max: entierOptionnel,
    duree_jours: entierOptionnel,
    livre_le: dateOptionnelle,
    ordre: z.coerce.number().int().default(0),
    en_vedette: coche,
    publie: coche,
    seo_titre: texteOptionnel(160),
    seo_description: texteOptionnel(300),
  });

  const id = String(donnees.get("id") ?? "");
  await executer(
    id ? `/admin/realisations/${id}` : "/admin/realisations/nouveau",
    ["/", "/realisations", "/admin/realisations"],
    async ({ supabase }) => {
      const v = lire(schema, donnees);
      if (typeof v === "string") return { erreur: v };
      const { id: _ignore, ...champs } = v;
      void _ignore;

      // Une capture choisie dans le formulaire remplace le chemin saisi à la main.
      const capture = donnees.get("fichier_image");
      if (fichierFourni(capture)) {
        champs.image_couverture = await deposerImage(supabase, `realisations/${champs.slug}`, capture);
      }

      if (champs.prix_min !== null && champs.prix_max !== null && champs.prix_max < champs.prix_min) {
        return { erreur: "Le prix maximum est inférieur au prix minimum." };
      }

      const requete = id
        ? supabase.from("projets").update(champs).eq("id", id)
        : supabase.from("projets").insert(champs);
      const { error } = await requete;
      if (error) throw error;
      revalidatePath(`/realisations/${champs.slug}`);
      return id ? { ok: "Réalisation enregistrée." } : { ok: "Réalisation créée.", vers: "/admin/realisations" };
    },
  );
}

export async function supprimerProjet(donnees: FormData) {
  await executer("/admin/realisations", ["/", "/realisations", "/admin/realisations"], async ({ supabase }) => {
    const id = z.uuid().safeParse(donnees.get("id"));
    if (!id.success) return { erreur: "Identifiant invalide." };
    const { error } = await supabase.from("projets").delete().eq("id", id.data);
    if (error) throw error;
    return { ok: "Réalisation supprimée." };
  });
}

// ---------------------------------------------------------------------------
// Services et offres
// ---------------------------------------------------------------------------

export async function enregistrerService(donnees: FormData) {
  const schema = z.object({
    id: z.uuid(),
    titre: texte(160).min(2),
    accroche: texte(300).min(5),
    description: texteOptionnel(4000),
    image: texteOptionnel(500),
    ordre: z.coerce.number().int().default(0),
    actif: coche,
    seo_titre: texteOptionnel(160),
    seo_description: texteOptionnel(300),
  });
  await executer("/admin/offres", ["/", "/services", "/tarifs", "/admin/offres"], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };
    const { id, ...champs } = v;
    const illustration = donnees.get("fichier_image");
    if (fichierFourni(illustration)) {
      champs.image = await deposerImage(supabase, "services", illustration);
    }
    const { error } = await supabase.from("services").update(champs).eq("id", id);
    if (error) throw error;
    return { ok: "Service enregistré." };
  });
}

export async function enregistrerOffre(donnees: FormData) {
  const schema = z.object({
    id: z.string().optional(),
    service_id: z.uuid("Choisissez un service."),
    nom: texte(120).min(2),
    description: texteOptionnel(600),
    prix_min: z.coerce.number().int().min(0),
    prix_max: entierOptionnel,
    unite: z.enum(["forfait", "mois", "jour", "heure"]),
    delai: texteOptionnel(80),
    inclus: lignes,
    ordre: z.coerce.number().int().default(0),
    en_vedette: coche,
    actif: coche,
  });
  await executer("/admin/offres", ["/", "/tarifs", "/services", "/admin/offres"], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };
    const { id, ...champs } = v;
    if (champs.prix_max !== null && champs.prix_max < champs.prix_min) {
      return { erreur: "Le prix maximum est inférieur au prix minimum." };
    }
    const { error } = id
      ? await supabase.from("offres").update(champs).eq("id", id)
      : await supabase.from("offres").insert(champs);
    if (error) throw error;
    return { ok: id ? "Offre enregistrée." : "Offre créée." };
  });
}

export async function supprimerOffre(donnees: FormData) {
  await executer("/admin/offres", ["/", "/tarifs", "/admin/offres"], async ({ supabase }) => {
    const id = z.uuid().safeParse(donnees.get("id"));
    if (!id.success) return { erreur: "Identifiant invalide." };
    const { error } = await supabase.from("offres").delete().eq("id", id.data);
    if (error) throw error;
    return { ok: "Offre supprimée." };
  });
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export async function enregistrerArticle(donnees: FormData) {
  const schema = z.object({
    id: z.string().optional(),
    slug,
    titre: texte(200).min(2),
    chapo: texteOptionnel(500),
    contenu: z.string().max(100_000),
    image: texteOptionnel(500),
    tags: liste,
    publie: coche,
    publie_le: dateOptionnelle,
    seo_titre: texteOptionnel(160),
    seo_description: texteOptionnel(300),
  });
  const id = String(donnees.get("id") ?? "");
  await executer(
    id ? `/admin/articles/${id}` : "/admin/articles/nouveau",
    ["/blog", "/admin/articles"],
    async ({ supabase }) => {
      const v = lire(schema, donnees);
      if (typeof v === "string") return { erreur: v };
      const { id: _ignore, ...champs } = v;
      void _ignore;
      const illustration = donnees.get("fichier_image");
      if (fichierFourni(illustration)) {
        champs.image = await deposerImage(supabase, `articles/${champs.slug}`, illustration);
      }
      const mots = champs.contenu.split(/\s+/).filter(Boolean).length;
      const ligne = {
        ...champs,
        // 230 mots par minute : lecture attentive d'un texte technique.
        temps_lecture: Math.max(1, Math.round(mots / 230)),
        // Publier sans date = publier maintenant. Sinon l'article resterait
        // invisible : la RLS exige `publie_le <= now()`.
        publie_le: champs.publie ? (champs.publie_le ?? new Date().toISOString()) : champs.publie_le,
      };
      const { error } = id
        ? await supabase.from("articles").update(ligne).eq("id", id)
        : await supabase.from("articles").insert(ligne);
      if (error) throw error;
      revalidatePath(`/blog/${champs.slug}`);
      return id ? { ok: "Article enregistré." } : { ok: "Article créé.", vers: "/admin/articles" };
    },
  );
}

export async function supprimerArticle(donnees: FormData) {
  await executer("/admin/articles", ["/blog", "/admin/articles"], async ({ supabase }) => {
    const id = z.uuid().safeParse(donnees.get("id"));
    if (!id.success) return { erreur: "Identifiant invalide." };
    const { error } = await supabase.from("articles").delete().eq("id", id.data);
    if (error) throw error;
    return { ok: "Article supprimé." };
  });
}

// ---------------------------------------------------------------------------
// Clients et missions
// ---------------------------------------------------------------------------

const champsMission = {
  titre: texte(160).min(2, "Titre requis."),
  description: texteOptionnel(4000),
  statut: z.enum(["cadrage", "en_cours", "revue", "livre", "maintenance", "suspendu"]),
  avancement: z.coerce.number().int().min(0).max(100),
  montant: entierOptionnel,
  debut_le: dateOptionnelle,
  fin_prevue_le: dateOptionnelle,
  url_live: texteOptionnel(300),
};

export async function creerMission(donnees: FormData) {
  const schema = z.object({ profil_id: z.uuid("Choisissez un client."), ...champsMission });
  await executer("/admin/clients", ["/admin/clients"], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };
    const { data, error } = await supabase.from("missions").insert(v).select("id").single();
    if (error) throw error;
    // On enchaîne directement sur le projet : la suite logique est d'y poser
    // les étapes et le devis.
    return { ok: "Projet créé. Ajoutez ses étapes et son devis.", vers: `/admin/missions/${data.id}` };
  });
}

export async function majMission(donnees: FormData) {
  const schema = z.object({ id: z.uuid(), ...champsMission });
  const id = String(donnees.get("id") ?? "");
  await executer(`/admin/missions/${id}`, [`/compte/projets/${id}`, "/compte"], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };
    const { id: _id, ...champs } = v;
    void _id;
    const { error } = await supabase.from("missions").update(champs).eq("id", id);
    if (error) throw error;
    return { ok: "Projet mis à jour." };
  });
}

export async function ajouterJalon(donnees: FormData) {
  const schema = z.object({
    mission_id: z.uuid(),
    titre: texte(160).min(2, "Titre requis."),
    description: texteOptionnel(1000),
    prevu_le: dateOptionnelle,
    ordre: z.coerce.number().int().default(0),
  });
  const missionId = String(donnees.get("mission_id") ?? "");
  await executer(`/admin/missions/${missionId}`, [`/compte/projets/${missionId}`], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };
    const { error } = await supabase.from("jalons").insert(v);
    if (error) throw error;
    return { ok: "Étape ajoutée." };
  });
}

export async function majJalon(donnees: FormData) {
  const schema = z.object({
    id: z.uuid(),
    mission_id: z.uuid(),
    statut: z.enum(["a_faire", "en_cours", "fait", "bloque"]),
  });
  const missionId = String(donnees.get("mission_id") ?? "");
  await executer(`/admin/missions/${missionId}`, [`/compte/projets/${missionId}`, "/compte"], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };
    const { error } = await supabase
      .from("jalons")
      .update({
        statut: v.statut,
        // La date de fin se pose et s'efface avec le statut, jamais à la main.
        fait_le: v.statut === "fait" ? new Date().toISOString().slice(0, 10) : null,
      })
      .eq("id", v.id);
    if (error) throw error;
    return { ok: "Étape mise à jour." };
  });
}

export async function supprimerJalon(donnees: FormData) {
  const missionId = String(donnees.get("mission_id") ?? "");
  await executer(`/admin/missions/${missionId}`, [`/compte/projets/${missionId}`], async ({ supabase }) => {
    const id = z.uuid().safeParse(donnees.get("id"));
    if (!id.success) return { erreur: "Identifiant invalide." };
    const { error } = await supabase.from("jalons").delete().eq("id", id.data);
    if (error) throw error;
    return { ok: "Étape supprimée." };
  });
}

export async function enregistrerDocument(donnees: FormData) {
  const schema = z.object({
    id: z.string().optional(),
    mission_id: z.uuid(),
    type: z.enum(["devis", "facture", "livrable", "contrat", "autre"]),
    titre: texte(160).min(2, "Titre requis."),
    url: texteOptionnel(500),
    reference: texteOptionnel(60),
    montant: entierOptionnel,
    statut: z.enum(["brouillon", "envoye", "accepte", "refuse", "paye"]),
    echeance_le: dateOptionnelle,
  });
  const missionId = String(donnees.get("mission_id") ?? "");
  await executer(`/admin/missions/${missionId}`, [`/compte/projets/${missionId}`], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };
    const { id, ...champs } = v;

    // Le fichier part dans le bucket privé, rangé sous l'identifiant du projet :
    // c'est ce premier segment de chemin que la politique de Storage compare
    // aux projets du client. On stocke le chemin, pas une URL qui expirerait.
    const fichier = donnees.get("fichier");
    if (fichierFourni(fichier)) {
      const chemin = await deposerFichier(supabase, "documents", champs.mission_id, fichier);
      champs.url = `${PREFIXE_STOCKAGE}documents/${chemin}`;
    }

    if (!id && !champs.url) {
      return { erreur: "Joignez un fichier ou indiquez un lien vers le document." };
    }

    const { error } = id
      ? await supabase.from("documents").update(champs).eq("id", id)
      : await supabase.from("documents").insert(champs);
    if (error) throw error;
    return { ok: champs.statut === "brouillon" ? "Document enregistré (invisible du client tant qu'il est en brouillon)." : "Document enregistré." };
  });
}

/** Change le statut d'un document : envoyé, accepté, payé… */
export async function majStatutDocument(donnees: FormData) {
  const schema = z.object({
    id: z.uuid(),
    mission_id: z.uuid(),
    statut: z.enum(["brouillon", "envoye", "accepte", "refuse", "paye"]),
  });
  const missionId = String(donnees.get("mission_id") ?? "");
  await executer(`/admin/missions/${missionId}`, [`/compte/projets/${missionId}`], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };
    const { error } = await supabase.from("documents").update({ statut: v.statut }).eq("id", v.id);
    if (error) throw error;
    return { ok: "Statut du document mis à jour." };
  });
}

/** Supprime un document, et son fichier s'il est dans le stockage. */
export async function supprimerDocument(donnees: FormData) {
  const missionId = String(donnees.get("mission_id") ?? "");
  await executer(`/admin/missions/${missionId}`, [`/compte/projets/${missionId}`], async ({ supabase }) => {
    const id = z.uuid().safeParse(donnees.get("id"));
    if (!id.success) return { erreur: "Identifiant invalide." };

    const { data: document } = await supabase.from("documents").select("url").eq("id", id.data).maybeSingle();
    const { error } = await supabase.from("documents").delete().eq("id", id.data);
    if (error) throw error;

    // Le fichier est retiré après la ligne : un échec ici laisse un fichier
    // orphelin, jamais un document qui pointe vers un fichier disparu.
    if (document?.url?.startsWith(`${PREFIXE_STOCKAGE}documents/`)) {
      const chemin = document.url.slice(`${PREFIXE_STOCKAGE}documents/`.length);
      await supabase.storage.from("documents").remove([chemin]);
    }
    return { ok: "Document supprimé." };
  });
}

// ---------------------------------------------------------------------------
// Supervision
// ---------------------------------------------------------------------------

export async function ajouterSite(donnees: FormData) {
  const schema = z.object({
    nom: texte(120).min(2, "Nom requis."),
    url: z.url("URL invalide (https://…)."),
    statut_attendu: z.coerce.number().int().min(100).max(599).default(200),
    seuil_lenteur_ms: z.coerce.number().int().min(100).max(60_000).default(3000),
  });
  await executer("/admin/supervision", ["/admin/supervision", "/admin"], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };
    const { error } = await supabase.from("sites_supervises").insert(v);
    if (error) throw error;
    return { ok: `${v.nom} est maintenant surveillé.` };
  });
}

export async function basculerSite(donnees: FormData) {
  await executer("/admin/supervision", ["/admin/supervision"], async ({ supabase }) => {
    const id = z.uuid().safeParse(donnees.get("id"));
    if (!id.success) return { erreur: "Identifiant invalide." };
    const actif = donnees.get("actif") === "true";
    const { error } = await supabase.from("sites_supervises").update({ actif }).eq("id", id.data);
    if (error) throw error;
    return { ok: actif ? "Surveillance reprise." : "Surveillance suspendue." };
  });
}

export async function supprimerSite(donnees: FormData) {
  await executer("/admin/supervision", ["/admin/supervision"], async ({ supabase }) => {
    const id = z.uuid().safeParse(donnees.get("id"));
    if (!id.success) return { erreur: "Identifiant invalide." };
    const { error } = await supabase.from("sites_supervises").delete().eq("id", id.data);
    if (error) throw error;
    return { ok: "Site retiré de la supervision." };
  });
}

export async function controlerMaintenant() {
  await executer("/admin/supervision", ["/admin/supervision", "/admin"], async () => {
    const bilan = await executerSupervision();
    if (!bilan.configure) {
      return { erreur: "SUPABASE_SERVICE_ROLE_KEY manquante : la supervision ne peut pas écrire." };
    }
    const pannes = bilan.resultats.filter((r) => !r.ok).length;
    return {
      ok: pannes
        ? `${bilan.resultats.length} sites contrôlés — ${pannes} en panne, alerte envoyée.`
        : `${bilan.resultats.length} sites contrôlés, tout répond.`,
    };
  });
}

export async function resoudreAlerte(donnees: FormData) {
  await executer("/admin/supervision", ["/admin/supervision", "/admin"], async ({ supabase }) => {
    const id = z.uuid().safeParse(donnees.get("id"));
    if (!id.success) return { erreur: "Identifiant invalide." };
    const { error } = await supabase
      .from("alertes")
      .update({ resolue_le: new Date().toISOString() })
      .eq("id", id.data);
    if (error) throw error;
    return { ok: "Alerte marquée comme résolue." };
  });
}

