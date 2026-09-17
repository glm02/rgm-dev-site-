import Link from "next/link";
import { Plus } from "lucide-react";

import { BoutonEnvoyer } from "@/components/admin/boutons";
import { Bandeau } from "@/components/admin/formulaire";
import { EntetePage, EtatVide } from "@/components/espace/entete-page";
import { Pastille } from "@/components/espace/pastille";
import { supprimerArticle } from "@/lib/actions/admin";
import { sessionAdminOuRedirection } from "@/lib/auth";
import { dateCourte } from "@/lib/format";
import type { Article } from "@/lib/types";

export default async function PageArticlesAdmin({ searchParams }: PageProps<"/admin/articles">) {
  const session = await sessionAdminOuRedirection("/admin/articles");
  if (!session) return null;
  const { ok, erreur } = await searchParams;

  const { data } = await session.supabase.from("articles").select("*").order("cree_le", { ascending: false });
  const articles = (data ?? []) as Article[];

  return (
    <>
      <EntetePage
        titre="Blog"
        description="Des articles utiles, écrits pour les recherches de vos futurs clients à Lyon."
        actions={
          <Link
            href="/admin/articles/nouveau"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-[background-color,scale] duration-150 ease-out hover:bg-bleu-700 active:scale-96"
          >
            <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
            Nouvel article
          </Link>
        }
      />
      <Bandeau ok={ok} erreur={erreur} />

      {articles.length === 0 ? (
        <EtatVide titre="Aucun article" texte="Le premier article sera aussi la première page du blog." />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {articles.map((article) => (
            <li key={article.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/articles/${article.id}`} className="font-medium hover:text-bleu-700 dark:hover:text-bleu-300">
                  {article.titre}
                </Link>
                <p className="text-xs text-muted-foreground">
                  /blog/{article.slug} · {article.publie_le ? dateCourte(article.publie_le) : "non daté"}
                </p>
              </div>
              <Pastille ton={article.publie ? "succes" : "neutre"}>{article.publie ? "Publié" : "Brouillon"}</Pastille>
              <form action={supprimerArticle}>
                <input type="hidden" name="id" value={article.id} />
                <BoutonEnvoyer taille="petit" variante="danger" confirmation={`Supprimer « ${article.titre} » ?`}>
                  Supprimer
                </BoutonEnvoyer>
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
