import type { Metadata } from "next";

import { Apparait } from "@/components/commun/apparait";
import { CarteOffre } from "@/components/commun/carte-offre";
import { JsonLd } from "@/components/commun/json-ld";
import { AppelAction } from "@/components/sections/appel-action";
import { offresParService } from "@/lib/donnees";
import { jsonLdFaq, metadonnees } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = metadonnees({
  titre: "Tarifs — création de site web et automatisation IA",
  description:
    "Les prix affichés : site vitrine à partir de 1 500 €, site sur mesure, automatisation de processus, agents IA, maintenance mensuelle. Devis ferme sous 48 h.",
  chemin: "/tarifs",
});

/**
 * Les questions qu'on pose vraiment avant de signer.
 *
 * Elles alimentent aussi le balisage `FAQPage`, qui peut faire apparaître les
 * réponses directement dans les résultats Google. Les réponses sont donc
 * écrites pour être lues hors du site, sans le contexte de la page.
 */
const QUESTIONS = [
  {
    question: "Pourquoi afficher les prix alors que personne ne le fait ?",
    reponse:
      "Parce que le contraire fait perdre du temps à tout le monde. Un client qui a 1 500 € et un prestataire qui travaille à partir de 8 000 € s'en rendent compte au troisième rendez-vous. Autant le savoir tout de suite.",
  },
  {
    question: "Le prix annoncé peut-il augmenter en cours de projet ?",
    reponse:
      "Non. Les fourchettes de cette page servent à situer le budget ; une fois le périmètre écrit et signé, le prix est ferme. Si vous demandez quelque chose en plus en cours de route, c'est un avenant chiffré à part, que vous acceptez ou non.",
  },
  {
    question: "Comment se passe le paiement ?",
    reponse:
      "30 % à la commande, 40 % à la validation de la maquette, 30 % à la mise en ligne. Pour les forfaits mensuels, c'est prélevé chaque mois et résiliable à tout moment.",
  },
  {
    question: "À qui appartient le code ?",
    reponse:
      "À vous. Le dépôt est sur votre compte GitHub, l'hébergement sur votre compte Vercel, la base sur votre compte Supabase. Vous pouvez reprendre le projet avec un autre prestataire du jour au lendemain, sans rien avoir à racheter.",
  },
  {
    question: "Travaillez-vous en dehors de Lyon ?",
    reponse:
      "Oui. Je me déplace dans un rayon de 80 km autour de Lyon pour les rendez-vous, et je travaille à distance partout en France. La visioconférence marche très bien pour le suivi de projet.",
  },
  {
    question: "Combien de temps faut-il pour automatiser un processus ?",
    reponse:
      "Deux à quatre semaines pour un processus complet, une semaine pour l'audit préalable. Le plus long n'est jamais le développement : c'est de comprendre exactement ce que fait votre équipe aujourd'hui, étape par étape.",
  },
];

export default async function PageTarifs() {
  const groupes = await offresParService();

  return (
    <>
      <JsonLd donnees={jsonLdFaq(QUESTIONS)} />

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="halo-bleu pointer-events-none absolute inset-x-0 top-0 h-96"
        />

        <div className="conteneur relative pt-14 sm:pt-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-semibold sm:text-5xl">Tarifs</h1>
            <p className="mt-5 text-lg leading-relaxed text-balance text-muted-foreground">
              Des fourchettes honnêtes, pas des prix d&apos;appel. Elles situent le
              budget ; le devis, lui, est ferme une fois le périmètre écrit.
            </p>
          </div>
        </div>
      </section>

      {groupes.map(({ service, offres }, indexGroupe) => {
        if (offres.length === 0) return null;

        return (
          <section
            key={service.id}
            className={cn(
              "py-16 sm:py-20",
              indexGroupe % 2 === 1 && "border-y border-border bg-secondary/30",
            )}
          >
            <div className="conteneur">
              <Apparait>
                <h2 className="text-2xl font-semibold sm:text-3xl">{service.titre}</h2>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  {service.accroche}
                </p>
              </Apparait>

              <div
                className={cn(
                  "mt-14 grid gap-5",
                  offres.length === 1 && "max-w-md",
                  offres.length === 2 && "md:grid-cols-2",
                  offres.length >= 3 && "md:grid-cols-3",
                )}
              >
                {offres.map((offre, index) => (
                  <Apparait key={offre.id} delai={index * 70} className="h-full">
                    <CarteOffre offre={offre} />
                  </Apparait>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="conteneur py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <Apparait>
            <h2 className="text-3xl font-semibold sm:text-4xl">Questions fréquentes</h2>
          </Apparait>

          <dl className="mt-10 divide-y divide-border border-y border-border">
            {QUESTIONS.map((entree, index) => (
              <Apparait key={entree.question} delai={index * 40} className="py-6">
                <dt className="text-lg font-semibold">{entree.question}</dt>
                <dd className="mt-2.5 leading-relaxed text-muted-foreground">
                  {entree.reponse}
                </dd>
              </Apparait>
            ))}
          </dl>
        </div>
      </section>

      <AppelAction
        titre="Un doute sur le budget ?"
        texte="Décrivez votre projet en trois lignes. Je vous dis dans quelle fourchette il tombe, et si ce n'est pas réaliste je vous le dis aussi."
      />
    </>
  );
}
