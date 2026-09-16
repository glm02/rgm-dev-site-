import { NextResponse, type NextRequest } from "next/server";

import { clientServeur } from "@/lib/supabase/serveur";

/**
 * La déconnexion.
 *
 * En `POST` uniquement, et c'est important : une déconnexion en `GET` part au
 * premier préchargeur de lien ou antivirus qui suit l'URL. L'utilisateur se
 * retrouverait déconnecté sans avoir rien cliqué.
 */
export async function POST(requete: NextRequest) {
  const supabase = await clientServeur();
  if (supabase) await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/", requete.nextUrl.origin), {
    // 303 : le navigateur doit suivre en GET. Sans ça, il rejouerait le POST
    // sur la page d'accueil.
    status: 303,
  });
}
