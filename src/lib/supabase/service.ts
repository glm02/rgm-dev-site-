import "server-only";

import { createClient } from "@supabase/supabase-js";

import { URL_SUPABASE } from "./config";

/**
 * Client à clé service role : il **contourne la RLS**.
 *
 * Réservé aux travaux de fond qui n'ont pas d'utilisateur derrière eux —
 * aujourd'hui, uniquement le cron de supervision, qui doit écrire dans
 * `controles` et `alertes` sans être authentifié.
 *
 * `server-only` en tête du fichier : si un composant client l'importait par
 * mégarde, le build échoue au lieu de publier la clé.
 */
export function clientService() {
  const cle = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!URL_SUPABASE || !cle) return null;

  return createClient(URL_SUPABASE, cle, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
