import "server-only";

import type { Session } from "./auth";

type ClientSupabase = Session["supabase"];

/**
 * Le stockage des fichiers dans Supabase Storage (voir 0005_stockage.sql).
 *
 * Convention pour les documents privés : la colonne `documents.url` contient
 * `storage:documents/<mission_id>/<fichier>` plutôt qu'une URL. Une URL
 * publique ou signée stockée en base finirait par fuiter ou par expirer ; le
 * chemin, lui, reste valable et le lien est fabriqué au moment de l'affichage.
 */

export const PREFIXE_STOCKAGE = "storage:";

/**
 * Taille maximale d'un envoi depuis l'admin, alignée sur
 * `serverActions.bodySizeLimit` dans next.config.ts. Vercel refuse de toute
 * façon une requête de plus de 4,5 Mo.
 */
export const TAILLE_MAX_OCTETS = 4 * 1024 * 1024;

/** Un fichier réellement choisi (un champ fichier laissé vide envoie un `File` de 0 octet). */
export function fichierFourni(valeur: FormDataEntryValue | null): valeur is File {
  return typeof valeur === "object" && valeur !== null && "size" in valeur && valeur.size > 0;
}

/**
 * Un nom de fichier sûr : sans accents, espaces ni caractères qui casseraient
 * une URL, préfixé d'un horodatage pour que deux « devis.pdf » ne s'écrasent pas.
 */
function nomSur(nom: string): string {
  const point = nom.lastIndexOf(".");
  const base = (point > 0 ? nom.slice(0, point) : nom)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "fichier";
  const extension = point > 0 ? nom.slice(point + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  return `${Date.now()}-${base}${extension ? `.${extension}` : ""}`;
}

export async function deposerFichier(
  supabase: ClientSupabase,
  bucket: "images" | "documents",
  dossier: string,
  fichier: File,
): Promise<string> {
  if (fichier.size > TAILLE_MAX_OCTETS) {
    throw new Error(`Fichier trop lourd (${Math.round(fichier.size / 1024 / 1024)} Mo, 4 Mo maximum).`);
  }

  const chemin = `${dossier}/${nomSur(fichier.name)}`;
  const { error } = await supabase.storage.from(bucket).upload(chemin, fichier, {
    contentType: fichier.type || undefined,
    upsert: false,
  });
  if (error) throw error;
  return chemin;
}

/** Dépose une image publique et renvoie son URL définitive. */
export async function deposerImage(
  supabase: ClientSupabase,
  dossier: string,
  fichier: File,
): Promise<string> {
  if (!fichier.type.startsWith("image/")) throw new Error("Ce fichier n'est pas une image.");
  const chemin = await deposerFichier(supabase, "images", dossier, fichier);
  return supabase.storage.from("images").getPublicUrl(chemin).data.publicUrl;
}

/**
 * Le lien à afficher pour un document.
 *
 * Un chemin de stockage devient un lien signé valable une heure ; une URL
 * externe (Drive, Dropbox) est rendue telle quelle. Le lien signé est
 * fabriqué avec la session du visiteur : la politique de Storage vérifie qu'un
 * client ne signe que les fichiers de ses propres projets.
 */
export async function lienDocument(
  supabase: ClientSupabase,
  url: string | null,
): Promise<string | null> {
  if (!url) return null;
  if (!url.startsWith(PREFIXE_STOCKAGE)) return url;

  const [bucket, ...reste] = url.slice(PREFIXE_STOCKAGE.length).split("/");
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(reste.join("/"), 3600, { download: true });

  if (error) {
    console.error("[stockage] lien signé impossible", error);
    return null;
  }
  return data.signedUrl;
}

/** Remplace les chemins de stockage d'une liste de documents par des liens utilisables. */
export async function avecLiens<T extends { url: string | null }>(
  supabase: ClientSupabase,
  documents: T[],
): Promise<T[]> {
  return Promise.all(
    documents.map(async (document) => ({ ...document, url: await lienDocument(supabase, document.url) })),
  );
}
