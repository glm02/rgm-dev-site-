import { createClient } from "@supabase/supabase-js";

import { CLE_ANON, URL_SUPABASE, estConfigure } from "./config";

let cache: ReturnType<typeof createClient> | null = null;

/**
 * Client Supabase **anonyme et sans cookies**, pour le contenu public.
 *
 * Le site public (services, tarifs, réalisations, avis, blog) ne dépend pas de
 * qui le visite : il doit être généré au build et servi en statique, parce que
 * la vitesse fait partie du référencement. Or le client serveur lit les
 * cookies de la requête — ce qui est impossible au build (`generateStaticParams`
 * échoue) et rendrait sinon chaque page dynamique.
 *
 * Avec la seule clé anon, la RLS ne laisse passer que ce qui est publié : un
 * brouillon ne peut pas fuiter sur une page publique, même par erreur de
 * requête.
 */
export function clientPublic() {
  if (!estConfigure()) return null;
  cache ??= createClient(URL_SUPABASE, CLE_ANON, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return cache;
}
