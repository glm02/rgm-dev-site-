import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { CLE_ANON, URL_SUPABASE, estConfigure } from "@/lib/supabase/config";

/**
 * Rafraîchit la session Supabase sur les routes qui en dépendent.
 *
 * Sans ça, le jeton expire et l'utilisateur est déconnecté silencieusement au
 * bout d'une heure.
 *
 * Le matcher exclut volontairement les pages publiques : elles sont statiques,
 * les faire passer ici les rendrait dynamiques pour rien — et le référencement
 * est la raison d'être du site.
 *
 * Ce fichier s'appelle `proxy.ts` et non `middleware.ts` : Next 16 a renommé la
 * convention. La doc Supabase, elle, parle encore de `middleware.ts`.
 *
 * Attention : ceci **n'est pas** le contrôle d'accès. C'est une redirection de
 * confort. Ce qui protège réellement `/admin` et `/compte`, ce sont les
 * vérifications faites dans les layouts serveur et les politiques RLS.
 */
export async function proxy(requete: NextRequest) {
  if (!estConfigure()) return NextResponse.next();

  const reponse = NextResponse.next({ request: requete });

  const supabase = createServerClient(URL_SUPABASE, CLE_ANON, {
    cookies: {
      getAll: () => requete.cookies.getAll(),
      setAll: (aPoser) => {
        for (const { name, value, options } of aPoser) {
          reponse.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const chemin = requete.nextUrl.pathname;
  const zonePrivee = chemin.startsWith("/compte") || chemin.startsWith("/admin");

  if (!user && zonePrivee) {
    const versConnexion = requete.nextUrl.clone();
    versConnexion.pathname = "/connexion";
    versConnexion.searchParams.set("suite", chemin);
    return NextResponse.redirect(versConnexion);
  }

  // Déjà connecté : la page de connexion n'a plus rien à lui dire.
  if (user && chemin === "/connexion") {
    const versCompte = requete.nextUrl.clone();
    versCompte.pathname = "/compte";
    versCompte.search = "";
    return NextResponse.redirect(versCompte);
  }

  return reponse;
}

export const config = {
  matcher: ["/compte/:path*", "/admin/:path*", "/connexion", "/auth/:path*"],
};
