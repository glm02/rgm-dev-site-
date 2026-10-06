import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@appica/ui-react/badge";
import { ArrowRight, Check, MapPin } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { CarteProjet } from "@/components/commun/carte-projet";
import { FilAriane } from "@/components/commun/fil-ariane";
import { JsonLd } from "@/components/commun/json-ld";
import { TitreSection } from "@/components/commun/titre-section";
import { AppelAction } from "@/components/sections/appel-action";
import { listerOffres, listerProjets } from "@/lib/donnees";
import { fourchette } from "@/lib/format";
import { jsonLdFaq, jsonLdFilAriane, metadonnees } from "@/lib/seo";
import { SITE, VILLES } from "@/lib/site";

export const metadata: Metadata = metadonnees({
  titre: "Développeur web freelance à Lyon — sites et automatisation IA",
  description:
    "Développeur freelance à Lyon : création de sites web, refonte, e-commerce et automatisation IA. Prix affichés, devis ferme sous 48 h, rendez-vous sur place dans la métropole.",
  chemin: "/developpeur-web-lyon",
});

/**
 * La page d'atterrissage locale.
 *
 * C'est la cible des recherches « développeur web Lyon » et des annonces
 * Google : elle répond à une intention précise — trouver quelqu'un près de
 * chez soi — là où l'accueil présente l'activité entière.
 *
 * Elle ne recopie pas l'accueil : ce qui change ici, c'est le local. Où je me
 * déplace, à quoi ressemble un projet dans la métropole, et pourquoi le
 * référencement de proximité se joue sur des détails qu'un prestataire
 * lointain ne connaît pas.
 */

const ARGUMENTS = [
  {
    titre: "On peut se voir",
    texte:
      "Un café à la Part-Dieu, une visite dans votre atelier à Villeurbanne : les rendez-vous sur place se font dans un rayon de 80 km. Pour le reste, la visioconférence suffit largement.",
  },
  {
    titre: "Le référencement local, d'abord",
    texte:
      "Une page par métier et par zone, la fiche Google de l'entreprise reliée au site, les avis clients balisés. C'est ce qui fait apparaître une entreprise quand quelqu'un cherche « à côté de chez moi ».",
  },
  {
    titre: "Des prix affichés",
    texte:
      "La page tarifs donne les fourchettes avant le premier appel. Vous savez en trois minutes si le budget colle, sans avoir à remplir un formulaire pour obtenir un chiffre.",
  },
  {
    titre: "Un seul interlocuteur",
    texte:
      "Celui qui répond au téléphone est celui qui écrit le code. Pas de chef de projet qui transmet, pas de sous-traitance à l'autre bout du monde.",
  },
];

const QUESTIONS = [
  {
    question: "Combien coûte un site web à Lyon ?",
    reponse:
      "Comptez 1 500 à 3 000 € pour un site vitrine de quelques pages, 3 500 à 9 000 € pour un site sur mesure avec réservation, catalogue ou espace client, et 2 000 à 5 000 € pour une refonte. Les tarifs sont publiés sur le site, avec ce que chaque forfait contient.",
  },
  {
    question: "Intervenez-vous en dehors de Lyon ?",
    reponse:
      "Oui, dans toute la métropole et au-delà : Villeurbanne, Vénissieux, Bron, Caluire-et-Cuire, Saint-Priest, Écully, Oullins, Givors. Les rendez-vous sur place se font dans un rayon de 80 km autour de Lyon ; plus loin, tout se fait en visioconférence.",
  },
  {
    question: "En combien de temps mon site peut-il être en ligne ?",
    reponse:
      "Deux à trois semaines pour un site vitrine, quatre à huit semaines pour un site sur mesure. Le délai dépend surtout de la rapidité avec laquelle vous fournissez vos textes et vos photos — c'est ce qui fait traîner la majorité des projets.",
  },
  {
    question: "Faites-vous aussi de l'automatisation pour les entreprises lyonnaises ?",
    reponse:
      "Oui, c'est la moitié de l'activité. On repère les tâches répétitives — relances de devis, tri des mails, saisie, reporting — et on les automatise avec des agents IA et des workflows n8n branchés sur vos outils existants. Ça commence par un audit de deux jours.",
  },
  {
    question: "Le site m'appartient-il vraiment ?",
    reponse:
      "Oui, entièrement : le code, le nom de domaine, l'hébergement et les comptes sont à votre nom. Vous pouvez confier la suite à un autre prestataire quand vous le souhaitez, sans rien racheter.",
  },
];

