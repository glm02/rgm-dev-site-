import { Etoiles } from "@/components/commun/etoiles";
import { EntetePage, EtatVide, Panneau } from "@/components/espace/entete-page";
import { FormulaireAvis } from "@/components/espace/formulaire-avis";
import { Pastille } from "@/components/espace/pastille";
import { sessionOuRedirection } from "@/lib/auth";
import { dateLongue } from "@/lib/format";
import type { Avis } from "@/lib/types";

export default async function PageAvisClient() {
  const session = await sessionOuRedirection("/compte/avis");
  if (!session) return null;

  const { supabase, profil } = session;

  const [{ count: livrees }, { data: mesAvis }] = await Promise.all([
    supabase
      .from("missions")
      .select("id", { count: "exact", head: true })
      .in("statut", ["livre", "maintenance"]),
    // La politique de lecture laisse un client voir ses propres avis, même non
    // publiés : c'est ce qui lui permet de suivre la modération.
    supabase
      .from("avis")
      .select("*")
      .eq("profil_id", profil.id)
      .order("cree_le", { ascending: false }),
  ]);

  const avis = (mesAvis ?? []) as Avis[];

  return (
    <>
      <EntetePage
        titre="Donner mon avis"
        description="Votre témoignage aide les prochains clients à se décider. Il est publié tel quel, sans retouche."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {livrees ? (
          <Panneau>
            <FormulaireAvis nomParDefaut={profil.nom ?? ""} />
          </Panneau>
        ) : (
          <EtatVide
            titre="Un peu de patience"
            texte="Vous pourrez déposer votre avis une fois votre projet livré — un témoignage en plein chantier ne dirait pas grand-chose aux suivants."
          />
        )}

        <Panneau titre="Mes avis">
          {avis.length === 0 ? (
            <p className="text-sm text-muted-foreground">Vous n&apos;avez pas encore déposé d&apos;avis.</p>
          ) : (
            <ul className="space-y-5">
              {avis.map((un) => (
                <li key={un.id} className="border-b border-border pb-5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <Etoiles note={un.note} taille="sm" />
                    <Pastille ton={un.publie ? "succes" : "attention"}>
                      {un.publie ? "Publié" : "En relecture"}
                    </Pastille>
                  </div>
                  <p className="mt-2.5 line-clamp-4 text-sm leading-relaxed">{un.contenu}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{dateLongue(un.cree_le)}</p>
                </li>
              ))}
            </ul>
          )}
        </Panneau>
      </div>
    </>
  );
}
