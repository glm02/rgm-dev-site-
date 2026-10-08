import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

import { FormulaireAccesAdmin } from "@/components/commun/formulaire-acces-admin";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Administration",
  description: "Accès réservé.",
  chemin: "/acces-admin",
  horsIndex: true,
});

/**
 * La porte de l'administration : le cadenas de l'entête mène ici.
 *
 * Même gabarit dépouillé que /connexion. Les clients, eux, passent toujours
 * par /connexion (lien magique, GitHub).
 */
export default function PageAccesAdmin() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-12">
      <div aria-hidden="true" className="halo-bleu pointer-events-none absolute inset-x-0 top-0 h-96" />

      <div className="relative w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
          Retour au site
        </Link>

        <div className="rounded-2xl border border-border bg-card p-7 sm:p-8">
          <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
            <LockKeyhole className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-2xl font-semibold">Administration</h1>
          <p className="mt-2.5 mb-7 text-sm leading-relaxed text-muted-foreground">Accès réservé à RGM Dev.</p>

          <FormulaireAccesAdmin />
        </div>
      </div>
    </main>
  );
}
