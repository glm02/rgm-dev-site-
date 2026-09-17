import Link from "next/link";

import { BoutonEnvoyer } from "@/components/admin/boutons";
import { Bandeau, Champ, Liste, ZoneTexte } from "@/components/admin/formulaire";
import { EntetePage, EtatVide, Panneau } from "@/components/espace/entete-page";
import { Pastille } from "@/components/espace/pastille";
import { creerMission } from "@/lib/actions/admin";
import { sessionAdminOuRedirection } from "@/lib/auth";
import { dateCourte } from "@/lib/format";
import { STATUT_MISSION } from "@/lib/libelles";
import type { Mission, Profil } from "@/lib/types";

type ProfilAvecMissions = Profil & {
  missions: Pick<Mission, "id" | "titre" | "statut" | "avancement">[];
};

/**
 * Les clients et leurs projets.
 *
 * Un client n'est pas créé ici : il se crée en se connectant une première fois
 * (Google, GitHub ou lien magique), et le déclencheur SQL lui ouvre un profil.
 * On lui rattache ensuite un projet. C'est ce qui évite d'avoir à gérer des
 * mots de passe ou des invitations.
 */
export default async function PageClients({ searchParams }: PageProps<"/admin/clients">) {
  const session = await sessionAdminOuRedirection("/admin/clients");
  if (!session) return null;
  const { ok, erreur } = await searchParams;

  const { data } = await session.supabase
    .from("profils")
    .select("*, missions(id, titre, statut, avancement)")
    .order("cree_le", { ascending: false });
  const profils = (data ?? []) as ProfilAvecMissions[];
  const clients = profils.filter((p) => p.role === "client");

  return (
    <>
      <EntetePage
        titre="Clients"
        description="Un client apparaît ici après sa première connexion. Rattachez-lui ensuite un projet : il le verra dans son espace."
      />
      <Bandeau ok={ok} erreur={erreur} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          {clients.length === 0 ? (
            <EtatVide
              titre="Aucun client connecté"
              texte="Envoyez l'adresse /connexion à votre client : dès sa première connexion, il apparaîtra ici."
            />
          ) : (
            clients.map((client) => (
              <article key={client.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h2 className="font-semibold">{client.nom ?? client.email}</h2>
                    <p className="text-sm text-muted-foreground">
                      {[client.entreprise, client.email, client.telephone].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">Inscrit le {dateCourte(client.cree_le)}</span>
                </div>

                {client.missions.length > 0 ? (
                  <ul className="mt-4 divide-y divide-border border-t border-border">
                    {client.missions.map((mission) => (
                      <li key={mission.id}>
                        <Link
                          href={`/admin/missions/${mission.id}`}
                          className="flex items-center gap-3 py-2.5 text-sm transition-colors duration-150 ease-out hover:text-bleu-700 dark:hover:text-bleu-300"
                        >
                          <span className="flex-1 font-medium">{mission.titre}</span>
                          <span className="tabular-nums">{mission.avancement} %</span>
                          <Pastille ton={STATUT_MISSION[mission.statut].ton}>
                            {STATUT_MISSION[mission.statut].libelle}
                          </Pastille>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">Aucun projet rattaché.</p>
                )}
              </article>
            ))
          )}
        </div>

        <Panneau titre="Nouveau projet client">
          {clients.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Il faut au moins un client connecté pour lui rattacher un projet.
            </p>
          ) : (
            <form action={creerMission} className="space-y-4">
              <Liste
                nom="profil_id"
                libelle="Client"
                vide="Choisir…"
                options={clients.map((c) => ({
                  valeur: c.id,
                  libelle: `${c.nom ?? c.email}${c.entreprise ? ` (${c.entreprise})` : ""}`,
                }))}
              />
              <Champ nom="titre" libelle="Titre du projet" placeholder="Site vitrine et prise de rendez-vous" requis />
              <ZoneTexte nom="description" libelle="Description" lignes={3} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Liste
                  nom="statut"
                  libelle="Statut"
                  valeur="cadrage"
                  options={Object.entries(STATUT_MISSION).map(([valeur, { libelle }]) => ({ valeur, libelle }))}
                />
                <Champ nom="avancement" libelle="Avancement (%)" type="number" valeur={0} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Champ nom="montant" libelle="Montant HT (€)" type="number" />
                <Champ nom="url_live" libelle="Adresse du site" type="url" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Champ nom="debut_le" libelle="Démarrage" type="date" />
                <Champ nom="fin_prevue_le" libelle="Livraison prévue" type="date" />
              </div>
              <BoutonEnvoyer>Créer le projet</BoutonEnvoyer>
            </form>
          )}
        </Panneau>
      </div>
    </>
  );
}
