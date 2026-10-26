"use client";

import { CopyButton } from "@appica/ui-react/copy-button";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Le tuto : installer une de mes skills dans son agent.
 *
 * Un onglet par agent, trois étapes, des commandes à copier. Le format
 * SKILL.md est le même partout : seul le dossier de destination change.
 */

type Agent = {
  id: string;
  nom: string;
  logo: { d?: string; couleur?: string; image?: string };
  dossier: string;
  utiliser: string;
};

const DEPOT = "https://github.com/glm02/skills-claude-code.git";

function Commande({ code }: { code: string }) {
  return (
    <div className="mt-3 flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/50 py-1.5 pr-1.5 pl-4">
      <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[13px] whitespace-nowrap">{code}</code>
      <CopyButton value={code} variant="ghost" size="icon-sm" label="Copier la commande" copiedLabel="Copiée" />
    </div>
  );
}

function Logo({ logo }: { logo: Agent["logo"] }) {
  return logo.image ? (
    // eslint-disable-next-line @next/next/no-img-element -- logo de 96 px.
    <img src={logo.image} alt="" width={20} height={20} className="size-5 rounded-md" />
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" style={{ fill: logo.couleur }}>
      <path d={logo.d} />
    </svg>
  );
}

export function TutoInstallation({ agents }: { agents: Agent[] }) {
  const [actif, setActif] = React.useState(agents[0].id);
  const agent = agents.find((a) => a.id === actif) ?? agents[0];

  const etapes = [
    { titre: "Récupérer les skills", code: `git clone ${DEPOT}` },
    { titre: "Copier une skill dans l'agent", code: `cp -r skills-claude-code/skills/site-a-z ${agent.dossier}` },
    { titre: "L'utiliser", texte: agent.utiliser },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <div role="tablist" aria-label="Choisir son agent" className="flex flex-wrap justify-center gap-2">
        {agents.map((a) => (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={a.id === actif}
            onClick={() => setActif(a.id)}
            className={cn(
              "inline-flex h-11 items-center gap-2.5 rounded-full border px-4 text-sm font-medium",
              "transition-[background-color,border-color,scale] duration-150 ease-out active:scale-96",
              "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
              a.id === actif
                ? "border-bleu-300 bg-bleu-50 dark:border-bleu-700 dark:bg-bleu-950"
                : "border-border bg-background hover:border-bleu-200",
            )}
          >
            <Logo logo={a.logo} />
            {a.nom}
          </button>
        ))}
      </div>

      <ol role="tabpanel" className="mt-8 space-y-4">
        {etapes.map((etape, index) => (
          <li key={etape.titre} className="flex gap-4 rounded-3xl border border-border/70 bg-background p-5 sm:p-6">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-bleu-600 text-sm font-semibold text-white tabular-nums">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{etape.titre}</p>
              {etape.code ? <Commande code={etape.code} /> : <p className="mt-1.5 leading-relaxed">{etape.texte}</p>}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Toutes d&apos;un coup : <code className="font-mono">skills/*</code> au lieu de{" "}
        <code className="font-mono">skills/site-a-z</code>. Sous Windows,{" "}
        <code className="font-mono">~</code> est <code className="font-mono">%USERPROFILE%</code>.
      </p>
    </div>
  );
}
