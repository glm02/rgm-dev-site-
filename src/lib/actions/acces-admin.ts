"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";

import { clientServeur } from "@/lib/supabase/serveur";
import { clientService } from "@/lib/supabase/service";

export type EtatAccesAdmin = { erreur?: string };

const EMAIL_ADMIN = (process.env.ADMIN_EMAIL ?? "glm07rafael@gmail.com").trim().toLowerCase();

/** Compare deux chaînes en temps constant : la durée ne trahit pas le préfixe juste. */
function egal(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/**
 * L'entrée de l'administration par mot de passe.
 *
 * Le mot de passe vit dans la variable `ADMIN_PASSWORD` sur Vercel, pas en
 * base. S'il est juste, on ouvre une **vraie session Supabase** pour le compte
 * admin : un lien magique est généré côté serveur (aucun email ne part) puis
 * vérifié aussitôt, ce qui pose les cookies de session. Le reste de l'admin
 * ne change pas : la RLS voit un utilisateur admin, comme avant.
 *
 * Pourquoi pas un simple cookie maison : l'admin lit ses données à travers la
 * RLS ; sans session Supabase, il ne verrait rien.
 */
export async function connexionAdmin(
  _etat: EtatAccesAdmin,
  donnees: FormData,
): Promise<EtatAccesAdmin> {
  const attendu = (process.env.ADMIN_PASSWORD ?? "").trim();
  if (!attendu) {
    return { erreur: "ADMIN_PASSWORD n'est pas défini sur le serveur." };
  }

  const saisi = String(donnees.get("mot_de_passe") ?? "");
  if (!saisi || !egal(saisi, attendu)) {
    // Une seconde de pénalité : rend l'essai en masse beaucoup plus lent.
    await new Promise((r) => setTimeout(r, 1000));
    return { erreur: "Mot de passe incorrect." };
  }

  const service = clientService();
  const supabase = await clientServeur();
  if (!service || !supabase) {
    return { erreur: "SUPABASE_SERVICE_ROLE_KEY manquante sur le serveur." };
  }

  let lien = await service.auth.admin.generateLink({ type: "magiclink", email: EMAIL_ADMIN });

  // Premier passage : le compte n'existe pas encore. On le crée confirmé, le
  // déclencheur SQL lui donne le rôle admin d'après son email.
  if (lien.error) {
    const creation = await service.auth.admin.createUser({ email: EMAIL_ADMIN, email_confirm: true });
    if (creation.error) {
      console.error("[acces-admin] création du compte", creation.error);
      return { erreur: "Le compte admin n'a pas pu être créé." };
    }
    lien = await service.auth.admin.generateLink({ type: "magiclink", email: EMAIL_ADMIN });
  }

  const jeton = lien.data?.properties?.hashed_token;
  if (lien.error || !jeton) {
    console.error("[acces-admin] génération du lien", lien.error);
    return { erreur: "La session n'a pas pu être ouverte." };
  }

  const { error } = await supabase.auth.verifyOtp({ type: "email", token_hash: jeton });
  if (error) {
    console.error("[acces-admin] vérification", error);
    return { erreur: "La session n'a pas pu être ouverte." };
  }

  redirect("/admin");
}
