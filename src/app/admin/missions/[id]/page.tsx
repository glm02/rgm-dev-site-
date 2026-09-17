import { notFound } from "next/navigation";

import { BoutonEnvoyer } from "@/components/admin/boutons";
import { Bandeau, Champ, Liste, ZoneTexte } from "@/components/admin/formulaire";
import { DetailMission } from "@/components/espace/detail-mission";
import { EntetePage } from "@/components/espace/entete-page";
import {
  ajouterJalon,
  enregistrerDocument,
  majJalon,
  majMission,
  supprimerJalon,
} from "@/lib/actions/admin";
import { sessionAdminOuRedirection } from "@/lib/auth";
import { STATUT_DOCUMENT, STATUT_JALON, STATUT_MISSION, TYPE_DOCUMENT } from "@/lib/libelles";
import type { Document, Jalon, Message, Mission, Profil } from "@/lib/types";

const options = <T extends string>(table: Record<T, string | { libelle: string }>) =>
  (Object.entries(table) as [T, string | { libelle: string }][]).map(([valeur, v]) => ({
    valeur,
    libelle: typeof v === "string" ? v : v.libelle,
  }));

/**
 * Un projet client, côté admin.
 *
 * Même frise que celle du client (`DetailMission`), avec les formulaires
 * d'édition glissés dans ses emplacements. Ce que Rafael modifie ici, le client
 * le voit tel quel au rechargement de son espace.
 */
export default async function PageMissionAdmin({ params, searchParams }: PageProps<"/admin/missions/[id]">) {
  const { id } = await params;
  const session = await sessionAdminOuRedirection(`/admin/missions/${id}`);
  if (!session) return null;
  const { ok, erreur } = await searchParams;
  const { supabase, profil } = session;

  const [{ data: mission }, { data: jalons }, { data: documents }, { data: messages }] = await Promise.all([
    supabase.from("missions").select("*, profils(nom, email, entreprise)").eq("id", id).maybeSingle(),
    supabase.from("jalons").select("*").eq("mission_id", id).order("ordre"),
    supabase.from("documents").select("*").eq("mission_id", id).order("cree_le", { ascending: false }),
    supabase.from("messages").select("*").eq("mission_id", id).order("cree_le"),
  ]);

  if (!mission) notFound();

  const m = mission as Mission & { profils: Pick<Profil, "nom" | "email" | "entreprise"> | null };
  const listeJalons = (jalons ?? []) as Jalon[];
  const client = m.profils?.nom ?? m.profils?.email ?? "Client";

  return (
    <>
      <EntetePage
        titre={m.titre}
        description={`${client}${m.profils?.entreprise ? ` · ${m.profils.entreprise}` : ""}`}
        retour={{ href: "/admin/clients", libelle: "Clients" }}
      />
      <Bandeau ok={ok} erreur={erreur} />

      <DetailMission
        mission={m}
        jalons={listeJalons}
        documents={(documents ?? []) as Document[]}
        messages={(messages ?? []) as Message[]}
        moiId={profil.id}
        nomAutre={client}
        outils={{
          mission: (
            <details className="mt-5 border-t border-border pt-4">
              <summary className="cursor-pointer text-sm font-medium text-bleu-700 dark:text-bleu-300">
                Modifier le projet
              </summary>
              <form action={majMission} className="mt-4 space-y-4">
                <input type="hidden" name="id" value={m.id} />
                <Champ nom="titre" libelle="Titre" valeur={m.titre} requis />
                <ZoneTexte nom="description" libelle="Description" valeur={m.description} lignes={3} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Liste nom="statut" libelle="Statut" valeur={m.statut} options={options(STATUT_MISSION)} />
                  <Champ nom="avancement" libelle="Avancement (%)" type="number" valeur={m.avancement} />
                  <Champ nom="montant" libelle="Montant HT (€)" type="number" valeur={m.montant} />
                  <Champ nom="url_live" libelle="Adresse du site" type="url" valeur={m.url_live} />
                  <Champ nom="debut_le" libelle="Démarrage" type="date" valeur={m.debut_le} />
                  <Champ nom="fin_prevue_le" libelle="Livraison prévue" type="date" valeur={m.fin_prevue_le} />
                </div>
                <BoutonEnvoyer>Enregistrer</BoutonEnvoyer>
              </form>
            </details>
          ),
          jalons: (
            <div className="mt-5 space-y-4 border-t border-border pt-4">
              {listeJalons.length > 0 && (
                <ul className="space-y-2">
                  {listeJalons.map((jalon) => (
                    <li key={jalon.id} className="flex flex-wrap items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-sm">{jalon.titre}</span>
                      <form action={majJalon} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={jalon.id} />
                        <input type="hidden" name="mission_id" value={m.id} />
                        <select
                          name="statut"
                          defaultValue={jalon.statut}
                          aria-label={`Statut de ${jalon.titre}`}
                          className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                        >
                          {options(STATUT_JALON).map((o) => (
                            <option key={o.valeur} value={o.valeur}>
                              {o.libelle}
                            </option>
                          ))}
                        </select>
                        <BoutonEnvoyer taille="petit" variante="secondaire">OK</BoutonEnvoyer>
                      </form>
                      <form action={supprimerJalon}>
                        <input type="hidden" name="id" value={jalon.id} />
                        <input type="hidden" name="mission_id" value={m.id} />
                        <BoutonEnvoyer taille="petit" variante="danger" confirmation="Supprimer cette étape ?">
                          Retirer
                        </BoutonEnvoyer>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
              <details>
                <summary className="cursor-pointer text-sm font-medium text-bleu-700 dark:text-bleu-300">
                  Ajouter une étape
                </summary>
                <form action={ajouterJalon} className="mt-4 space-y-4">
                  <input type="hidden" name="mission_id" value={m.id} />
                  <Champ nom="titre" libelle="Titre" placeholder="Maquettes validées" requis />
                  <ZoneTexte nom="description" libelle="Description" lignes={2} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Champ nom="prevu_le" libelle="Prévu le" type="date" />
                    <Champ nom="ordre" libelle="Ordre" type="number" valeur={listeJalons.length + 1} />
                  </div>
                  <BoutonEnvoyer>Ajouter l&apos;étape</BoutonEnvoyer>
                </form>
              </details>
            </div>
          ),
          documents: (
            <details className="mt-5 border-t border-border pt-4">
              <summary className="cursor-pointer text-sm font-medium text-bleu-700 dark:text-bleu-300">
                Ajouter un document
              </summary>
              <form action={enregistrerDocument} className="mt-4 space-y-4">
                <input type="hidden" name="mission_id" value={m.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Liste nom="type" libelle="Type" valeur="devis" options={options(TYPE_DOCUMENT)} />
                  <Liste
                    nom="statut"
                    libelle="Statut"
                    valeur="brouillon"
                    options={options(STATUT_DOCUMENT)}
                  />
                </div>
                <Champ nom="titre" libelle="Titre" placeholder="Devis site vitrine" requis />
                <Champ
                  nom="url"
                  libelle="Lien du fichier"
                  type="url"
                  aide="Lien Drive, Dropbox ou Supabase Storage."
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Champ nom="reference" libelle="Référence" placeholder="D-2026-014" />
                  <Champ nom="montant" libelle="Montant HT" type="number" />
                  <Champ nom="echeance_le" libelle="Échéance" type="date" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Un document en brouillon reste invisible pour le client.
                </p>
                <BoutonEnvoyer>Ajouter</BoutonEnvoyer>
              </form>
            </details>
          ),
        }}
      />
    </>
  );
}
