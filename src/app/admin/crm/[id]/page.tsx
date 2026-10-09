import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bell,
  CalendarCheck,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  StickyNote,
} from "lucide-react";

import { BarreSegments } from "@/components/admin/barre-segments";
import { BoutonEnvoyer } from "@/components/admin/boutons";
import { Bandeau, Champ, Liste, ZoneTexte } from "@/components/admin/formulaire";
import { FormulaireProspect } from "@/components/crm/formulaire-prospect";
import { EntetePage, Panneau } from "@/components/espace/entete-page";
import { Pastille } from "@/components/espace/pastille";
import {
  ajouterActivite,
  annulerRelance,
  convertirProspect,
  supprimerProspect,
} from "@/lib/actions/crm";
import { sessionAdminOuRedirection } from "@/lib/auth";
import { joursSansNouvelles, valeurPonderee } from "@/lib/crm";
import { dateCourte, dateLongue, depuis, euros } from "@/lib/format";
import { STATUT_PROSPECT, TYPE_ACTIVITE } from "@/lib/libelles";
import type { Activite, Profil, Prospect, TypeActivite } from "@/lib/types";

const ICONE_ACTIVITE: Record<TypeActivite, typeof Phone> = {
  appel: Phone,
  email: Mail,
  rdv: CalendarCheck,
  devis: FileText,
  relance: Bell,
  note: StickyNote,
};

const TYPES = Object.entries(TYPE_ACTIVITE).map(([valeur, { libelle }]) => ({ valeur, libelle }));
const ETAPES = Object.entries(STATUT_PROSPECT).map(([valeur, { libelle }]) => ({ valeur, libelle }));

/**
 * La fiche d'une affaire.
 *
 * À gauche ce qu'on fait maintenant — noter l'échange, poser la relance ; à
 * droite ce qu'on consulte. L'ordre n'est pas décoratif : la page s'ouvre
 * juste après un appel, et le champ de saisie doit être le premier élément
 * utile sous le titre.
 */
