import { AccueilClient, type DocumentEnAttente, type MissionAvecJalons } from "@/components/espace/accueil-client";
import { EntetePage } from "@/components/espace/entete-page";
import { sessionOuRedirection } from "@/lib/auth";

/**
 * L'accueil de l'espace client : ce qui attend une action, puis les projets.
 * L'affichage vit dans `AccueilClient` ; cette page ne fait que lire.
 */
export default async function PageCompte() {
  const session = await sessionOuRedirection("/compte");
  if (!session) return null;

  const { supabase, profil } = session;

  // La RLS ne renvoie que les missions, documents et messages du client
  // connecté : pas de filtre sur `profil_id` à écrire ici, et surtout pas à
  // oublier.
  const [{ data: missions }, { data: documents }, { data: messages }] = await Promise.all([
    supabase
      .from("missions")
      .select("*, jalons(id, titre, statut, ordre, prevu_le)")
      .order("cree_le", { ascending: false }),
    // « Envoyé » = en attente du client : un devis à accepter, une facture à payer.
    supabase
      .from("documents")
      .select("id, mission_id, type, titre, montant, echeance_le")
      .eq("statut", "envoye")
      .in("type", ["devis", "facture"])
      .order("echeance_le", { ascending: true, nullsFirst: false }),
    supabase.from("messages").select("mission_id").is("lu_le", null).neq("auteur_id", profil.id),
  ]);

  const messagesNonLus: Record<string, number> = {};
  for (const { mission_id } of messages ?? []) {
    messagesNonLus[mission_id] = (messagesNonLus[mission_id] ?? 0) + 1;
  }

  const prenom = profil.nom?.split(" ")[0];

  return (
    <>
      <EntetePage
        titre={prenom ? `Bonjour ${prenom}` : "Mes projets"}
        description="Ce qui attend une réponse de votre part, puis l'avancement de vos projets."
      />
      <AccueilClient
        missions={(missions ?? []) as MissionAvecJalons[]}
        documents={(documents ?? []) as DocumentEnAttente[]}
        messagesNonLus={messagesNonLus}
      />
    </>
  );
}
