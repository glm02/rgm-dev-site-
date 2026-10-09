import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, UserRoundCheck, UserRoundX } from "lucide-react";

import { BoutonEnvoyer } from "@/components/admin/boutons";
import { Bandeau, Champ, Liste, ZoneTexte } from "@/components/admin/formulaire";
import { EntetePage, EtatVide, Panneau } from "@/components/espace/entete-page";
import { Pastille } from "@/components/espace/pastille";
import { creerMission } from "@/lib/actions/admin";
import { sessionAdminOuRedirection } from "@/lib/auth";
import { dateCourte } from "@/lib/format";
import { STATUT_MISSION } from "@/lib/libelles";
import type { Mission, Profil, Prospect } from "@/lib/types";

type MissionResumee = Pick<Mission, "id" | "titre" | "statut" | "avancement" | "url_live" | "profil_id">;

type ClientPipeline = Pick<
  Prospect,
  "id" | "entreprise" | "contact" | "email" | "telephone" | "ville" | "secteur" | "profil_id"
> & { missions: MissionResumee[] };

type CompteClient = Profil & { missions: MissionResumee[] };

/**
 * Les clients et leurs projets.
 *
 * Deux sources, réunies sur une seule page :
 * - les affaires **gagnées** du pipeline : ce sont les vrais clients, qu'ils
 *   aient un compte ou non (la plupart n'en ont jamais eu besoin) ;
 * - les **comptes** clients qui ne correspondent à aucune affaire (quelqu'un
 *   qui s'est inscrit de lui-même).
 *
 * Une mission se suit dans l'admin dès sa création ; le client ne la voit dans
 * son espace qu'une fois son compte rattaché, depuis la fiche de la mission.
 */
