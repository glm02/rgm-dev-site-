import { notFound } from "next/navigation";

import { DetailMission } from "@/components/espace/detail-mission";
import { EntetePage } from "@/components/espace/entete-page";
import { sessionOuRedirection } from "@/lib/auth";
import { avecLiens } from "@/lib/stockage";
import type { Document, Jalon, Message, Mission } from "@/lib/types";

export default async function PageProjetClient({ params }: PageProps<"/compte/projets/[id]">) {
  const { id } = await params;
  const session = await sessionOuRedirection(`/compte/projets/${id}`);
  if (!session) return null;

  const { supabase, profil } = session;

  // Toutes ces lectures passent par la RLS : une mission d'un autre client
  // renvoie `null`, et la page répond 404 — sans jamais confirmer qu'elle existe.
  const [{ data: mission }, { data: jalons }, { data: documents }, { data: messages }] =
    await Promise.all([
      supabase.from("missions").select("*").eq("id", id).maybeSingle(),
      supabase.from("jalons").select("*").eq("mission_id", id),
      supabase.from("documents").select("*").eq("mission_id", id).order("cree_le", { ascending: false }),
      supabase.from("messages").select("*").eq("mission_id", id).order("cree_le"),
    ]);

  if (!mission) notFound();

  // Les fichiers du stockage privé deviennent des liens signés valables une
  // heure, fabriqués avec la session du client : Storage vérifie qu'il ne
  // signe que les fichiers de ses propres projets.
  const documentsAvecLiens = await avecLiens(supabase, (documents ?? []) as Document[]);

  return (
    <>
      <EntetePage titre={(mission as Mission).titre} retour={{ href: "/compte", libelle: "Mes projets" }} />
      <DetailMission
        mission={mission as Mission}
        jalons={(jalons ?? []) as Jalon[]}
        documents={documentsAvecLiens}
        messages={(messages ?? []) as Message[]}
        moiId={profil.id}
        nomAutre="RGM Dev"
      />
    </>
  );
}
