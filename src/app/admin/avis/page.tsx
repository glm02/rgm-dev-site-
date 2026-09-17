import { BoutonEnvoyer } from "@/components/admin/boutons";
import { Bandeau, Champ, Liste, ZoneTexte } from "@/components/admin/formulaire";
import { Etoiles } from "@/components/commun/etoiles";
import { EntetePage, EtatVide, Panneau } from "@/components/espace/entete-page";
import { Pastille } from "@/components/espace/pastille";
import { ajouterAvis, basculerAvis, supprimerAvis } from "@/lib/actions/admin";
import { sessionAdminOuRedirection } from "@/lib/auth";
import { dateCourte } from "@/lib/format";
import type { Avis, Projet } from "@/lib/types";

/**
 * La modération des avis.
 *
 * Modérer veut dire publier ou non — jamais réécrire. Il n'y a volontairement
 * aucun champ pour modifier le texte d'un avis client : un témoignage retouché
 * n'est plus un témoignage.
 */
export default async function PageAvisAdmin({ searchParams }: PageProps<"/admin/avis">) {
  const session = await sessionAdminOuRedirection("/admin/avis");
  if (!session) return null;
  const { ok, erreur } = await searchParams;

  const [{ data }, { data: projets }] = await Promise.all([
    session.supabase.from("avis").select("*").order("publie").order("cree_le", { ascending: false }),
    session.supabase.from("projets").select("id, titre").order("ordre"),
  ]);
  const avis = (data ?? []) as Avis[];
  const optionsProjets = ((projets ?? []) as Pick<Projet, "id" | "titre">[]).map((p) => ({
    valeur: p.id,
    libelle: p.titre,
  }));

  return (
    <>
      <EntetePage
        titre="Avis"
        description="Les avis déposés par les clients arrivent non publiés. Publier, mettre en avant, retirer — jamais réécrire."
      />
      <Bandeau ok={ok} erreur={erreur} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          {avis.length === 0 ? (
            <EtatVide titre="Aucun avis" texte="Les avis déposés depuis l'espace client apparaîtront ici pour modération." />
          ) : (
            avis.map((un) => (
              <article key={un.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Etoiles note={un.note} taille="sm" />
                  <Pastille ton={un.publie ? "succes" : "attention"}>{un.publie ? "Publié" : "À modérer"}</Pastille>
                  {un.en_vedette && <Pastille ton="bleu">En avant</Pastille>}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {un.source} · {dateCourte(un.cree_le)}
                  </span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed">{un.contenu}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  — {un.auteur_nom}
                  {[un.auteur_role, un.auteur_entreprise].filter(Boolean).length > 0 &&
                    `, ${[un.auteur_role, un.auteur_entreprise].filter(Boolean).join(" · ")}`}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                  <form action={basculerAvis}>
                    <input type="hidden" name="id" value={un.id} />
                    <input type="hidden" name="champ" value="publie" />
                    <input type="hidden" name="valeur" value={String(!un.publie)} />
                    <BoutonEnvoyer taille="petit" variante={un.publie ? "secondaire" : "principal"}>
                      {un.publie ? "Retirer" : "Publier"}
                    </BoutonEnvoyer>
                  </form>
                  <form action={basculerAvis}>
                    <input type="hidden" name="id" value={un.id} />
                    <input type="hidden" name="champ" value="en_vedette" />
                    <input type="hidden" name="valeur" value={String(!un.en_vedette)} />
                    <BoutonEnvoyer taille="petit" variante="secondaire">
                      {un.en_vedette ? "Ne plus mettre en avant" : "Mettre en avant"}
                    </BoutonEnvoyer>
                  </form>
                  <form action={supprimerAvis} className="ml-auto">
                    <input type="hidden" name="id" value={un.id} />
                    <BoutonEnvoyer taille="petit" variante="danger" confirmation="Supprimer définitivement cet avis ?">
                      Supprimer
                    </BoutonEnvoyer>
                  </form>
                </div>
              </article>
            ))
          )}
        </div>

        <Panneau titre="Ajouter un avis reçu ailleurs">
          <form action={ajouterAvis} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pour un avis Google, un mail ou un message LinkedIn. Recopiez-le tel quel et
              indiquez sa source.
            </p>
            <Champ nom="auteur_nom" libelle="Nom" requis />
            <div className="grid gap-4 sm:grid-cols-2">
              <Champ nom="auteur_role" libelle="Fonction" />
              <Champ nom="auteur_entreprise" libelle="Entreprise" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Liste
                nom="note"
                libelle="Note"
                valeur="5"
                options={[5, 4, 3, 2, 1].map((n) => ({ valeur: String(n), libelle: `${n} / 5` }))}
              />
              <Champ nom="source" libelle="Source" placeholder="Google" requis />
            </div>
            <Liste nom="projet_id" libelle="Réalisation concernée" options={optionsProjets} vide="Aucune" />
            <ZoneTexte nom="contenu" libelle="Texte de l'avis" lignes={5} requis />
            <BoutonEnvoyer>Ajouter (non publié)</BoutonEnvoyer>
          </form>
        </Panneau>
      </div>
    </>
  );
}