export default async function PageAffaire({ params, searchParams }: PageProps<"/admin/crm/[id]">) {
  const { id } = await params;
  const session = await sessionAdminOuRedirection(`/admin/crm/${id}`);
  if (!session) return null;
  const { ok, erreur } = await searchParams;

  const [requeteProspect, requeteActivites, requeteClients] = await Promise.all([
    session.supabase.from("prospects").select("*").eq("id", id).maybeSingle(),
    session.supabase
      .from("activites")
      .select("*")
      .eq("prospect_id", id)
      .order("fait_le", { ascending: false }),
    session.supabase.from("profils").select("id, nom, email, entreprise").eq("role", "client"),
  ]);

  const prospect = requeteProspect.data as Prospect | null;
  if (!prospect) notFound();

  const activites = (requeteActivites.data ?? []) as Activite[];
  const clients = (requeteClients.data ?? []) as Pick<Profil, "id" | "nom" | "email" | "entreprise">[];
  const statut = STATUT_PROSPECT[prospect.statut];
  const aujourdHui = new Date().toISOString().slice(0, 10);
  const relanceDue = Boolean(prospect.relance_le && prospect.relance_le <= aujourdHui);

  return (
    <>
      <EntetePage
        titre={prospect.entreprise ?? prospect.contact}
        description={[prospect.besoin, prospect.ville].filter(Boolean).join(" · ") || undefined}
        retour={{ href: "/admin/crm", libelle: "Pipeline" }}
        actions={<Pastille ton={statut.ton}>{statut.libelle}</Pastille>}
      />
      <Bandeau ok={ok} erreur={erreur} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <Panneau titre="Noter un échange">
            <form action={ajouterActivite} className="space-y-4">
              <input type="hidden" name="prospect_id" value={prospect.id} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Liste nom="type" libelle="Nature" valeur="appel" options={TYPES} />
                <Liste
                  nom="statut"
                  libelle="Faire avancer l'affaire"
                  valeur=""
                  options={ETAPES}
                  vide="Laisser à cette étape"
                />
              </div>
              <ZoneTexte
                nom="resume"
                libelle="Ce qui s'est dit"
                lignes={3}
                requis
                placeholder="Rappelé, il compare deux devis. Décide avant fin du mois."
              />
              <Champ
                nom="relance_le"
                libelle="Prochaine relance"
                type="date"
                valeur={prospect.relance_le}
                aide="Laissez vide pour ne pas y toucher."
              />
              <BoutonEnvoyer>Enregistrer l&apos;échange</BoutonEnvoyer>
            </form>
          </Panneau>

          <Panneau titre={`Journal · ${activites.length}`}>
            {activites.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Rien de noté pour l&apos;instant. Le premier échange ouvrira ce journal.
              </p>
            ) : (
              <ol className="relative">
                {activites.map((activite, index) => {
                  const Icone = ICONE_ACTIVITE[activite.type];
                  const dernier = index === activites.length - 1;

                  return (
                    <li key={activite.id} className="relative flex gap-4 pb-5 last:pb-0">
                      {!dernier && (
                        <span
                          aria-hidden="true"
                          className="absolute top-8 bottom-0 left-[15px] w-px bg-border"
                        />
                      )}
                      <span className="relative grid size-8 shrink-0 place-items-center rounded-full border border-border bg-background text-muted-foreground">
                        <Icone className="size-4" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1 pt-1">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {activite.resume}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                          {TYPE_ACTIVITE[activite.type].libelle} · {dateLongue(activite.fait_le)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </Panneau>

          <Panneau titre="Modifier la fiche">
            <FormulaireProspect prospect={prospect} />
          </Panneau>
        </div>

        <div className="space-y-5">
          <Panneau titre="L'affaire">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Valeur estimée</dt>
                <dd className="mt-0.5 text-2xl font-semibold tabular-nums">
                  {prospect.valeur_estimee == null ? "—" : `${euros(prospect.valeur_estimee)} HT`}
                </dd>
                {prospect.valeur_estimee != null && (
                  <dd className="text-xs text-muted-foreground tabular-nums">
                    {euros(Math.round(valeurPonderee(prospect)))} une fois pondéré
                  </dd>
                )}
              </div>

              <div>
                <dt className="flex items-baseline justify-between text-muted-foreground">
                  Probabilité
                  <span className="font-medium text-foreground tabular-nums">
                    {prospect.probabilite} %
                  </span>
                </dt>
                <dd className="mt-1.5">
                  <BarreSegments
                    pourcentage={prospect.probabilite}
                    segments={24}
                    className="w-full"
                    libelle={`Probabilité ${prospect.probabilite} %`}
                  />
                </dd>
              </div>

              <div className="border-t border-border pt-4">
                <dt className="text-muted-foreground">Dernière activité</dt>
                <dd className="mt-0.5 font-medium">
                  {depuis(prospect.derniere_activite_le)}
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    ({joursSansNouvelles(prospect)} j)
                  </span>
                </dd>
              </div>

              {prospect.relance_le && (
                <div>
                  <dt className="text-muted-foreground">Relance prévue</dt>
                  <dd
                    className={`mt-0.5 font-medium tabular-nums ${relanceDue ? "text-destructive" : ""}`}
                  >
                    {dateCourte(prospect.relance_le)}
                  </dd>
                  <dd className="mt-2">
                    <form action={annulerRelance}>
                      <input type="hidden" name="id" value={prospect.id} />
                      <BoutonEnvoyer variante="discret" taille="petit">
                        Retirer la relance
                      </BoutonEnvoyer>
                    </form>
                  </dd>
                </div>
              )}

              {prospect.etiquettes.length > 0 && (
                <div className="border-t border-border pt-4">
                  <dt className="text-muted-foreground">Étiquettes</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1.5">
                    {prospect.etiquettes.map((etiquette) => (
                      <span
                        key={etiquette}
                        className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                      >
                        {etiquette}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </Panneau>

          <Panneau titre="Contact">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Interlocuteur</dt>
                <dd className="mt-0.5 font-medium">{prospect.contact}</dd>
              </div>
              {prospect.email && (
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
                  <a
                    href={`mailto:${prospect.email}`}
                    className="text-bleu-700 underline-offset-4 hover:underline dark:text-bleu-300"
                  >
                    {prospect.email}
                  </a>
                </div>
              )}
              {prospect.telephone && (
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
                  <a
                    href={`tel:${prospect.telephone.replace(/\s/g, "")}`}
                    className="text-bleu-700 underline-offset-4 hover:underline dark:text-bleu-300"
                  >
                    {prospect.telephone}
                  </a>
                </div>
              )}
              <div className="border-t border-border pt-3 text-xs text-muted-foreground">
                {[prospect.secteur, prospect.source ? `source ${prospect.source}` : null]
                  .filter(Boolean)
                  .join(" · ")}
                <br />
                Créée le {dateCourte(prospect.cree_le)}
              </div>
              {prospect.demande_id && (
                <div>
                  <Link
                    href="/admin/demandes"
                    className="inline-flex items-center gap-1 text-sm text-bleu-700 underline-offset-4 hover:underline dark:text-bleu-300"
                  >
                    Voir la demande d&apos;origine
                    <ExternalLink className="size-3.5" strokeWidth={2} aria-hidden="true" />
                  </Link>
                </div>
              )}
            </dl>

            {prospect.note && (
              <p className="mt-4 rounded-xl bg-secondary/60 p-3 text-sm leading-relaxed whitespace-pre-wrap">
                {prospect.note}
              </p>
            )}
          </Panneau>

          {prospect.mission_id ? (
            <Panneau titre="Mission">
              <p className="text-sm text-muted-foreground">
                Cette affaire a été gagnée et suivie dans l&apos;espace client.
              </p>
              <Link
                href={`/admin/missions/${prospect.mission_id}`}
                className="mt-3 inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-[background-color,scale] duration-150 ease-out hover:bg-secondary active:scale-96"
              >
                Ouvrir la mission
              </Link>
            </Panneau>
          ) : (
            <Panneau titre="Gagner l'affaire">
              <form action={convertirProspect} className="space-y-4">
                <input type="hidden" name="id" value={prospect.id} />
                <Liste
                  nom="profil_id"
                  libelle="Compte client (facultatif)"
                  options={clients.map((client) => ({
                    valeur: client.id,
                    libelle: client.entreprise ?? client.nom ?? client.email,
                  }))}
                  vide="Pas encore de compte"
                  aide="Sans compte, la mission se suit dans l'admin ; le client la verra une fois son compte rattaché."
                />
                <Champ
                  nom="titre"
                  libelle="Titre de la mission"
                  valeur={prospect.besoin ?? ""}
                  requis
                />
                <Champ
                  nom="montant"
                  libelle="Montant signé"
                  valeur={prospect.valeur_estimee ?? ""}
                  aide="En euros HT. Vide : la valeur estimée."
                />
                <BoutonEnvoyer>Marquer gagnée et ouvrir la mission</BoutonEnvoyer>
              </form>
            </Panneau>
          )}

          <form action={supprimerProspect}>
            <input type="hidden" name="id" value={prospect.id} />
            <BoutonEnvoyer
              variante="danger"
              taille="petit"
              confirmation="Supprimer cette affaire et tout son journal ?"
            >
              Supprimer l&apos;affaire
            </BoutonEnvoyer>
          </form>
        </div>
      </div>
    </>
  );
}
