import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin, ShieldCheck } from "lucide-react";

import { FormulaireDevis } from "@/components/commun/formulaire-devis";
import { Skeleton } from "@/components/ui/skeleton";
import { metadonnees } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = metadonnees({
  titre: "Contact — demander un devis",
  description:
    "Décrivez votre projet : je réponds sous 48 heures ouvrées avec un périmètre écrit et un prix ferme. Développeur freelance à Lyon.",
  chemin: "/contact",
});

const REPERES = [
  {
    icone: Clock,
    titre: "Réponse sous 48 h",
    texte: "Ouvrées. Et si je ne peux pas prendre le projet, je vous le dis tout de suite.",
  },
  {
    icone: ShieldCheck,
    titre: "Sans engagement",
    texte: "Le premier échange et le devis sont gratuits. Vous ne signez rien avant d'avoir tout lu.",
  },
  {
    icone: MapPin,
    titre: `${SITE.ville} et à distance`,
    texte: `Rendez-vous sur place dans un rayon de ${SITE.rayonKm} km, visioconférence partout ailleurs.`,
  },
];

export default function PageContact() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="halo-bleu pointer-events-none absolute inset-x-0 top-0 h-80"
        />

        <div className="conteneur relative pt-14 pb-12 sm:pt-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-semibold sm:text-5xl">Parlons de votre projet</h1>
            <p className="mt-5 text-lg leading-relaxed text-balance text-muted-foreground">
              Dites-moi ce que vous faites et ce dont vous avez besoin. Je vous réponds
              avec un périmètre écrit, un prix ferme et un délai — pas avec une
              plaquette.
            </p>
          </div>
        </div>
      </section>

      <section className="conteneur pb-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            {/* `useSearchParams` impose une frontière Suspense : sans elle, la
                page entière deviendrait dynamique et perdrait son rendu
                statique — donc une partie de sa vitesse, donc du SEO. */}
            <Suspense fallback={<SqueletteFormulaire />}>
              <FormulaireDevis />
            </Suspense>
          </div>

          <aside className="space-y-4">
            {REPERES.map(({ icone: Icone, titre, texte }) => (
              <div
                key={titre}
                className="flex gap-4 rounded-2xl border border-border bg-secondary/30 p-5"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-bleu-50 text-bleu-600 dark:bg-bleu-900/40 dark:text-bleu-300">
                  <Icone className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold">{titre}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {texte}
                  </p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-border p-5">
              <h2 className="text-sm font-semibold">Vous préférez le mail ?</h2>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-2.5 inline-flex items-center gap-2 text-sm text-bleu-700 underline-offset-4 transition-colors duration-150 ease-out hover:underline dark:text-bleu-300"
              >
                <Mail className="size-4" strokeWidth={1.75} aria-hidden="true" />
                {SITE.email}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function SqueletteFormulaire() {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index}>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-2 h-36 w-full rounded-xl" />
      </div>
      <Skeleton className="h-12 w-52 rounded-xl" />
    </div>
  );
}
