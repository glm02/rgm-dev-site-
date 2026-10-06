"use server";

import { z } from "zod";

import { dateOptionnelle, executer, lire, liste, texte, texteOptionnel } from "@/lib/actions/noyau";
import { STATUT_PROSPECT } from "@/lib/libelles";
import type { StatutProspect } from "@/lib/types";

/**
 * Les actions du pipeline commercial.
 *
 * Deux règles tiennent tout le CRM :
 *
 * 1. rien ne change sans laisser de trace — chaque geste écrit une ligne dans
 *    le journal d'activité, sinon « on en était où ? » redevient une question
 *    de mémoire ;
 * 2. une affaire gagnée ouvre une mission, et le client la voit depuis son
 *    espace. Le CRM n'est pas un carnet à part, c'est l'entrée du reste.
 */

const ETAPES = Object.keys(STATUT_PROSPECT) as [StatutProspect, ...StatutProspect[]];

/** Un montant en euros, saisi « 2500 », « 2 500 » ou « 2500,50 ». */
const montantOptionnel = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? Number(v.replace(/\s/g, "").replace(",", ".")) : null))
  .refine((v) => v === null || (Number.isFinite(v) && v >= 0), "Montant positif attendu.");

const pourcentage = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? Number(v) : null))
  .refine(
    (v) => v === null || (Number.isInteger(v) && v >= 0 && v <= 100),
    "Probabilité entre 0 et 100 attendue.",
  );

const CHAMPS_PROSPECT = {
  entreprise: texteOptionnel(160),
  contact: texte(160).min(2, "Le nom du contact est obligatoire."),
  email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v ? v : null))
    .refine((v) => v === null || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), "Adresse email invalide."),
  telephone: texteOptionnel(40),
  ville: texteOptionnel(120),
  secteur: texteOptionnel(120),
  source: texteOptionnel(80),
  besoin: texteOptionnel(300),
  statut: z.enum(ETAPES),
  valeur_estimee: montantOptionnel,
  probabilite: pourcentage,
  relance_le: dateOptionnelle,
  note: texteOptionnel(4000),
  etiquettes: liste,
};

export async function enregistrerProspect(donnees: FormData) {
  const schema = z.object({ id: z.uuid().optional(), ...CHAMPS_PROSPECT });

  await executer("/admin/crm", ["/admin", "/admin/crm"], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };
    const { id, probabilite, ...reste } = v;

    // Probabilité laissée vide : celle de l'étape. Un pipeline pondéré faux
    // est pire qu'un pipeline sans chiffre.
    const champs = { ...reste, probabilite: probabilite ?? STATUT_PROSPECT[v.statut].probabilite };

    if (id) {
      const { error } = await supabase.from("prospects").update(champs).eq("id", id);
      if (error) throw error;
      return { ok: "Affaire enregistrée.", vers: `/admin/crm/${id}` };
    }

    const { data, error } = await supabase.from("prospects").insert(champs).select("id").single();
    if (error) throw error;

    await supabase.from("activites").insert({
      prospect_id: data.id,
      type: "note",
      resume: `Affaire créée${v.source ? ` (${v.source})` : ""}.`,
    });

    return { ok: "Affaire ajoutée au pipeline.", vers: `/admin/crm/${data.id}` };
  });
}

export async function supprimerProspect(donnees: FormData) {
  const schema = z.object({ id: z.uuid() });

  await executer("/admin/crm", ["/admin", "/admin/crm"], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };
    const { error } = await supabase.from("prospects").delete().eq("id", v.id);
    if (error) throw error;
    return { ok: "Affaire supprimée.", vers: "/admin/crm" };
  });
}

/**
 * Note un échange, et programme la suite dans le même geste.
 *
 * C'est l'action la plus utilisée du CRM : on raccroche, on écrit deux
 * lignes, on pose la date du rappel. Si la relance devait se régler ailleurs,
 * elle ne serait jamais posée.
 */
