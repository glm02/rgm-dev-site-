import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@appica/ui-react/table";
import { Check, Minus } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { TitreSection } from "@/components/commun/titre-section";

/**
 * Freelance, agence, ou outil en ligne : ce que chacun vous donne.
 *
 * Le tableau est écrit pour rester vrai même quand il ne m'avantage pas — une
 * agence a des moyens qu'un freelance n'a pas, et un éditeur de site en ligne
 * coûte vingt euros par mois. Un comparatif où la colonne du milieu gagne
 * partout ne convainc personne et se retourne au premier rendez-vous.
 */
const COLONNES = ["Freelance (RGM Dev)", "Agence web", "Éditeur en ligne"] as const;

type Valeur = string | boolean;

const LIGNES: { critere: string; valeurs: [Valeur, Valeur, Valeur] }[] = [
  {
    critere: "Qui travaille sur votre projet",
    valeurs: ["La personne à qui vous parlez", "Une équipe, un chef de projet", "Vous"],
  },
  {
    critere: "Budget d'un site vitrine",
    valeurs: ["1 500 à 3 000 €", "4 000 à 15 000 €", "20 à 40 € par mois"],
  },
  {
    critere: "Délai de mise en ligne",
    valeurs: ["2 à 3 semaines", "2 à 4 mois", "Un week-end"],
  },
  {
    critere: "Design sur mesure",
    valeurs: [true, true, false],
  },
  {
    critere: "Référencement local travaillé",
    valeurs: [true, true, "Selon le thème"],
  },
  {
    critere: "Le code vous appartient",
    valeurs: [true, "Selon le contrat", false],
  },
  {
    critere: "Vous pouvez partir sans tout perdre",
    valeurs: [true, "Selon le contrat", false],
  },
  {
    critere: "Automatisation branchée sur vos outils",
    valeurs: [true, "Prestataire externe", false],
  },
  {
    critere: "Surveillance du site après livraison",
    valeurs: [true, "En option payante", false],
  },
  {
    critere: "Interlocuteur joignable directement",
    valeurs: [true, "Via le chef de projet", "Support par formulaire"],
  },
];

function Cellule({ valeur, mise }: { valeur: Valeur; mise: boolean }) {
  if (valeur === true) {
    return (
      <span className="flex items-center gap-1.5">
        <Check
          className="size-4 shrink-0 text-bleu-600 dark:text-bleu-400"
          strokeWidth={2.5}
          aria-hidden="true"
        />
        <span className={mise ? "font-medium" : undefined}>Oui</span>
      </span>
    );
  }

  if (valeur === false) {
    return (
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Minus className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
        Non
      </span>
    );
  }

  return <span className={mise ? "font-medium" : undefined}>{valeur}</span>;
}

export function Comparatif() {
  return (
    <section className="conteneur py-20 sm:py-28">
      <TitreSection
        surtitre="Comparer"
        titre="Freelance, agence ou outil en ligne ?"
        sousTitre="Les trois se défendent. Voici ce que chacun vous donne vraiment, pour que le choix se fasse les yeux ouverts."
      />

      <Apparait className="mt-14 max-w-none">
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <Table size="md" hoverableRows className="min-w-[720px]">
            <TableCaption position="bottom">
              Fourchettes constatées sur le marché lyonnais en 2026, hors cas particuliers.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col" className="w-[26%]">
                  <span className="sr-only">Critère</span>
                </TableHead>
                {COLONNES.map((colonne, index) => (
                  <TableHead
                    key={colonne}
                    scope="col"
                    className={index === 0 ? "text-bleu-700 dark:text-bleu-300" : undefined}
                  >
                    {colonne}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {LIGNES.map((ligne) => (
                <TableRow key={ligne.critere}>
                  <TableHead scope="row" className="font-medium text-foreground">
                    {ligne.critere}
                  </TableHead>
                  {ligne.valeurs.map((valeur, index) => (
                    <TableCell key={COLONNES[index]}>
                      <Cellule valeur={valeur} mise={index === 0} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Apparait>

      <Apparait delai={80}>
        <p className="mx-auto mt-8 max-w-2xl text-center leading-relaxed text-muted-foreground">
          Si votre projet demande une équipe de six personnes et un budget à cinq chiffres, une
          agence sera plus à sa place — et je vous le dirai dès le premier appel.
        </p>
      </Apparait>
    </section>
  );
}
