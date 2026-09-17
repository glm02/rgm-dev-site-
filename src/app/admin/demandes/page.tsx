import { Mail, Phone } from "lucide-react";

import { BoutonEnvoyer } from "@/components/admin/boutons";
import { Bandeau, Liste, ZoneTexte } from "@/components/admin/formulaire";
import { EntetePage, EtatVide } from "@/components/espace/entete-page";
import { Pastille } from "@/components/espace/pastille";
import { majDemande } from "@/lib/actions/admin";
import { sessionAdminOuRedirection } from "@/lib/auth";
import { dateCourte, depuis } from "@/lib/format";
import { STATUT_DEMANDE } from "@/lib/libelles";
import type { DemandeDevis } from "@/lib/types";

const OPTIONS_STATUT = Object.entries(STATUT_DEMANDE).map(([valeur, { libelle }]) => ({ valeur, libelle }));

export default async function PageDemandes({ searchParams }: PageProps<"/admin/demandes">) {
  const session = await sessionAdminOuRedirection("/admin/demandes");
  if (!session) return null;
  const { ok, erreur } = await searchParams;

  const { data } = await session.supabase
    .from("demandes_devis")
    .select("*")
    .order("cree_le", { ascending: false });
  const demandes = (data ?? []) as DemandeDevis[];

  return (
    <>
      <EntetePage
        titre="Demandes de devis"
        description="Chaque demande arrive aussi par Telegram et par email. Ici, on suit ce qu'elle devient."
      />
      <Bandeau ok={ok} erreur={erreur} />

      {demandes.length === 0 ? (
        <EtatVide
          titre="Aucune demande"
          texte="Les demandes envoyées depuis le formulaire de contact apparaîtront ici."
        />
      ) : (
        <ul className="space-y-3">
          {demandes.map((demande) => {
            const statut = STATUT_DEMANDE[demande.statut];
            return (
              <li key={demande.id}>
                <details className="group rounded-2xl border border-border bg-card open:border-bleu-200 dark:open:border-bleu-800">
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        {demande.nom}
                        {demande.entreprise && <span className="text-muted-foreground"> · {demande.entreprise}</span>}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        {[demande.type_projet, demande.budget, demande.echeance].filter(Boolean).join(" · ") ||
                          demande.message}
                      </p>
                    </div>
                    {demande.utm_source && (
                      <span className="hidden rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground sm:inline">
                        {demande.utm_campaign ?? demande.utm_source}
                      </span>
                    )}
                    <span className="hidden text-xs text-muted-foreground md:block">{depuis(demande.cree_le)}</span>
                    <Pastille ton={statut.ton}>{statut.libelle}</Pastille>
                  </summary>

                  <div className="grid gap-6 border-t border-border p-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                    <div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{demande.message}</p>
                      <dl className="mt-5 grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="size-4 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
                          <a href={`mailto:${demande.email}`} className="text-bleu-700 underline-offset-4 hover:underline dark:text-bleu-300">
                            {demande.email}
                          </a>
                        </div>
                        {demande.telephone && (
                          <div className="flex items-center gap-2">
                            <Phone className="size-4 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
                            <a href={`tel:${demande.telephone.replace(/\s/g, "")}`} className="text-bleu-700 underline-offset-4 hover:underline dark:text-bleu-300">
                              {demande.telephone}
                            </a>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Reçue le {dateCourte(demande.cree_le)}
                          {demande.page_origine ? ` depuis ${demande.page_origine}` : ""}
                          {demande.utm_source ? ` · source ${demande.utm_source}/${demande.utm_medium ?? "—"}` : ""}
                        </p>
                      </dl>
                    </div>

                    <form action={majDemande} className="space-y-4">
                      <input type="hidden" name="id" value={demande.id} />
                      <Liste nom="statut" libelle="Statut" valeur={demande.statut} options={OPTIONS_STATUT} />
                      <ZoneTexte
                        nom="note_interne"
                        libelle="Note interne"
                        valeur={demande.note_interne}
                        lignes={3}
                        placeholder="Rappelé le 12, attend le devis…"
                        aide="Visible uniquement ici."
                      />
                      <BoutonEnvoyer>Enregistrer</BoutonEnvoyer>
                    </form>
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
