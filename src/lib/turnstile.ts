import "server-only";

import { headers } from "next/headers";

/**
 * La vérification Cloudflare Turnstile, côté serveur.
 *
 * Le widget du navigateur ne prouve rien à lui seul : il produit un jeton,
 * et seul l'appel à `siteverify` avec la clé secrète dit si ce jeton est
 * valable. Un robot qui poste directement sur un Server Action n'a pas de
 * jeton : il est refusé ici.
 *
 * Sans `TURNSTILE_SECRET_KEY`, la vérification est ignorée (avec un
 * avertissement) : le site doit démarrer et builder sans ses clés, comme pour
 * Supabase. Le piège à robots et les limites du pare-feu Vercel restent actifs.
 */

const URL_VERIFICATION = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Le nom du champ que le widget remplit dans le formulaire. */
export const CHAMP_TURNSTILE = "cf-turnstile-response";

export function turnstileActif(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}

export async function verifierTurnstile(jeton: unknown, action?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[turnstile] TURNSTILE_SECRET_KEY absente : vérification ignorée");
    }
    return true;
  }

  // Un jeton fait au plus 2048 caractères : au-delà, inutile de demander.
  if (typeof jeton !== "string" || !jeton || jeton.length > 2048) return false;

  const entetes = await headers();
  const ip = entetes.get("x-real-ip") ?? entetes.get("x-forwarded-for")?.split(",")[0]?.trim();

  const corps = new URLSearchParams({ secret, response: jeton });
  if (ip) corps.set("remoteip", ip);

  try {
    const reponse = await fetch(URL_VERIFICATION, {
      method: "POST",
      body: corps,
      signal: AbortSignal.timeout(8000),
    });
    const resultat = (await reponse.json()) as { success?: boolean; action?: string; "error-codes"?: string[] };

    if (!resultat.success) {
      console.warn("[turnstile] jeton refusé", resultat["error-codes"]);
      return false;
    }
    // Un jeton obtenu sur un autre formulaire ne sert pas ici.
    if (action && resultat.action && resultat.action !== action) return false;
    return true;
  } catch (erreur) {
    // Cloudflare injoignable : on refuse plutôt que d'ouvrir la porte. Le
    // visiteur peut réessayer, un robot ne doit pas profiter d'une panne.
    console.error("[turnstile] vérification impossible", erreur);
    return false;
  }
}
