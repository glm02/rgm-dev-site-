import type { Metadata } from "next";

import { SITE } from "@/lib/site";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Politique de confidentialité",
  description:
    "Quelles données RGM Dev collecte, pourquoi, combien de temps elles sont gardées, et comment exercer vos droits.",
  chemin: "/confidentialite",
});

/**
 * La politique de confidentialité.
 *
 * Écrite pour être lue, pas pour couvrir : chaque traitement dit ce qui est
 * collecté, pourquoi, et combien de temps. Elle doit rester exacte — si un
 * outil de mesure ou un nouveau formulaire est ajouté, cette page change avec.
 */
const TRAITEMENTS = [
  {
    titre: "Demande de devis",
    donnees: "Nom, email, téléphone et entreprise si renseignés, description du projet, page d'origine et paramètres de campagne publicitaire.",
    finalite: "Vous répondre et établir un devis. Mesurer quelle campagne a amené la demande.",
    base: "Mesures précontractuelles à votre demande.",
    duree: "3 ans après le dernier échange sans suite, puis suppression.",
  },
  {
    titre: "Espace client",
    donnees: "Email, nom et photo de profil transmis par Google ou GitHub si vous choisissez ces connexions, messages échangés, documents du projet.",
    finalite: "Suivre votre projet, partager devis, factures et livrables.",
    base: "Exécution du contrat.",
    duree: "Durée de la relation commerciale, puis 10 ans pour les pièces comptables (obligation légale).",
  },
  {
    titre: "Avis clients",
    donnees: "Nom, fonction et entreprise tels que vous les saisissez, note et texte de l'avis.",
    finalite: "Publier votre témoignage sur le site, après votre dépôt volontaire.",
    base: "Consentement, retirable à tout moment.",
    duree: "Jusqu'à votre demande de retrait.",
  },
];

export default function PageConfidentialite() {
  return (
    <div className="conteneur py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold sm:text-5xl">Politique de confidentialité</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Ce site collecte le strict nécessaire pour vous répondre et suivre vos
          projets. Rien n&apos;est revendu, rien n&apos;est transmis à des fins
          publicitaires.
        </p>

        <div className="mt-12 space-y-5">
          {TRAITEMENTS.map((t) => (
            <section key={t.titre} className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">{t.titre}</h2>
              <dl className="mt-4 grid gap-3 text-[15px] sm:grid-cols-[9rem_1fr]">
                <dt className="text-muted-foreground">Données</dt>
                <dd>{t.donnees}</dd>
                <dt className="text-muted-foreground">Pourquoi</dt>
                <dd>{t.finalite}</dd>
                <dt className="text-muted-foreground">Base légale</dt>
                <dd>{t.base}</dd>
                <dt className="text-muted-foreground">Conservation</dt>
                <dd>{t.duree}</dd>
              </dl>
            </section>
          ))}
        </div>

        <section className="mt-12 space-y-4 leading-relaxed text-muted-foreground">
          <h2 className="text-xl font-semibold text-foreground">Sous-traitants</h2>
          <p>
            Vercel (hébergement), Supabase (base de données et authentification),
            Resend (envoi des emails). Chacun n&apos;accède qu&apos;aux données
            nécessaires à son service.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-foreground">Cookies</h2>
          <p>
            Seuls des cookies techniques sont déposés : la session de connexion à
            l&apos;espace client et votre choix de thème clair ou sombre. Aucun cookie
            publicitaire ou de pistage, d&apos;où l&apos;absence de bandeau de
            consentement.
          </p>

          <h2 className="pt-4 text-xl font-semibold text-foreground">Vos droits</h2>
          <p>
            Vous pouvez accéder à vos données, les rectifier, les supprimer, vous
            opposer à leur traitement ou en demander la portabilité en écrivant à{" "}
            <a href={`mailto:${SITE.email}`} className="font-medium text-bleu-700 underline underline-offset-4 dark:text-bleu-300">
              {SITE.email}
            </a>
            . Réponse sous un mois. En cas de désaccord, vous pouvez saisir la CNIL
            (cnil.fr).
          </p>
        </section>
      </div>
    </div>
  );
}