export default async function PageClients({ searchParams }: PageProps<"/admin/clients">) {
  const session = await sessionAdminOuRedirection("/admin/clients");
  if (!session) return null;
  const { ok, erreur } = await searchParams;
  const { supabase } = session;

  const [{ data: gagnes }, { data: comptes }, { data: sites }] = await Promise.all([
    supabase
      .from("prospects")
      .select(
        "id, entreprise, contact, email, telephone, ville, secteur, profil_id, missions:missions!missions_prospect_id_fkey(id, titre, statut, avancement, url_live, profil_id)",
      )
      .eq("statut", "gagne")
      .order("entreprise"),
    supabase
      .from("profils")
      .select("*, missions:missions!missions_profil_id_fkey(id, titre, statut, avancement, url_live, profil_id)")
      .eq("role", "client")
      .order("cree_le", { ascending: false }),
    supabase.from("sites_supervises").select("url, dernier_ok").eq("actif", true),
  ]);

  const clients = (gagnes ?? []) as ClientPipeline[];
  const tousLesComptes = (comptes ?? []) as CompteClient[];
  const comptesLies = new Set(clients.map((c) => c.profil_id).filter(Boolean));
  const comptesSeuls = tousLesComptes.filter((compte) => !comptesLies.has(compte.id));

  // L'état de supervision d'un site, retrouvé par son adresse.
  const etatSite = new Map((sites ?? []).map((s) => [normaliser(s.url), s.dernier_ok as boolean | null]));

  const options = [
    ...clients.map((c) => ({ valeur: `p:${c.id}`, libelle: c.entreprise ?? c.contact })),
    ...comptesSeuls.map((c) => ({
      valeur: `c:${c.id}`,
      libelle: `${c.nom ?? c.email}${c.entreprise ? ` (${c.entreprise})` : ""} — compte`,
    })),
  ];

  return (
    <>
      <EntetePage
        titre="Clients"
        description={`${clients.length} client${clients.length > 1 ? "s" : ""} signé${clients.length > 1 ? "s" : ""}${comptesSeuls.length ? `, ${comptesSeuls.length} compte${comptesSeuls.length > 1 ? "s" : ""} sans affaire` : ""}. Un projet se suit ici dès sa création ; le client le voit dans son espace une fois son compte rattaché.`}
      />
      <Bandeau ok={ok} erreur={erreur} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          {clients.length === 0 && comptesSeuls.length === 0 ? (
            <EtatVide
              titre="Aucun client pour l'instant"
              texte="Une affaire marquée « gagnée » dans le pipeline apparaît ici, avec ou sans compte."
            />
          ) : (
            <>
              {clients.map((client) => (
                <article key={client.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold">
                        <Link
                          href={`/admin/crm/${client.id}`}
                          className="transition-colors duration-150 ease-out hover:text-bleu-700 dark:hover:text-bleu-300"
                        >
                          {client.entreprise ?? client.contact}
                        </Link>
                      </h2>
                      {client.secteur && <p className="text-sm">{client.secteur}</p>}
                    </div>
                    {client.profil_id ? (
                      <Pastille ton="succes">
                        <UserRoundCheck className="size-3.5" aria-hidden="true" />
                        Compte actif
                      </Pastille>
                    ) : (
                      <Pastille ton="neutre">
                        <UserRoundX className="size-3.5" aria-hidden="true" />
                        Sans compte
                      </Pastille>
                    )}
                  </div>

                  <Coordonnees
                    contact={client.entreprise && client.contact !== client.entreprise ? client.contact : null}
                    email={client.email}
                    telephone={client.telephone}
                    ville={client.ville}
                  />

                  <ListeMissions missions={client.missions} etatSite={etatSite} />
                </article>
              ))}

              {comptesSeuls.length > 0 && (
                <h2 className="pt-4 text-sm font-semibold tracking-wide uppercase">Comptes sans affaire</h2>
              )}
              {comptesSeuls.map((compte) => (
                <article key={compte.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-semibold">{compte.nom ?? compte.email}</h2>
                    <span className="text-xs">Inscrit le {dateCourte(compte.cree_le)}</span>
                  </div>
                  <Coordonnees contact={compte.entreprise} email={compte.email} telephone={compte.telephone} ville={null} />
                  <ListeMissions missions={compte.missions} etatSite={etatSite} />
                </article>
              ))}
            </>
          )}
        </div>

        <Panneau titre="Nouveau projet client">
          {options.length === 0 ? (
            <p className="text-sm">
              Marquez d&apos;abord une affaire comme gagnée dans le{" "}
              <Link href="/admin/crm" className="font-medium text-bleu-700 underline underline-offset-4 dark:text-bleu-300">
                pipeline
              </Link>
              .
            </p>
          ) : (
            <form action={creerMission} className="space-y-4">
              <Liste nom="client" libelle="Client" vide="Choisir…" options={options} />
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

function normaliser(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

function Coordonnees({
  contact,
  email,
  telephone,
  ville,
}: {
  contact: string | null;
  email: string | null;
  telephone: string | null;
  ville: string | null;
}) {
  const elements = [
    contact && { icone: null, texte: contact, href: null },
    email && { icone: Mail, texte: email, href: `mailto:${email}` },
    telephone && { icone: Phone, texte: telephone, href: `tel:${telephone.replace(/\s/g, "")}` },
    ville && { icone: MapPin, texte: ville, href: null },
  ].filter(Boolean) as { icone: typeof Mail | null; texte: string; href: string | null }[];

  if (elements.length === 0) return null;

  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
      {elements.map(({ icone: Icone, texte, href }) => (
        <li key={texte} className="inline-flex items-center gap-1.5">
          {Icone && <Icone className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />}
          {href ? (
            <a href={href} className="underline-offset-4 hover:underline">
              {texte}
            </a>
          ) : (
            texte
          )}
        </li>
      ))}
    </ul>
  );
}

function ListeMissions({
  missions,
  etatSite,
}: {
  missions: MissionResumee[];
  etatSite: Map<string, boolean | null>;
}) {
  if (missions.length === 0) {
    return <p className="mt-4 border-t border-border pt-3 text-sm">Aucun projet rattaché.</p>;
  }

  return (
    <ul className="mt-4 divide-y divide-border border-t border-border">
      {missions.map((mission) => {
        const enLigne = mission.url_live ? etatSite.get(normaliser(mission.url_live)) : undefined;
        return (
          <li key={mission.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2.5 text-sm">
            <Link
              href={`/admin/missions/${mission.id}`}
              className="min-w-0 flex-1 font-medium transition-colors duration-150 ease-out hover:text-bleu-700 dark:hover:text-bleu-300"
            >
              {mission.titre}
            </Link>
            {mission.url_live && (
              <a
                href={mission.url_live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs underline-offset-4 hover:underline"
              >
                {enLigne !== undefined && (
                  <span
                    className={`size-2 rounded-full ${enLigne === false ? "bg-destructive" : "bg-emerald-500"}`}
                    aria-label={enLigne === false ? "Site en panne" : "Site supervisé, en ligne"}
                  />
                )}
                {normaliser(mission.url_live)}
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </a>
            )}
            <span className="tabular-nums">{mission.avancement} %</span>
            <Pastille ton={STATUT_MISSION[mission.statut].ton}>{STATUT_MISSION[mission.statut].libelle}</Pastille>
          </li>
        );
      })}
    </ul>
  );
}
