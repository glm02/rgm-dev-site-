import { BoutonEnvoyer } from "./boutons";
import { Case, Champ, ChampFichier, ZoneTexte } from "./formulaire";
import { Panneau } from "@/components/espace/entete-page";
import { enregistrerArticle } from "@/lib/actions/admin";
import type { Article } from "@/lib/types";

/** Le formulaire d'un article de blog, en Markdown. */
export function FormulaireArticle({ article }: { article?: Article }) {
  return (
    <form action={enregistrerArticle} className="space-y-5">
      {article && <input type="hidden" name="id" value={article.id} />}

      <Panneau>
        <div className="grid gap-4 sm:grid-cols-2">
          <Champ nom="titre" libelle="Titre" valeur={article?.titre} requis />
          <Champ nom="slug" libelle="Adresse" valeur={article?.slug} requis aide="/blog/mon-article" />
        </div>
        <ZoneTexte
          nom="chapo"
          libelle="Chapeau"
          valeur={article?.chapo}
          lignes={2}
          className="mt-4"
          aide="Deux phrases qui disent ce que le lecteur va apprendre."
        />
        <ZoneTexte
          nom="contenu"
          libelle="Contenu (Markdown)"
          valeur={article?.contenu}
          lignes={22}
          mono
          className="mt-4"
          aide="## pour un intertitre, **gras**, [lien](https://…), - liste. Le HTML brut n'est pas interprété."
        />
      </Panneau>

      <Panneau titre="Publication et référencement">
        <div className="grid gap-4 sm:grid-cols-3">
          <Case nom="publie" libelle="Publié" aide="Sans date : publié maintenant." coche={article?.publie} />
          <Champ nom="publie_le" libelle="Date de publication" type="date" valeur={article?.publie_le?.slice(0, 10)} />
          <Champ nom="image" libelle="Image (chemin)" valeur={article?.image} />
        </div>
        <div className="mt-4">
          <ChampFichier nom="fichier_image" libelle="Déposer une image" accept="image/*" />
        </div>
        <ZoneTexte nom="tags" libelle="Mots-clés" valeur={article?.tags.join(", ")} lignes={1} className="mt-4" aide="Séparés par des virgules." />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Champ nom="seo_titre" libelle="Titre Google" valeur={article?.seo_titre} />
          <Champ nom="seo_description" libelle="Description Google" valeur={article?.seo_description} />
        </div>
      </Panneau>

      <div className="flex justify-end">
        <BoutonEnvoyer>{article ? "Enregistrer" : "Créer l'article"}</BoutonEnvoyer>
      </div>
    </form>
  );
}
