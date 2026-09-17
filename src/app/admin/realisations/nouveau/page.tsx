import { Bandeau } from "@/components/admin/formulaire";
import { FormulaireProjet } from "@/components/admin/formulaire-projet";
import { EntetePage } from "@/components/espace/entete-page";
import { sessionAdminOuRedirection } from "@/lib/auth";

export default async function PageNouvelleRealisation({ searchParams }: PageProps<"/admin/realisations/nouveau">) {
  const session = await sessionAdminOuRedirection("/admin/realisations/nouveau");
  if (!session) return null;
  const { ok, erreur } = await searchParams;

  return (
    <>
      <EntetePage titre="Nouvelle réalisation" retour={{ href: "/admin/realisations", libelle: "Réalisations" }} />
      <Bandeau ok={ok} erreur={erreur} />
      <FormulaireProjet />
    </>
  );
}
