import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { AccesRefuse, exigerAdmin } from "@/lib/auth";

/**
 * Le noyau commun des actions d'administration.
 *
 * Ce fichier n'est pas un module `"use server"` : il n'expose pas d'actions,
 * seulement les briques qu'elles partagent. Les regrouper ici évite que
 * chaque nouveau domaine (CRM, facturation…) recopie sa propre version de la
 * validation et de la redirection, avec ses propres écarts.
 *
 * Convention de toutes les actions :
 * - elles commencent par `exigerAdmin()` : un Server Action est joignable par
 *   POST direct, il ne fait confiance à rien de ce qu'affiche la page ;
 * - elles se terminent par une redirection vers la page d'origine, avec `?ok=`
 *   ou `?erreur=`. Le résultat s'affiche donc même sans JavaScript, et un
 *   rechargement ne rejoue pas l'envoi du formulaire.
 */

/** `vers` remplace la page de retour en cas de succès (ex. : la fiche tout juste créée). */
export type Resultat = { ok: string; vers?: string } | { erreur: string };

export function revenir(chemin: string, resultat: Resultat): never {
  const [base, fragment] = ("ok" in resultat && resultat.vers ? resultat.vers : chemin).split("#");
  const url = new URL(base, "http://x");
  url.searchParams.delete("ok");
  url.searchParams.delete("erreur");
  if ("ok" in resultat) url.searchParams.set("ok", resultat.ok);
  else url.searchParams.set("erreur", resultat.erreur);
  redirect(`${url.pathname}${url.search}${fragment ? `#${fragment}` : ""}`);
}

/**
 * Exécute le travail d'une action, puis redirige.
 *
 * `redirect()` fonctionne en levant une exception : il est appelé **hors** du
 * `try`, sinon le `catch` l'avalerait et l'action ne mènerait nulle part.
 */
export async function executer(
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

export const texte = (max = 500) => z.string().trim().max(max);

export const texteOptionnel = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));

export const entierOptionnel = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? Number(v) : null))
  .refine((v) => v === null || (Number.isInteger(v) && v >= 0), "Nombre entier positif attendu.");

export const dateOptionnelle = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : null));

export const coche = z
  .string()
  .optional()
  .transform((v) => v === "on" || v === "true");

export const slug = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Le slug ne contient que des minuscules, chiffres et tirets.");

/** Une liste saisie une valeur par ligne (ou séparée par des virgules). */
export const liste = z
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
export const lignes = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split(/\r?\n/)
      .map((ligne) => ligne.trim())
      .filter(Boolean),
  );

/** Valide un `FormData` et renvoie soit les données, soit le message d'erreur à afficher. */
export function lire<T extends z.ZodTypeAny>(schema: T, donnees: FormData): z.infer<T> | string {
  const analyse = schema.safeParse(Object.fromEntries(donnees));
  if (analyse.success) return analyse.data;
  const premiere = analyse.error.issues[0];
  return `${premiere.path.join(".") || "formulaire"} : ${premiere.message}`;
}
