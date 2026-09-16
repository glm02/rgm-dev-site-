import "server-only";

import { redirect } from "next/navigation";

import { clientServeur } from "./supabase/serveur";
import type { Profil } from "./types";

type ClientSupabase = NonNullable<Awaited<ReturnType<typeof clientServeur>>>;

export type Session = { supabase: ClientSupabase; profil: Profil };

/**
 * L'autorisation des espaces privés.
 *
 * Deux familles de fonctions, parce que les deux contextes n'échouent pas de
 * la même façon :
 *
 * - dans une **page** ou un **layout**, on redirige (`…OuRedirection`) : le
 *   visiteur doit arriver quelque part d'utile ;
 * - dans un **Server Action**, on lève une erreur (`exiger…`) : une action est
 *   joignable par POST direct, rediriger masquerait une tentative d'accès.
 *
 * Rappel : ces vérifications décident de ce qu'on *affiche* et de ce qu'on
 * *tente*. Ce qui protège réellement les données, ce sont les politiques RLS
 * de `0002_rls.sql`, qui s'appliquent même si l'une de ces fonctions était
 * contournée.
 *
 * Toutes renvoient `null` si Supabase n'est pas encore configuré : les pages
 * affichent alors un message honnête au lieu de planter.
 */

async function lireSession(): Promise<
  { etat: "non_configure" } | { etat: "anonyme" } | { etat: "sans_profil" } | ({ etat: "ok" } & Session)
> {
  const supabase = await clientServeur();
  if (!supabase) return { etat: "non_configure" };

  const { data } = await supabase.auth.getUser();
  if (!data.user) return { etat: "anonyme" };

  const { data: profil } = await supabase
    .from("profils")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profil) return { etat: "sans_profil" };

  return { etat: "ok", supabase, profil: profil as Profil };
}

export async function sessionOuRedirection(suite: string): Promise<Session | null> {
  const session = await lireSession();

  switch (session.etat) {
    case "non_configure":
      return null;
    case "anonyme":
      redirect(`/connexion?suite=${encodeURIComponent(suite)}`);
    case "sans_profil":
      // Le déclencheur SQL crée le profil à l'inscription. Son absence signale
      // une migration non appliquée, pas une erreur de l'utilisateur.
      redirect("/connexion?erreur=session_refusee");
    case "ok":
      return { supabase: session.supabase, profil: session.profil };
  }
}

export async function sessionAdminOuRedirection(suite: string): Promise<Session | null> {
  const session = await sessionOuRedirection(suite);
  if (session && session.profil.role !== "admin") redirect("/compte");
  return session;
}

export class AccesRefuse extends Error {
  constructor(message = "Accès refusé.") {
    super(message);
    this.name = "AccesRefuse";
  }
}

export async function exigerSession(): Promise<Session> {
  const session = await lireSession();
  if (session.etat === "non_configure") {
    throw new AccesRefuse("L'espace client n'est pas encore actif.");
  }
  if (session.etat !== "ok") throw new AccesRefuse("Vous devez être connecté.");
  return { supabase: session.supabase, profil: session.profil };
}

export async function exigerAdmin(): Promise<Session> {
  const session = await exigerSession();
  if (session.profil.role !== "admin") throw new AccesRefuse();
  return session;
}
