import type { Metadata } from "next";

import { JURIDIQUE, SITE } from "@/lib/site";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Mentions légales",
  description: "Éditeur, hébergeur et propriété intellectuelle du site RGM Dev.",
  chemin: "/mentions-legales",
});

/**
 * Les mentions légales (article 6 de la LCEN).
 *
 * Les informations d'immatriculation viennent de `JURIDIQUE` dans `lib/site.ts`.
 * Tant qu'un champ y est vide, la ligne correspondante n'est pas affichée —
 * plutôt qu'un « à compléter » publié en ligne. Mais la page n'est alors pas
 * conforme : ces champs doivent être remplis avant la mise en production.
 */
export default function PageMentionsLegales() {
  const editeur = [
    ["Nom commercial", SITE.nom],
    ["Responsable de la publication", JURIDIQUE.responsable],
    ["Statut", JURIDIQUE.statut],
    ["SIRET", JURIDIQUE.siret],
    ["Adresse", JURIDIQUE.adresse],
    ["Email", SITE.email],
  ].filter((ligne): ligne is [string, string] => Boolean(ligne[1]));

  return (
    <div className="conteneur py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-semibold sm:text-5xl">Mentions légales</h1>

        <Bloc titre="Éditeur du site">
          <dl className="divide-y divide-border rounded-xl border border-border">
            {editeur.map(([cle, valeur]) => (
              <div key={cle} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[14rem_1fr]">
                <dt className="text-sm text-muted-foreground">{cle}</dt>
                <dd className="text-[15px]">{valeur}</dd>
              </div>
            ))}
          </dl>
        </Bloc>

        <Bloc titre="Hébergement">
          <p>
            Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis —
            vercel.com.
          </p>
          <p>
            Les données (comptes, demandes de devis) sont hébergées par Supabase Inc.,
            dans une région de l&apos;Union européenne.
          </p>
        </Bloc>

        <Bloc titre="Propriété intellectuelle">
          <p>
            Les textes, le design et le code de ce site sont la propriété de {SITE.nom}.
            Les captures des réalisations sont reproduites avec l&apos;accord des
            clients concernés ; leurs marques et leurs contenus leur appartiennent.
          </p>
          <p>
            Les logos des technologies citées (Next.js, React, Supabase, etc.) sont la
            propriété de leurs détenteurs et ne désignent que les outils employés.
          </p>
        </Bloc>

        <Bloc titre="Données personnelles">
          <p>
            Le traitement des données est décrit dans la{" "}
            <a href="/confidentialite" className="font-medium text-bleu-700 underline underline-offset-4 dark:text-bleu-300">
              politique de confidentialité
            </a>
            .
          </p>
        </Bloc>
      </div>
    </div>
  );
}

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold">{titre}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
