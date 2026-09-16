import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { CLE_ANON, URL_SUPABASE, estConfigure } from "./config";
import type { Profil } from "@/lib/types";

/**
 * Client Supabase côté serveur, adossé aux cookies de la requête.
 *
 * C'est celui qu'utilisent les Server Components et les Server Actions. Il
 * porte l'identité du visiteur, donc la RLS s'applique : il ne peut lire que
 * ce que l'utilisateur a le droit de lire. C'est voulu.
 */
export async function clientServeur() {
  if (!estConfigure()) return null;

  const bocal = await cookies();

  return createServerClient(URL_SUPABASE, CLE_ANON, {
    cookies: {
      getAll: () => bocal.getAll(),
      setAll: (aPoser) => {
        try {
          for (const { name, value, options } of aPoser) {
            bocal.set(name, value, options);
          }
        } catch {
          // Appelé depuis un Server Component : les cookies y sont en lecture
          // seule. `proxy.ts` rafraîchit déjà la session, on peut ignorer.
        }
      },
    },
  });
}

/**
 * L'utilisateur connecté, ou `null`.
 *
 * `getUser()` et pas `getSession()` : `getSession()` fait confiance au cookie
 * sans le vérifier auprès de Supabase, ce qui ne vaut rien côté serveur.
 */
export async function utilisateurCourant() {
  const supabase = await clientServeur();
  if (!supabase) return null;

  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/** Le profil applicatif de l'utilisateur connecté — c'est lui qui porte le rôle. */
export async function profilCourant(): Promise<Profil | null> {
  const supabase = await clientServeur();
  if (!supabase) return null;

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data } = await supabase
    .from("profils")
    .select("*")
    .eq("id", auth.user.id)
    .single();

  return (data as Profil | null) ?? null;
}

/**
 * Vrai si l'utilisateur connecté est administrateur.
 *
 * Réponse indicative, pour décider quoi *afficher*. Ce qui protège réellement
 * les données, ce sont les politiques RLS — pas cet appel.
 */
export async function estAdmin(): Promise<boolean> {
  const profil = await profilCourant();
  return profil?.role === "admin";
}
