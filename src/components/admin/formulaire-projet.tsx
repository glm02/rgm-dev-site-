import { BoutonEnvoyer } from "./boutons";
import { Case, Champ, ChampFichier, ZoneTexte } from "./formulaire";
import { Panneau } from "@/components/espace/entete-page";
import { enregistrerProjet } from "@/lib/actions/admin";
import type { Projet } from "@/lib/types";

/**
 * Le formulaire d'une réalisation, en création comme en édition.
 *
 * Il suit l'ordre de la fiche publique — accroche, récit, fiche technique,
 * référencement — pour qu'on remplisse la page dans l'ordre où on la lit.
 */
export function FormulaireProjet({ projet }: { projet?: Projet }) {
  return (
    <form action={enregistrerProjet} className="space-y-5">
      {projet && <input type="hidden" name="id" value={projet.id} />}

      <Panneau titre="L'essentiel">
        <div className="grid gap-4 sm:grid-cols-2">
          <Champ nom="titre" libelle="Titre" valeur={projet?.titre} requis />
          <Champ
            nom="slug"
            libelle="Adresse"
            valeur={projet?.slug}
            requis
            aide="Minuscules et tirets : /realisations/mon-projet. La changer casse les liens existants."
          />
          <Champ nom="client_nom" libelle="Client" valeur={projet?.client_nom} />
          <Champ nom="secteur" libelle="Secteur" valeur={projet?.secteur} />
        </div>
        <ZoneTexte
          nom="resume"
          libelle="Résumé"
          valeur={projet?.resume}
          lignes={2}
          requis
          className="mt-4"
          aide="Une phrase, affichée sur la carte et sous le titre de la fiche."
        />
      </Panneau>

      <Panneau titre="Le récit">
        <div className="space-y-4">
          <ZoneTexte nom="probleme" libelle="Le problème" valeur={projet?.probleme} />
          <ZoneTexte nom="solution" libelle="Ce que j'ai construit" valeur={projet?.solution} />
          <ZoneTexte nom="resultat" libelle="Le résultat" valeur={projet?.resultat} aide="Un chiffre vérifiable vaut mieux qu'un adjectif." />
        </div>
      </Panneau>

      <Panneau titre="Fiche technique">
        <div className="grid gap-4 sm:grid-cols-2">
          <ZoneTexte
            nom="stack"
            libelle="Technologies"
            valeur={projet?.stack.join("\n")}
            lignes={4}
            aide="Une par ligne."
          />
          <div className="space-y-4">
            <ChampFichier
              nom="fichier_image"
              libelle="Capture d'écran"
              accept="image/*"
              aide="Déposée dans le stockage Supabase, elle remplace la capture actuelle."
            />
            <Champ
              nom="image_couverture"
              libelle="…ou chemin de l'image"
              valeur={projet?.image_couverture}
              aide="Rempli automatiquement après un dépôt."
            />
            <Champ nom="url_live" libelle="Site en ligne" type="url" valeur={projet?.url_live} />
            <Champ nom="url_depot" libelle="Dépôt de code" type="url" valeur={projet?.url_depot} />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <Champ nom="prix_min" libelle="Budget min (€ HT)" type="number" valeur={projet?.prix_min} />
          <Champ nom="prix_max" libelle="Budget max (€ HT)" type="number" valeur={projet?.prix_max} />
          <Champ nom="duree_jours" libelle="Durée (jours)" type="number" valeur={projet?.duree_jours} />
          <Champ nom="livre_le" libelle="Livré le" type="date" valeur={projet?.livre_le} />
        </div>
      </Panneau>

      <Panneau titre="Publication et référencement">
        <div className="grid gap-3 sm:grid-cols-3">
          <Case nom="publie" libelle="Publié" aide="Visible sur le site." coche={projet?.publie} />
          <Case nom="en_vedette" libelle="En vedette" aide="Remonte en page d'accueil." coche={projet?.en_vedette} />
          <Champ nom="ordre" libelle="Ordre" type="number" valeur={projet?.ordre ?? 0} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Champ nom="seo_titre" libelle="Titre Google" valeur={projet?.seo_titre} aide="60 caractères environ. Vide : titre du projet." />
          <Champ nom="seo_description" libelle="Description Google" valeur={projet?.seo_description} aide="155 caractères environ. Vide : le résumé." />
        </div>
      </Panneau>

      <div className="flex justify-end">
        <BoutonEnvoyer>{projet ? "Enregistrer" : "Créer la réalisation"}</BoutonEnvoyer>
      </div>
    </form>
  );
}
