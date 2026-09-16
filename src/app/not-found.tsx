import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

/**
 * La page introuvable.
 *
 * Elle propose les trois destinations qui couvrent presque toutes les
 * intentions — plutôt qu'un seul « retour à l'accueil » qui fait repartir le
 * visiteur de zéro.
 */
export default function Introuvable() {
  const liens = [
    { href: "/realisations", libelle: "Les réalisations" },
    { href: "/tarifs", libelle: "Les tarifs" },
    { href: "/contact", libelle: "Demander un devis" },
  ];

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div
        aria-hidden="true"
        className="halo-bleu pointer-events-none absolute inset-x-0 top-0 h-96"
      />

      <div className="relative">
        <Logo avecTexte={false} className="mx-auto" />

        <p className="mt-8 text-sm font-semibold tracking-wider text-bleu-600 uppercase tabular-nums dark:text-bleu-400">
          Erreur 404
        </p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Cette page n&apos;existe pas</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-balance text-muted-foreground">
          Le lien est peut-être ancien, ou l&apos;adresse a une faute de frappe.
        </p>

        <ul className="mt-9 flex flex-wrap justify-center gap-2.5">
          {liens.map((lien) => (
            <li key={lien.href}>
              <Link
                href={lien.href}
                className={cn(
                  "inline-flex h-11 items-center rounded-xl border border-border bg-background px-5 text-sm font-medium",
                  "transition-[background-color,scale] duration-150 ease-out hover:bg-secondary active:scale-96",
                )}
              >
                {lien.libelle}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
