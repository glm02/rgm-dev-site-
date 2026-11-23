import type { Metadata } from "next";
import { Suspense } from "react";

import { FormulaireDevis } from "@/components/commun/formulaire-devis";
import { Skeleton } from "@/components/ui/skeleton";
import { BandeauPaysage } from "@/components/rgm/bandeau";
import type { NomIcone } from "@/components/rgm/icones";
import { TuileIcone } from "@/components/rgm/primitives";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Contact — demander un devis",
  description:
    "Décrivez votre projet : je réponds sous 48 heures ouvrées avec un périmètre écrit et un prix ferme. Développeur freelance à Lyon.",
  chemin: "/contact",
});

const INFOS: { icone: NomIcone; texte: string }[] = [
  { icone: "location", texte: "Lyon et Auvergne-Rhône-Alpes" },
  { icone: "wallet", texte: "Prix affichés, devis gratuit" },
  { icone: "message", texte: "Réponse par email" },
];

export default function PageContact() {
  return (
    <>
      <BandeauPaysage paysage="nuages" decalage={-126} hauteur={350} hauteurMobile={290} voile="clair">
        <h1 className="text-center font-titre text-[44px] leading-[1.05] font-bold tracking-[-1.76px] text-white md:text-[73px] md:tracking-[-2.92px]">
          Demander <span className="font-marqueur font-normal tracking-normal md:text-[66px]">un devis</span>
        </h1>
      </BandeauPaysage>

      {/* Après l'envoi, la confirmation prend toute la largeur : la carte et les infos s'effacent. */}
      <section className="mx-auto flex w-full max-w-[1416px] flex-col gap-8 px-4 pt-10 pb-16 md:flex-row md:gap-[51px] md:pt-[72px] md:pr-[108px] md:pb-[120px] md:pl-[219px] [&:has([role=status])>aside]:hidden">
        <div className="rounded-[16px] border border-border bg-white p-5 md:w-[582px] md:shrink-0 md:p-8 has-[[role=status]]:w-full has-[[role=status]]:border-0">
          <Suspense fallback={<SqueletteFormulaire />}>
            <FormulaireDevis />
          </Suspense>
        </div>
        <aside className="flex flex-col gap-5 md:pt-8">
          {INFOS.map((i) => (
            <p key={i.texte} className="flex items-center gap-3 text-[15px] font-medium">
              <TuileIcone nom={i.icone} />
              {i.texte}
            </p>
          ))}
        </aside>
      </section>
    </>
  );
}

function SqueletteFormulaire() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-8 w-full rounded-[10px]" />
          </div>
        ))}
      </div>
      <Skeleton className="h-[140px] w-full rounded-[10px]" />
      <Skeleton className="h-9 w-full rounded-full" />
    </div>
  );
}
