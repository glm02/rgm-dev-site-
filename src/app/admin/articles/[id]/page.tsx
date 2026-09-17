import { notFound } from "next/navigation";

import { Bandeau } from "@/components/admin/formulaire";
import { FormulaireArticle } from "@/components/admin/formulaire-article";
import { EntetePage } from "@/components/espace/entete-page";
import { sessionAdminOuRedirection } from "@/lib/auth";
import type { Article } from "@/lib/types";

export default async function PageEditionArticle({ params, searchParams }: PageProps<"/admin/articles/[id]">) {
  const { id } = await params;
  const session = await sessionAdminOuRedirection(`/admin/articles/${id}`);
  if (!session) return null;
  const { ok, erreur } = await searchParams;

  const { data } = await session.supabase.from("articles").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const article = data as Article;

  return (
    <>
      <EntetePage titre={article.titre} retour={{ href: "/admin/articles", libelle: "Blog" }} />
      <Bandeau ok={ok} erreur={erreur} />
      <FormulaireArticle article={article} />
    </>
  );
}
