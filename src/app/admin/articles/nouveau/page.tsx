import { Bandeau } from "@/components/admin/formulaire";
import { FormulaireArticle } from "@/components/admin/formulaire-article";
import { EntetePage } from "@/components/espace/entete-page";
import { sessionAdminOuRedirection } from "@/lib/auth";

export default async function PageNouvelArticle({ searchParams }: PageProps<"/admin/articles/nouveau">) {
  const session = await sessionAdminOuRedirection("/admin/articles/nouveau");
  if (!session) return null;
  const { ok, erreur } = await searchParams;

  return (
    <>
      <EntetePage titre="Nouvel article" retour={{ href: "/admin/articles", libelle: "Blog" }} />
      <Bandeau ok={ok} erreur={erreur} />
      <FormulaireArticle />
    </>
  );
}
