import type { Metadata } from "next";

import { BandeauPaysage, BoutonDegrade } from "@/components/rgm/bandeau";
import { ColonnePage } from "@/components/rgm/blocs-service";
import { Icone } from "@/components/rgm/icones";
import { LIENS } from "@/components/rgm/liens";
import { TuileIcone } from "@/components/rgm/primitives";
import { listerAvis, noteGlobale } from "@/lib/donnees";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Avis clients",
  description:
    "Les témoignages des clients de RGM Dev, déposés depuis leur espace après livraison. Aucun avis n'est écrit par nous.",
  chemin: "/avis",
});

export const revalidate = 300;

const CARTE = "flex flex-col items-start gap-4 rounded-[16px] border border-border p-7";

function Etoiles({ note }: { note: number }) {
  return (
    <span className="flex text-primary" aria-label={`${note} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icone key={i} nom="star" taille={16} className={i <= Math.round(note) ? "fill-current" : ""} />
      ))}
    </span>
  );
}

export default async function PageAvis() {
  const [avis, note] = await Promise.all([listerAvis(), noteGlobale()]);

  return (
    <>
      <BandeauPaysage paysage="sommet-enneige" decalage={-135} hauteur={350} hauteurMobile={290}>
        <h1 className="font-titre text-[44px] leading-[1.05] font-bold tracking-[-1.76px] text-white md:text-[96px] md:tracking-[-3.84px]">
          Avis <span className="font-marqueur font-normal tracking-normal">clients</span>
        </h1>
      </BandeauPaysage>

      <ColonnePage>
        <section className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className={`${CARTE} bg-muted md:flex-1`}>
            <TuileIcone nom="star" />
            <h2 className="text-[24px] font-bold">Note globale</h2>
            {note ? (
              <span className="flex items-center gap-2 text-[18px] font-semibold">
                {note.moyenne.toLocaleString("fr-FR")} / 5 <Etoiles note={note.moyenne} />
              </span>
            ) : (
              <span className="text-[18px] font-semibold">Pas encore de note</span>
            )}
            <span className="text-sm">
              {avis.length} avis publié{avis.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className={`${CARTE} bg-white md:flex-1`}>
            {avis.length === 0 ? (
              <>
                <Icone nom="citation" taille={28} className="text-primary" />
                <h2 className="text-[24px] font-bold">Aucun avis publié pour l’instant</h2>
                <p className="text-base">Les avis apparaîtront ici après publication.</p>
              </>
            ) : (
              <ul className="flex w-full flex-col divide-y divide-border">
                {avis.map((a) => (
                  <li key={a.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
                    <Etoiles note={a.note} />
                    <p className="text-base">{a.contenu}</p>
                    <span className="text-sm font-semibold">
                      {a.auteur_nom}
                      {a.auteur_entreprise ? ` · ${a.auteur_entreprise}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="flex flex-col items-start gap-3 rounded-[16px] border border-border bg-muted p-7">
          <h2 className="flex items-center gap-[5px] text-[26px] leading-[1.4] font-bold md:text-[34px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/figma/logos/rgm-dev.svg" alt="" width={16} height={16} className="size-4" />
            Vous avez travaillé avec RGM Dev ?
          </h2>
          <p className="text-base">Déposez votre avis depuis votre espace client après la livraison.</p>
          <BoutonDegrade href={`${LIENS.espaceClient}/avis`}>Accéder à mon espace client</BoutonDegrade>
        </section>
      </ColonnePage>
    </>
  );
}
