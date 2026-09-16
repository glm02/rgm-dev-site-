/**
 * Configuration Supabase.
 *
 * Toutes les variables sont `trim()`ées et testées sur leur contenu, jamais sur
 * leur nullité : Next remplace `process.env.NEXT_PUBLIC_*` par sa valeur au
 * build, et une variable absente devient la chaîne vide.
 *
 * Le projet Supabase n'existe pas encore (voir AGENTS.md §7). Tant que les
 * variables ne sont pas renseignées, `estConfigure()` renvoie `false` et les
 * clients renvoient `null` : le site build, se déploie et affiche un message
 * honnête là où il faudrait des données, au lieu de planter.
 *
 * Quand les clés arrivent, il n'y a rien à changer dans le code — seulement un
 * `.env.local` à remplir.
 */

import { SITE } from "@/lib/site";

export const URL_SUPABASE = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
export const CLE_ANON = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

export function estConfigure(): boolean {
  return URL_SUPABASE.length > 0 && CLE_ANON.length > 0;
}

/**
 * Où Supabase renvoie le navigateur après une connexion OAuth ou un lien magique.
 *
 * Côté navigateur, on préfère l'origine réelle de la page : c'est la seule
 * valeur juste sur un déploiement de prévisualisation, dont l'URL change à
 * chaque commit. `SITE.url` sert de repli pour le rendu serveur.
 */
export function urlDeRetour(chemin = "/auth/callback"): string {
  const base =
    typeof window !== "undefined" ? window.location.origin : SITE.url;

  return new URL(chemin, base).toString();
}
