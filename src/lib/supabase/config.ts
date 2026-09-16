/**
 * Configuration Supabase.
 *
 * Le projet Supabase n'existe pas encore (voir AGENTS.md §7). Tant que les
 * variables ne sont pas renseignées, `estConfigure()` renvoie `false` et les
 * clients renvoient `null` : le site build, se déploie et affiche un message
 * honnête là où il faudrait des données, au lieu de planter.
 *
 * Quand les clés arrivent, il n'y a rien à changer dans le code — seulement un
 * `.env.local` à remplir.
 */

export const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const CLE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function estConfigure(): boolean {
  return URL_SUPABASE.length > 0 && CLE_ANON.length > 0;
}

/** Où Supabase renvoie le navigateur après une connexion OAuth ou un lien magique. */
export function urlDeRetour(chemin = "/auth/callback"): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");

  return new URL(chemin, base).toString();
}
