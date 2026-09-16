"use client";

import { createBrowserClient } from "@supabase/ssr";

import { CLE_ANON, URL_SUPABASE, estConfigure } from "./config";

let cache: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Client Supabase navigateur, instancié une seule fois.
 *
 * Sert à la connexion (OAuth, lien magique) et à la déconnexion. Pour lire des
 * données, préférer le client serveur : c'est plus rapide et ça n'expose rien.
 */
export function clientNavigateur() {
  if (!estConfigure()) return null;
  cache ??= createBrowserClient(URL_SUPABASE, CLE_ANON);
  return cache;
}
