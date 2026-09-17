import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@appica/ui-react/accordion";

import { JsonLd } from "@/components/commun/json-ld";
import { TitreSection } from "@/components/commun/titre-section";
import { jsonLdFaq } from "@/lib/seo";

/**
 * Les questions que pose un dirigeant avant de confier une automatisation ou
 * un site à un freelance.
 *
 * Différentes de celles de la page tarifs, qui portent sur l'argent : ici on
 * répond aux inquiétudes — « est-ce que l'IA va se tromper », « et si vous
 * disparaissez ». Deux pages avec la même FAQ se feraient concurrence dans
 * Google au lieu de se compléter.
 *
 * Réponses écrites pour être lues hors du site : le balisage `FAQPage` peut les
 * afficher directement dans les résultats.
 */
const QUESTIONS = [
  {
    question: "Concrètement, qu'est-ce qu'on peut automatiser dans une petite entreprise ?",
    reponse:
      "Tout ce qui se répète et suit une règle : relancer un devis resté sans réponse, trier et répondre aux mails simples, recopier des données d'un outil à l'autre, préparer un reporting, générer une facture à partir d'une intervention. On commence par un audit pour chiffrer ce qui prend réellement du temps chez vous.",
  },
  {
    question: "Et si l'IA se trompe ?",
    reponse:
      "Elle se trompera parfois, c'est pour ça qu'on ne la laisse pas seule sur ce qui engage l'entreprise. Un agent peut préparer une réponse ou un devis, un humain le valide d'un clic. On automatise d'abord ce qui est sans risque, et on élargit une fois que les résultats sont vérifiés.",
  },
  {
    question: "Mes données partent-elles chez OpenAI ou ailleurs ?",
    reponse:
      "Seulement ce qui est nécessaire, et vous le savez avant. Selon la sensibilité des données, on choisit un fournisseur européen, un contrat sans réutilisation pour l'entraînement, ou un modèle hébergé sur votre propre serveur.",
  },
  {
    question: "Faut-il changer nos outils actuels ?",
    reponse:
      "Non, c'est même l'inverse : l'automatisation se branche sur ce que vous utilisez déjà — Gmail ou Outlook, votre tableur, votre CRM, votre logiciel de facturation. On ne vous impose pas un nouvel outil à apprendre.",
  },
  {
    question: "Que se passe-t-il si vous n'êtes plus disponible ?",
    reponse:
      "Tout est à votre nom : le code, les workflows, les comptes, l'hébergement. Chaque projet est livré documenté, pour qu'un autre prestataire puisse le reprendre sans rien racheter ni tout reconstruire.",
  },
  {
    question: "Travaillez-vous avec des entreprises hors de Lyon ?",
    reponse:
      "Oui. Les rendez-vous sur place se font dans un rayon de 80 km autour de Lyon ; au-delà, tout se fait très bien en visioconférence, du cadrage jusqu'à la formation.",
  },
];

export function Faq() {
  return (
    <section className="conteneur py-20 sm:py-28">
      <JsonLd donnees={jsonLdFaq(QUESTIONS)} />

      <TitreSection
        surtitre="Questions fréquentes"
        titre="Ce qu'on me demande avant de commencer"
        sousTitre="Les vraies inquiétudes, avec de vraies réponses."
      />

      <div className="mx-auto mt-12 max-w-3xl">
        <Accordion variant="default" icon="plus" iconVariant="icon-box" defaultValue={[QUESTIONS[0].question]}>
          {QUESTIONS.map((entree) => (
            <AccordionItem key={entree.question} value={entree.question}>
              <AccordionTrigger className="text-left text-base font-semibold sm:text-lg">
                {entree.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="pb-2 text-[15px] leading-relaxed text-muted-foreground">
                  {entree.reponse}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
