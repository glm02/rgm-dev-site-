"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { AccesRefuse, exigerSession } from "@/lib/auth";
import { envoyerTelegram } from "@/lib/notifications";

/**
 * Les actions de l'espace client.
 *
 * Chacune revérifie la session : un Server Action est joignable par POST
 * direct, sans passer par la page qui l'affiche. La RLS bloquerait de toute
 * façon une écriture illégitime — ces contrôles servent à renvoyer un message
 * clair plutôt qu'une erreur de base de données.
 */

export type EtatAction = {
  statut: "inerte" | "succes" | "erreur";
  message?: string;
  erreurs?: Record<string, string[]>;
};

function echec(erreur: unknown): EtatAction {
  if (erreur instanceof AccesRefuse) return { statut: "erreur", message: erreur.message };
  console.error("[compte]", erreur);
  return { statut: "erreur", message: "Une erreur est survenue. Réessayez dans un instant." };
}

// ---------------------------------------------------------------------------
// Messagerie
// ---------------------------------------------------------------------------

const SchemaMessage = z.object({
  mission_id: z.uuid(),
  contenu: z
    .string()
    .trim()
    .min(1, "Le message est vide.")
    .max(4000, "Ce message est trop long."),
});

export async function envoyerMessage(
  _precedent: EtatAction,
  donnees: FormData,
): Promise<EtatAction> {
  try {
    const { supabase, profil } = await exigerSession();

    const analyse = SchemaMessage.safeParse(Object.fromEntries(donnees));
    if (!analyse.success) {
      return {
        statut: "erreur",
        erreurs: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
      };
    }

    // Lire la mission d'abord : si elle n'est pas visible (RLS), elle
    // n'appartient pas à ce client, et on le dit sans rien écrire.
    const { data: mission } = await supabase
      .from("missions")
      .select("id, titre")
      .eq("id", analyse.data.mission_id)
      .maybeSingle();

    if (!mission) throw new AccesRefuse("Ce projet est introuvable.");

    const { error } = await supabase.from("messages").insert({
      mission_id: mission.id,
      auteur_id: profil.id,
      contenu: analyse.data.contenu,
    });
    if (error) throw error;

    // Un client qui écrit attend une réponse : c'est une notification, pas un
    // simple enregistrement. Sauf quand c'est Rafael qui répond.
    if (profil.role !== "admin") {
      await envoyerTelegram(
        `💬 <b>Message de ${profil.nom ?? profil.email}</b> — ${mission.titre}\n\n${analyse.data.contenu.slice(0, 500)}`,
      );
    }

    revalidatePath(`/compte/projets/${mission.id}`);
    revalidatePath(`/admin/missions/${mission.id}`);
    return { statut: "succes" };
  } catch (erreur) {
    return echec(erreur);
  }
}

// ---------------------------------------------------------------------------
// Avis
// ---------------------------------------------------------------------------

const SchemaAvis = z.object({
  auteur_nom: z.string().trim().min(2, "Indiquez votre nom.").max(120),
  auteur_role: z.string().trim().max(120).optional().or(z.literal("")),
  auteur_entreprise: z.string().trim().max(160).optional().or(z.literal("")),
  note: z.coerce
    .number()
    .int("La note est un nombre entier.")
    .min(1, "Choisissez une note de 1 à 5 étoiles.")
    .max(5),
  contenu: z
    .string()
    .trim()
    .min(30, "Quelques phrases de plus : 30 caractères minimum.")
    .max(2000, "2 000 caractères maximum."),
});

export async function deposerAvis(
  _precedent: EtatAction,
  donnees: FormData,
): Promise<EtatAction> {
  try {
    const { supabase, profil } = await exigerSession();

    // Règle métier : on ne témoigne que d'un travail livré. Un avis déposé en
    // plein cadrage ne dirait rien d'utile au prochain visiteur.
    const { count } = await supabase
      .from("missions")
      .select("id", { count: "exact", head: true })
      .in("statut", ["livre", "maintenance"]);

    if (!count) {
      throw new AccesRefuse("Vous pourrez déposer votre avis une fois votre projet livré.");
    }

    const analyse = SchemaAvis.safeParse(Object.fromEntries(donnees));
    if (!analyse.success) {
      return {
        statut: "erreur",
        message: "Il reste quelque chose à corriger.",
        erreurs: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
      };
    }

    // `publie: false` n'est pas une option : la politique RLS refuse tout avis
    // client qui arriverait déjà publié. La mise en ligne passe par l'admin.
    const { error } = await supabase.from("avis").insert({
      profil_id: profil.id,
      auteur_nom: analyse.data.auteur_nom,
      auteur_role: analyse.data.auteur_role || null,
      auteur_entreprise: analyse.data.auteur_entreprise || null,
      note: analyse.data.note,
      contenu: analyse.data.contenu,
      source: "espace_client",
      publie: false,
      en_vedette: false,
    });
    if (error) throw error;

    await envoyerTelegram(
      `⭐ <b>Nouvel avis à modérer</b> — ${"★".repeat(analyse.data.note)}${"☆".repeat(5 - analyse.data.note)}\n${analyse.data.auteur_nom}\n\n${analyse.data.contenu.slice(0, 500)}`,
    );

    revalidatePath("/compte/avis");
    revalidatePath("/admin/avis");
    return {
      statut: "succes",
      message: "Merci ! Votre avis sera publié après une relecture rapide — sans aucune retouche du texte.",
    };
  } catch (erreur) {
    return echec(erreur);
  }
}