export async function ajouterActivite(donnees: FormData) {
  const schema = z.object({
    prospect_id: z.uuid(),
    type: z.enum(["appel", "email", "rdv", "devis", "relance", "note"]),
    resume: texte(2000).min(2, "Dites ce qui s'est passé."),
    relance_le: dateOptionnelle,
    /** Vide = on ne touche pas à l'étape. */
    statut: z.union([z.enum(ETAPES), z.literal("")]).optional(),
  });

  await executer("/admin/crm", ["/admin", "/admin/crm"], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };

    const { error } = await supabase.from("activites").insert({
      prospect_id: v.prospect_id,
      type: v.type,
      resume: v.resume,
    });
    if (error) throw error;

    const changements: Record<string, unknown> = {};
    if (v.relance_le !== null) changements.relance_le = v.relance_le;
    if (v.statut) {
      changements.statut = v.statut;
      changements.probabilite = STATUT_PROSPECT[v.statut].probabilite;
    }

    if (Object.keys(changements).length > 0) {
      const { error: erreurMaj } = await supabase
        .from("prospects")
        .update(changements)
        .eq("id", v.prospect_id);
      if (erreurMaj) throw erreurMaj;

      if (v.statut) {
        await supabase.from("activites").insert({
          prospect_id: v.prospect_id,
          type: "note",
          resume: `Étape passée à « ${STATUT_PROSPECT[v.statut].libelle} ».`,
        });
      }
    }

    return { ok: "Échange enregistré.", vers: `/admin/crm/${v.prospect_id}` };
  });
}

/** Barre la relance sans rien saisir : « c'est fait, on verra plus tard ». */
export async function annulerRelance(donnees: FormData) {
  const schema = z.object({ id: z.uuid() });

  await executer("/admin/crm", ["/admin", "/admin/crm"], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };
    const { error } = await supabase.from("prospects").update({ relance_le: null }).eq("id", v.id);
    if (error) throw error;
    return { ok: "Relance retirée.", vers: `/admin/crm/${v.id}` };
  });
}

/**
 * Transforme une affaire gagnée en mission suivie par le client.
 *
 * Le compte client doit déjà exister : c'est lui qui donne accès à l'espace,
 * et on ne crée pas un compte à la place de quelqu'un sans qu'il se soit
 * connecté une première fois.
 */
export async function convertirProspect(donnees: FormData) {
  const schema = z.object({
    id: z.uuid(),
    profil_id: z.uuid("Choisissez le compte client."),
    titre: texte(160).min(2, "Donnez un titre à la mission."),
    montant: montantOptionnel,
  });

  await executer("/admin/crm", ["/admin", "/admin/crm", "/compte"], async ({ supabase }) => {
    const v = lire(schema, donnees);
    if (typeof v === "string") return { erreur: v };

    const { data: prospect, error: erreurLecture } = await supabase
      .from("prospects")
      .select("besoin, valeur_estimee, mission_id")
      .eq("id", v.id)
      .single();
    if (erreurLecture) throw erreurLecture;
    if (prospect.mission_id) return { erreur: "Cette affaire a déjà une mission." };

    const { data: mission, error: erreurMission } = await supabase
      .from("missions")
      .insert({
        profil_id: v.profil_id,
        titre: v.titre,
        description: prospect.besoin,
        statut: "cadrage",
        montant: v.montant ?? prospect.valeur_estimee,
        debut_le: new Date().toISOString().slice(0, 10),
      })
      .select("id")
      .single();
    if (erreurMission) throw erreurMission;

    const { error: erreurProspect } = await supabase
      .from("prospects")
      .update({
        statut: "gagne",
        probabilite: 100,
        profil_id: v.profil_id,
        mission_id: mission.id,
        relance_le: null,
      })
      .eq("id", v.id);
    if (erreurProspect) throw erreurProspect;

    await supabase.from("activites").insert({
      prospect_id: v.id,
      type: "note",
      resume: `Affaire gagnée : mission « ${v.titre} » ouverte dans l'espace client.`,
    });

    return { ok: "Affaire gagnée, mission ouverte.", vers: `/admin/missions/${mission.id}` };
  });
}
