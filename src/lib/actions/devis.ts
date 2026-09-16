"use server";

import { z } from "zod";

import { clientServeur } from "@/lib/supabase/serveur";
import { notifierDemandeDevis } from "@/lib/notifications";

/**
 * La demande de devis.
 *
 * Rappel de sécurité : un Server Action est joignable par requête POST
 * directe, sans passer par le formulaire. Tout ce qui est vérifié ici l'est
 * côté serveur, et la table `demandes_devis` n'autorise que l'insertion —
 * personne ne peut relire les coordonnées des prospects (voir 0002_rls.sql).
 */

const Schema = z.object({
  nom: z
    .string()
    .trim()
    .min(2, "Indiquez votre nom.")
    .max(120, "Ce nom est trop long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Cette adresse email ne semble pas valide."),
  telephone: z.string().trim().max(30).optional().or(z.literal("")),
  entreprise: z.string().trim().max(160).optional().or(z.literal("")),
  type_projet: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  echeance: z.string().trim().max(60).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Décrivez votre projet en quelques phrases (20 caractères minimum).")
    .max(5000, "Ce message est trop long. Allez à l'essentiel, on en parlera de vive voix."),
});

export type EtatDevis = {
  statut: "inerte" | "succes" | "erreur";
  message?: string;
  /** Les erreurs par champ, pour les afficher sous le bon input. */
  erreurs?: Record<string, string[]>;
  /** Ce que l'utilisateur avait saisi, pour ne pas le lui faire retaper. */
  valeurs?: Record<string, string>;
};

export const ETAT_INITIAL: EtatDevis = { statut: "inerte" };

export async function envoyerDemandeDevis(
  _precedent: EtatDevis,
  donnees: FormData,
): Promise<EtatDevis> {
  // Le piège à robots : un champ invisible qu'un humain ne remplit jamais.
  // Rempli = on répond « merci » sans rien enregistrer. Dire « rejeté »
  // apprendrait au robot à contourner le piège.
  if (donnees.get("site_web")) {
    return { statut: "succes", message: "Merci, votre demande a bien été envoyée." };
  }

  const brut = Object.fromEntries(donnees.entries());
  const valeurs = Object.fromEntries(
    Object.entries(brut)
      .filter(([cle]) => cle !== "site_web")
      .map(([cle, valeur]) => [cle, String(valeur)]),
  );

  const analyse = Schema.safeParse(brut);

  if (!analyse.success) {
    return {
      statut: "erreur",
      message: "Il reste quelque chose à corriger.",
      erreurs: z.flattenError(analyse.error).fieldErrors as Record<string, string[]>,
      valeurs,
    };
  }

  const demande = {
    ...analyse.data,
    telephone: analyse.data.telephone || null,
    entreprise: analyse.data.entreprise || null,
    type_projet: analyse.data.type_projet || null,
    budget: analyse.data.budget || null,
    echeance: analyse.data.echeance || null,
    // Ces champs mesurent Google Ads : sans eux, on dépense sans savoir ce qui
    // convertit. Ils sont posés en champs cachés par le formulaire.
    utm_source: String(donnees.get("utm_source") ?? "") || null,
    utm_medium: String(donnees.get("utm_medium") ?? "") || null,
    utm_campaign: String(donnees.get("utm_campaign") ?? "") || null,
    page_origine: String(donnees.get("page_origine") ?? "") || null,
  };

  const supabase = await clientServeur();

  if (supabase) {
    const { error } = await supabase.from("demandes_devis").insert(demande);

    if (error) {
      console.error("[devis] insertion impossible", error);
      return {
        statut: "erreur",
        message:
          "L'enregistrement a échoué de mon côté. Écrivez-moi directement à glm07rafael@gmail.com, je vous réponds aussi vite.",
        valeurs,
      };
    }
  } else {
    // Supabase pas encore branché : on trace pour ne rien perdre pendant la
    // phase de mise au point, et on prévient quand même par email.
    console.warn("[devis] Supabase non configuré — demande reçue :", demande);
  }

  // La notification ne doit jamais faire échouer la demande : elle est
  // enregistrée, c'est ce qui compte. Une alerte ratée se rattrape, une
  // demande perdue non.
  await notifierDemandeDevis(demande).catch((erreur) =>
    console.error("[devis] notification impossible", erreur),
  );

  return {
    statut: "succes",
    message:
      "Merci, c'est bien reçu. Je reviens vers vous sous 48 heures ouvrées avec un premier retour.",
  };
}