export default async function PageLyon() {
  const [projets, offres] = await Promise.all([listerProjets(), listerOffres()]);
  const vedettes = projets.filter((projet) => projet.en_vedette).slice(0, 3);
  const siteVitrine = offres.find((offre) => offre.nom.toLowerCase().includes("vitrine"));

  const etapes = [
    { nom: "Accueil", href: "/" },
    { nom: "Développeur web à Lyon", href: "/developpeur-web-lyon" },
  ];

  return (
    <>
      <JsonLd donnees={jsonLdFilAriane(etapes)} />
      <JsonLd donnees={jsonLdFaq(QUESTIONS)} />

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="halo-bleu pointer-events-none absolute inset-x-0 top-0 h-96"
        />
        <div className="conteneur relative pt-8 pb-16">
          <FilAriane etapes={etapes} />

          <div className="mt-8 max-w-3xl">
            <Badge variant="soft" size="sm">
              <MapPin className="size-3.5" strokeWidth={2} aria-hidden="true" />
              {SITE.ville} et {SITE.region}
            </Badge>

            <h1 className="mt-5 text-4xl font-semibold text-balance sm:text-5xl lg:text-6xl">
              Développeur web freelance à Lyon
            </h1>

            <p className="mt-6 text-xl leading-relaxed text-balance text-muted-foreground">
              Je crée des sites qui se trouvent sur Google et qui amènent des demandes, et
              j&apos;automatise les tâches qui font perdre des heures chaque semaine. Prix affichés,
              devis ferme sous 48 heures, et un seul interlocuteur du début à la fin.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-[background-color,scale] duration-150 ease-out hover:bg-bleu-700 active:scale-96 dark:hover:bg-bleu-400"
              >
                Demander un devis gratuit
                <ArrowRight
                  className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/tarifs"
                className="inline-flex h-12 items-center rounded-xl border border-border bg-background px-6 text-sm font-medium transition-[background-color,scale] duration-150 ease-out hover:bg-secondary active:scale-96"
              >
                {siteVitrine ? `Site vitrine ${fourchette(siteVitrine)}` : "Voir les tarifs"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="conteneur py-16 sm:py-20">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {ARGUMENTS.map((argument, index) => (
            <Apparait key={argument.titre} delai={index * 70} className="bg-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold">{argument.titre}</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {argument.texte}
              </p>
            </Apparait>
          ))}
        </div>
      </section>

      {vedettes.length > 0 && (
        <section className="conteneur py-16 sm:py-20">
          <TitreSection
            surtitre="Des projets réels"
            titre="Ce que ça donne une fois en ligne"
            sousTitre="Des sites en production, avec leur budget et ce qu'ils ont changé pour leur propriétaire."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {vedettes.map((projet, index) => (
              <Apparait key={projet.id} delai={index * 70} className="h-full">
                <CarteProjet projet={projet} priorite={index === 0} />
              </Apparait>
            ))}
          </div>
        </section>
      )}

      <section className="conteneur py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <Apparait>
            <h2 className="text-3xl font-semibold sm:text-4xl">Où j&apos;interviens</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Dans Lyon et la métropole pour les rendez-vous sur place, dans un rayon de{" "}
              {SITE.rayonKm} km pour le reste de la région. Au-delà, le travail se fait très bien à
              distance : la moitié des projets livrés n&apos;a demandé aucun déplacement.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {VILLES.map((ville) => (
                <li
                  key={ville}
                  className="flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-sm text-secondary-foreground"
                >
                  <MapPin className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  {ville}
                </li>
              ))}
            </ul>
          </Apparait>

          <Apparait delai={80}>
            <h2 className="text-3xl font-semibold sm:text-4xl">Les questions qu&apos;on me pose</h2>
            <dl className="mt-6 divide-y divide-border">
              {QUESTIONS.map((question) => (
                <div key={question.question} className="py-5 first:pt-0 last:pb-0">
                  <dt className="flex gap-2.5 font-medium">
                    <Check
                      className="mt-1 size-4 shrink-0 text-bleu-600 dark:text-bleu-400"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    {question.question}
                  </dt>
                  <dd className="mt-2 pl-[26px] text-sm leading-relaxed text-muted-foreground">
                    {question.reponse}
                  </dd>
                </div>
              ))}
            </dl>
          </Apparait>
        </div>
      </section>

      <AppelAction />
    </>
  );
}
