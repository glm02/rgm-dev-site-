import { BoutonEnvoyer } from "@/components/admin/boutons";
import { Champ, Liste, ZoneTexte } from "@/components/admin/formulaire";
import { enregistrerProspect } from "@/lib/actions/crm";
import { STATUT_PROSPECT } from "@/lib/libelles";
import type { Prospect } from "@/lib/types";

const ETAPES = Object.entries(STATUT_PROSPECT).map(([valeur, { libelle }]) => ({ valeur, libelle }));

const SOURCES = [
  "site",
  "google-ads",
  "recommandation",
  "prospection",
  "linkedin",
  "réseau",
].map((valeur) => ({ valeur, libelle: valeur }));

/**
 * La fiche d'une affaire, en création comme en modification.
 *
 * Un seul formulaire pour les deux : un champ qui n'existerait qu'à la
 * création finirait par manquer à la modification.
 */
export function FormulaireProspect({ prospect }: { prospect?: Prospect }) {
  return (
    <form action={enregistrerProspect} className="space-y-5">
      {prospect && <input type="hidden" name="id" value={prospect.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Champ
          nom="contact"
          libelle="Contact"
          valeur={prospect?.contact}
          requis
          placeholder="Marie Dupont"
        />
        <Champ
          nom="entreprise"
          libelle="Entreprise"
          valeur={prospect?.entreprise}
          placeholder="Boulangerie Dupont"
        />
        <Champ nom="email" libelle="Email" type="email" valeur={prospect?.email} />
        <Champ nom="telephone" libelle="Téléphone" type="tel" valeur={prospect?.telephone} />
        <Champ nom="ville" libelle="Ville" valeur={prospect?.ville} placeholder="Lyon" />
        <Champ
          nom="secteur"
          libelle="Secteur"
          valeur={prospect?.secteur}
          placeholder="Restauration, artisanat…"
        />
      </div>

      <Champ
        nom="besoin"
        libelle="Besoin"
        valeur={prospect?.besoin}
        placeholder="Refonte du site + automatisation des devis"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Liste
          nom="statut"
          libelle="Étape"
          valeur={prospect?.statut ?? "nouveau"}
          options={ETAPES}
        />
        <Liste
          nom="source"
          libelle="Source"
          valeur={prospect?.source ?? "site"}
          options={SOURCES}
          vide="Non précisée"
        />
        <Champ
          nom="valeur_estimee"
          libelle="Valeur estimée"
          valeur={prospect?.valeur_estimee ?? ""}
          placeholder="2500"
          aide="En euros HT."
        />
        <Champ
          nom="probabilite"
          libelle="Probabilité"
          type="number"
          valeur={prospect?.probabilite ?? ""}
          placeholder="40"
          aide="En %. Vide : celle de l'étape."
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Champ
          nom="relance_le"
          libelle="Relancer le"
          type="date"
          valeur={prospect?.relance_le}
          aide="L'affaire remonte dans « À rappeler » ce jour-là."
        />
        <Champ
          nom="etiquettes"
          libelle="Étiquettes"
          valeur={prospect?.etiquettes.join(", ")}
          placeholder="urgent, site vitrine"
          aide="Séparées par des virgules."
        />
      </div>

      <ZoneTexte
        nom="note"
        libelle="Contexte"
        valeur={prospect?.note}
        lignes={5}
        placeholder="Ce qu'il faut savoir avant de rappeler."
      />

      <BoutonEnvoyer>{prospect ? "Enregistrer" : "Ajouter au pipeline"}</BoutonEnvoyer>
    </form>
  );
}
