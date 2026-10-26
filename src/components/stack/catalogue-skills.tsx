"use client";

import { ArrowUpRight } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type Skill = { nom: string; categorie: string; role: string };

/**
 * Les 39 skills, filtrables par catégorie.
 *
 * Un filtre plutôt qu'une longue liste : un recruteur cherche « sécurité » ou
 * « agents », pas la skill numéro 27. Le filtre ne retire rien du HTML rendu
 * côté serveur au départ (« Toutes »), donc tout reste indexable.
 */
export function CatalogueSkills({ skills, depot }: { skills: Skill[]; depot: string }) {
  const categories = React.useMemo(() => [...new Set(skills.map((s) => s.categorie))], [skills]);
  const [filtre, setFiltre] = React.useState<string | null>(null);
  const [tout, setTout] = React.useState(false);
  const filtrees = filtre ? skills.filter((s) => s.categorie === filtre) : skills;
  // Sans filtre, neuf cartes d'abord : trente-neuf d'un coup font un mur qu'on
  // survole sans lire. Une catégorie choisie s'affiche toujours en entier.
  const visibles = filtre || tout ? filtrees : filtrees.slice(0, 9);

  const puces = [{ libelle: "Toutes", valeur: null, nombre: skills.length }, ...categories.map((c) => ({
    libelle: c,
    valeur: c,
    nombre: skills.filter((s) => s.categorie === c).length,
  }))];

  return (
    <div>
      <div role="group" aria-label="Filtrer les skills par catégorie" className="flex flex-wrap justify-center gap-2">
        {puces.map((puce) => {
          const actif = filtre === puce.valeur;
          return (
            <button
              key={puce.libelle}
              type="button"
              aria-pressed={actif}
              onClick={() => setFiltre(puce.valeur)}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium",
                "transition-[background-color,border-color,color,scale] duration-150 ease-out active:scale-96",
                "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                actif
                  ? "border-bleu-600 bg-bleu-600 text-white"
                  : "border-border bg-background hover:border-bleu-300 hover:bg-bleu-50 dark:hover:border-bleu-700 dark:hover:bg-bleu-950/50",
              )}
            >
              {puce.libelle}
              <span className={cn("tabular-nums", actif ? "text-white/80" : "text-bleu-700 dark:text-bleu-300")}>
                {puce.nombre}
              </span>
            </button>
          );
        })}
      </div>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((skill, index) => (
          <li
            key={skill.nom}
            className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-300 ease-out"
            style={{ animationDelay: `${Math.min(index, 12) * 25}ms` }}
          >
            <a
              href={`${depot}/tree/main/skills/${skill.nom}`}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "group flex h-full flex-col rounded-2xl border border-border/70 bg-background p-5",
                "transition-[border-color,box-shadow,translate] duration-200 ease-out",
                "hover:-translate-y-0.5 hover:border-bleu-300 hover:shadow-[0_14px_40px_-20px_var(--bleu-600)] dark:hover:border-bleu-700",
                "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <code className="font-mono text-[15px] font-semibold text-bleu-700 dark:text-bleu-300">/{skill.nom}</code>
                <ArrowUpRight
                  className="size-4 shrink-0 opacity-0 transition-[opacity,translate] duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-2 text-[15px] leading-relaxed">{skill.role}</span>
              <span className="mt-auto pt-4 text-xs font-semibold tracking-wider uppercase">{skill.categorie}</span>
            </a>
          </li>
        ))}
      </ul>

      {visibles.length < filtrees.length && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setTout(true)}
            className={cn(
              "inline-flex h-11 items-center rounded-full bg-bleu-600 px-6 text-sm font-medium text-white",
              "transition-[background-color,scale] duration-150 ease-out hover:bg-bleu-700 active:scale-96",
              "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
            )}
          >
            Voir les {filtrees.length} skills
          </button>
        </div>
      )}
    </div>
  );
}
