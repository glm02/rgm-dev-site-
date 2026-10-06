import { Bandeau } from "@/components/admin/formulaire";
import { FormulaireProspect } from "@/components/crm/formulaire-prospect";
import { EntetePage, Panneau } from "@/components/espace/entete-page";
import { sessionAdminOuRedirection } from "@/lib/auth";

export default async function PageNouvelleAffaire({ searchParams }: PageProps<"/admin/crm/nouveau">) {
  const session = await sessionAdminOuRedirection("/admin/crm/nouveau");
  if (!session) return null;
  const { ok, erreur } = await searchParams;

  return (
    <>
      <EntetePage
        titre="Nouvelle affaire"
        description="Un appel entrant, une recommandation, un contact pris sur un salon — tout ce qui n'est pas passé par le formulaire du site."
        retour={{ href: "/admin/crm", libelle: "Pipeline" }}
      />
      <Bandeau ok={ok} erreur={erreur} />

      <Panneau>
        <FormulaireProspect />
      </Panneau>
    </>
  );
}
