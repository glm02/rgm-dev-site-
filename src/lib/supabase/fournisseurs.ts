import "server-only";

import { CLE_ANON, URL_SUPABASE, estConfigure } from "./config";

type Fournisseur = "google" | "github";

/**
 * Les fournisseurs OAuth activés dans le projet Supabase.
 *
 * Lu sur `/auth/v1/settings`, qui est public : la page de connexion n'affiche
 * ainsi que les boutons qui mènent quelque part. Activer Google dans le
 * tableau de bord Supabase suffit à faire apparaître son bouton, sans
 * redéployer — d'où la revalidation toutes les 10 minutes plutôt qu'au build.
 */
export async function fournisseursActifs(): Promise<Fournisseur[]> {
  if (!estConfigure()) return [];

  try {
    const reponse = await fetch(`${URL_SUPABASE}/auth/v1/settings`, {
      headers: { apikey: CLE_ANON },
      next: { revalidate: 600 },
    });
    if (!reponse.ok) return ["github"];

    const reglages = (await reponse.json()) as { external?: Record<string, boolean> };
    const actifs = reglages.external ?? {};
    return (["google", "github"] as const).filter((nom) => actifs[nom]);
  } catch {
    // Supabase injoignable : le lien magique reste proposé, c'est l'essentiel.
    return [];
  }
}
