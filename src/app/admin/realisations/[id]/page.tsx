import { notFound } from "next/navigation";

import { Bandeau } from "@/components/admin/formulaire";
import { FormulaireProjet } from "@/components/admin/formulaire-projet";
import { EntetePage } from "@/components/espace/entete-page";
import { sessionAdminOuRedirection } from "@/lib/auth";
import type { Projet } from "@/lib/types";

export default async function PageEditionRealisation({ params, searchParams }: PageProps<"/admin/realisations/[id]">) {
  const { id } = await params;
  const session = await sessionAdminOuRedirection(`/admin/realisations/${id}`);
  if (!session) return null;
  const { ok, erreur } = await searchParams;

  const { data } = await session.supabase.from("projets").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const projet = data as Projet;

  return (
    <>
      <EntetePage titre={projet.titre} retour={{ href: "/admin/realisations", libelle: "Réalisations" }} />
      <Bandeau ok={ok} erreur={erreur} />
      <FormulaireProjet projet={projet} />
    </>
  );
}
