import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";

import { BoutonEnvoyer } from "@/components/admin/boutons";
import { Bandeau } from "@/components/admin/formulaire";
import { EntetePage, EtatVide } from "@/components/espace/entete-page";
import { Pastille } from "@/components/espace/pastille";
import { supprimerProjet } from "@/lib/actions/admin";
import { sessionAdminOuRedirection } from "@/lib/auth";
import { fourchetteProjet } from "@/lib/format";
import type { Projet } from "@/lib/types";

export default async function PageRealisationsAdmin({ searchParams }: PageProps<"/admin/realisations">) {
  const session = await sessionAdminOuRedirection("/admin/realisations");
  if (!session) return null;
  const { ok, erreur } = await searchParams;

  const { data } = await session.supabase.from("projets").select("*").order("ordre");
  const projets = (data ?? []) as Projet[];

  return (
    <>
      <EntetePage
        titre="Réalisations"
        description="Le portfolio public. Un projet non publié reste un brouillon invisible."
        actions={
          <Link
            href="/admin/realisations/nouveau"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-[background-color,scale] duration-150 ease-out hover:bg-bleu-700 active:scale-96"
          >
            <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
            Nouvelle réalisation
          </Link>
        }
      />
      <Bandeau ok={ok} erreur={erreur} />

      {projets.length === 0 ? (
        <EtatVide titre="Aucune réalisation" texte="Appliquez la migration 0003 pour charger les projets de départ, ou créez-en une." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Projet</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Budget</th>
                <th className="px-4 py-3 font-medium">État</th>
                <th className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projets.map((projet) => (
                <tr key={projet.id}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/realisations/${projet.id}`} className="font-medium hover:text-bleu-700 dark:hover:text-bleu-300">
                      {projet.titre}
                    </Link>
                    <p className="text-xs text-muted-foreground">{projet.secteur ?? "—"}</p>
                  </td>
                  <td className="hidden px-4 py-3 tabular-nums md:table-cell">
                    {fourchetteProjet(projet.prix_min, projet.prix_max) ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <Pastille ton={projet.publie ? "succes" : "neutre"}>{projet.publie ? "Publié" : "Brouillon"}</Pastille>
                      {projet.en_vedette && <Pastille ton="bleu">Vedette</Pastille>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {projet.publie && (
                        <a
                          href={`/realisations/${projet.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Voir ${projet.titre} sur le site`}
                          className="grid size-8 place-items-center rounded-lg hover:bg-secondary"
                        >
                          <ExternalLink className="size-4" strokeWidth={1.75} aria-hidden="true" />
                        </a>
                      )}
                      <form action={supprimerProjet}>
                        <input type="hidden" name="id" value={projet.id} />
                        <BoutonEnvoyer taille="petit" variante="danger" confirmation={`Supprimer « ${projet.titre} » ?`}>
                          Supprimer
                        </BoutonEnvoyer>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
