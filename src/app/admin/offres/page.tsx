import { BoutonEnvoyer } from "@/components/admin/boutons";
import { Bandeau, Case, Champ, Liste, ZoneTexte } from "@/components/admin/formulaire";
import { EntetePage, Panneau } from "@/components/espace/entete-page";
import { Pastille } from "@/components/espace/pastille";
import { enregistrerOffre, enregistrerService, supprimerOffre } from "@/lib/actions/admin";
import { sessionAdminOuRedirection } from "@/lib/auth";
import { fourchette } from "@/lib/format";
import type { Offre, Service } from "@/lib/types";

const UNITES = [
  { valeur: "forfait", libelle: "Forfait" },
  { valeur: "mois", libelle: "Par mois" },
  { valeur: "jour", libelle: "Par jour" },
  { valeur: "heure", libelle: "Par heure" },
];

/**
 * Services et tarifs.
 *
 * Les prix affichés sur le site sont ici, et nulle part ailleurs : modifier une
 * fourchette la met à jour sur l'accueil, la page tarifs et la page service en
 * même temps.
 */
export default async function PageOffres({ searchParams }: PageProps<"/admin/offres">) {
  const session = await sessionAdminOuRedirection("/admin/offres");
  if (!session) return null;
  const { ok, erreur } = await searchParams;

  const [{ data: servicesBruts }, { data: offresBrutes }] = await Promise.all([
    session.supabase.from("services").select("*").order("ordre"),
    session.supabase.from("offres").select("*").order("ordre"),
  ]);
  const services = (servicesBruts ?? []) as Service[];
  const offres = (offresBrutes ?? []) as Offre[];
  const optionsServices = services.map((s) => ({ valeur: s.id, libelle: s.titre }));

  return (
    <>
      <EntetePage
        titre="Services et tarifs"
        description="Les fourchettes de prix affichées publiquement. Prix en euros HT, entiers."
      />
      <Bandeau ok={ok} erreur={erreur} />

      <div className="space-y-8">
        {services.map((service) => {
          const siennes = offres.filter((o) => o.service_id === service.id);
          return (
            <section key={service.id} className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold">{service.titre}</h2>
                {!service.actif && <Pastille ton="neutre">Masqué</Pastille>}
              </div>

              <details className="rounded-2xl border border-border bg-card">
                <summary className="cursor-pointer px-5 py-3.5 text-sm font-medium">
                  Textes de la page service
                </summary>
                <form action={enregistrerService} className="space-y-4 border-t border-border p-5">
                  <input type="hidden" name="id" value={service.id} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Champ nom="titre" libelle="Titre" valeur={service.titre} requis />
                    <Champ nom="accroche" libelle="Accroche" valeur={service.accroche} requis />
                  </div>
                  <ZoneTexte nom="description" libelle="Description" valeur={service.description} />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Champ nom="image" libelle="Illustration" valeur={service.image} />
                    <Champ nom="ordre" libelle="Ordre" type="number" valeur={service.ordre} />
                    <Case nom="actif" libelle="Affiché" coche={service.actif} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Champ nom="seo_titre" libelle="Titre Google" valeur={service.seo_titre} />
                    <Champ nom="seo_description" libelle="Description Google" valeur={service.seo_description} />
                  </div>
                  <BoutonEnvoyer>Enregistrer le service</BoutonEnvoyer>
                </form>
              </details>

              {siennes.map((offre) => (
                <details key={offre.id} className="rounded-2xl border border-border bg-card">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                    <span className="flex-1 font-medium">{offre.nom}</span>
                    <span className="text-sm tabular-nums">{fourchette(offre)}</span>
                    {offre.en_vedette && <Pastille ton="bleu">Vedette</Pastille>}
                    {!offre.actif && <Pastille ton="neutre">Masquée</Pastille>}
                  </summary>
                  <FormulaireOffre offre={offre} services={optionsServices} />
                </details>
              ))}
            </section>
          );
        })}

        <Panneau titre="Nouvelle offre">
          <FormulaireOffre services={optionsServices} />
        </Panneau>
      </div>
    </>
  );
}

function FormulaireOffre({
  offre,
  services,
}: {
  offre?: Offre;
  services: { valeur: string; libelle: string }[];
}) {
  return (
    <div className={offre ? "border-t border-border p-5" : ""}>
      <form action={enregistrerOffre} className="space-y-4">
        {offre && <input type="hidden" name="id" value={offre.id} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <Champ nom="nom" libelle="Nom" valeur={offre?.nom} requis />
          <Liste nom="service_id" libelle="Service" valeur={offre?.service_id} options={services} vide="Choisir…" />
        </div>
        <ZoneTexte nom="description" libelle="Description" valeur={offre?.description} lignes={2} />
        <div className="grid gap-4 sm:grid-cols-4">
          <Champ nom="prix_min" libelle="Prix min (€)" type="number" valeur={offre?.prix_min} requis />
          <Champ nom="prix_max" libelle="Prix max (€)" type="number" valeur={offre?.prix_max} aide="Vide : « à partir de »." />
          <Liste nom="unite" libelle="Unité" valeur={offre?.unite ?? "forfait"} options={UNITES} />
          <Champ nom="delai" libelle="Délai" valeur={offre?.delai} placeholder="2 à 3 semaines" />
        </div>
        <ZoneTexte
          nom="inclus"
          libelle="Ce qui est inclus"
          valeur={offre?.inclus.join("\n")}
          lignes={5}
          aide="Une ligne par élément."
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <Case nom="en_vedette" libelle="En vedette" aide="Carte bleue sur la page tarifs." coche={offre?.en_vedette} />
          <Case nom="actif" libelle="Affichée" coche={offre?.actif ?? true} />
          <Champ nom="ordre" libelle="Ordre" type="number" valeur={offre?.ordre ?? 0} />
        </div>
        <div className="flex items-center gap-2">
          <BoutonEnvoyer>{offre ? "Enregistrer" : "Créer l'offre"}</BoutonEnvoyer>
        </div>
      </form>
      {offre && (
        <form action={supprimerOffre} className="mt-3 flex justify-end">
          <input type="hidden" name="id" value={offre.id} />
          <BoutonEnvoyer variante="danger" taille="petit" confirmation={`Supprimer l'offre « ${offre.nom} » ?`}>
            Supprimer l&apos;offre
          </BoutonEnvoyer>
        </form>
      )}
    </div>
  );
}
