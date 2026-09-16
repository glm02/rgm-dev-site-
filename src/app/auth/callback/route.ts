import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { CLE_ANON, URL_SUPABASE, estConfigure } from "@/lib/supabase/config";

/**
 * Le retour d'authentification.
 *
 * Supabase renvoie ici après un OAuth ou un lien magique, avec un code à
 * échanger contre une session. C'est cet échange qui pose les cookies.
 *
 * Route Handler et non page : il faut pouvoir écrire des cookies et rediriger
 * avant tout rendu, ce qu'un Server Component ne permet pas.
 */
export async function GET(requete: NextRequest) {
  const { searchParams, origin } = requete.nextUrl;

  const code = searchParams.get("code");
  const erreur = searchParams.get("error_description") ?? searchParams.get("error");

  // `suite` vient de la page de connexion : on ramène l'utilisateur là où il
  // voulait aller avant d'être arrêté.
  const brut = searchParams.get("suite") ?? "/compte";
  // Un chemin relatif, et rien d'autre : accepter une URL complète ouvrirait
  // une redirection vers un site tiers depuis un lien d'apparence légitime.
  const suite = brut.startsWith("/") && !brut.startsWith("//") ? brut : "/compte";

  if (erreur) {
    return NextResponse.redirect(
      `${origin}/connexion?erreur=${encodeURIComponent(erreur)}`,
    );
  }

  if (!code || !estConfigure()) {
    return NextResponse.redirect(`${origin}/connexion?erreur=lien_invalide`);
  }

  const reponse = NextResponse.redirect(`${origin}${suite}`);

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

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth] échange du code impossible", error);
    return NextResponse.redirect(`${origin}/connexion?erreur=session_refusee`);
  }

  return reponse;
}
