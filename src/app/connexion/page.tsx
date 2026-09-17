import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";

import { FormulaireConnexion } from "@/components/commun/formulaire-connexion";
import { Logo } from "@/components/site/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { metadonnees } from "@/lib/seo";
import { fournisseursActifs } from "@/lib/supabase/fournisseurs";

export const metadata: Metadata = metadonnees({
  titre: "Connexion",
  description: "Accédez à votre espace client RGM Dev.",
  chemin: "/connexion",
  // Une page de connexion n'a rien à faire dans les résultats de recherche.
  horsIndex: true,
});

/**
 * La connexion.
 *
 * Volontairement hors du gabarit du site : ni entête ni pied de page. Quelqu'un
 * qui arrive ici veut entrer, pas parcourir le catalogue. Un seul lien de
 * sortie, vers l'accueil.
 */
export default async function PageConnexion() {
  const fournisseurs = await fournisseursActifs();

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-12">
      <div
        aria-hidden="true"
        className="halo-bleu pointer-events-none absolute inset-x-0 top-0 h-96"
      />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Retour au site
        </Link>

        <div className="rounded-2xl border border-border bg-card p-7 sm:p-8">
          <Logo avecTexte={false} />

          <h1 className="mt-6 text-2xl font-semibold">Votre espace client</h1>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
            Suivez l&apos;avancement de votre projet, retrouvez vos devis et vos
            factures, et déposez votre avis une fois le site livré.
          </p>

          <div className="mt-7">
            {/* `useSearchParams` impose une frontière Suspense. */}
            <Suspense fallback={<SqueletteConnexion />}>
              <FormulaireConnexion fournisseurs={fournisseurs} />
            </Suspense>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          Pas encore client ?{" "}
          <Link
            href="/contact"
            className="font-medium text-foreground underline underline-offset-2"
          >
            Demandez un devis
          </Link>
          , l&apos;espace se crée avec votre premier projet.
        </p>
      </div>
    </main>
  );
}

function SqueletteConnexion() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="mx-auto h-4 w-10" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
