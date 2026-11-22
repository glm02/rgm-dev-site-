"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Projet } from "@/lib/types";
import { LOGOS_CLIENTS } from "./blocs-service";
import { LIENS } from "./liens";

const FILTRES = { tous: "Tous", sites: "Sites web", ia: "Automatisation IA" } as const;
type Filtre = keyof typeof FILTRES;

const AVEC_IA = new Set(["atout-travaux"]);

export type CarteRealisation = Pick<Projet, "id" | "slug" | "titre" | "image_couverture"> & { badge: string; texte: string };

export function GrilleRealisations({ projets }: { projets: CarteRealisation[] }) {
  const [filtre, setFiltre] = useState<Filtre>("tous");
  const visibles = projets.filter((p) => filtre !== "ia" || AVEC_IA.has(p.slug));

  return (
    <div className="flex flex-col gap-10">
      <Tabs value={filtre} onValueChange={(v) => setFiltre(v as Filtre)}>
        <TabsList>
          {(Object.keys(FILTRES) as Filtre[]).map((f) => (
            <TabsTrigger key={f} value={f}>
              {FILTRES[f]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="grid gap-x-6 gap-y-10 md:grid-cols-3">
        {visibles.map((p) => {
          const logo = LOGOS_CLIENTS[p.slug];
          return (
            <Link key={p.id} href={`${LIENS.realisations}/${p.slug}`} className="group flex flex-col gap-3.5">
              <div className="relative h-[220px] w-full overflow-hidden rounded-[16px] border border-border bg-muted md:h-[260px]">
                {p.image_couverture ? (
                  <Image
                    src={p.image_couverture}
                    alt={`Capture du site ${p.titre}`}
                    fill
                    sizes="(min-width: 768px) 384px, 100vw"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
                  />
                ) : null}
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-[5px] text-[18px] font-semibold">
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo.src} alt="" height={17} className="h-[17px] object-contain" style={{ width: logo.largeur }} />
                  ) : null}
                  {p.titre}
                </span>
                <span className="inline-flex h-[22px] items-center rounded-full bg-secondary px-2 text-xs font-medium whitespace-nowrap">{p.badge}</span>
              </div>
              <p className="text-base leading-[1.42]">{p.texte}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
