import { TuileLogo } from "@/components/stack/tuile-logo";
import type { Outil } from "@/lib/stack";

/**
 * Le trajet d'une demande : elle arrive par Telegram ou par email, l'agent la
 * traite, et agit dans l'agenda, le tableur ou le site.
 *
 * Les liaisons sont un SVG à la même échelle que la scène (800 × 450) ; les
 * tuiles HTML sont posées par-dessus, en pourcentages de ces coordonnées.
 * Des points parcourent les liaisons (`animateMotion`) dans le sens de la
 * demande. Avec « réduire les animations », ils sont masqués et le schéma
 * reste lisible tel quel.
 */
const L = 800;
const H = 450;
const X_ENTREE = 110;
const X_AGENT = 400;
const X_SORTIE = 690;

function courbe(x1: number, y1: number, x2: number, y2: number) {
  const m = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${m} ${y1}, ${m} ${y2}, ${x2} ${y2}`;
}

function ordonnees(n: number) {
  const pas = H / (n + 1);
  return Array.from({ length: n }, (_, i) => pas * (i + 1));
}

function Noeud({ outil, x, y, etiquette }: { outil: Outil; x: number; y: number; etiquette: string }) {
  return (
    <div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
      style={{ left: `${(x / L) * 100}%`, top: `${(y / H) * 100}%` }}
    >
      <TuileLogo outil={outil} className="size-[clamp(40px,8vw,64px)]" />
      <span className="text-xs font-medium whitespace-nowrap sm:text-sm">{etiquette}</span>
    </div>
  );
}

export function SchemaHermes({ entrees, sorties }: { entrees: Outil[]; sorties: Outil[] }) {
  const ye = ordonnees(entrees.length);
  const ys = ordonnees(sorties.length);
  const chemins = [
    ...ye.map((y) => courbe(X_ENTREE + 36, y, X_AGENT - 60, H / 2)),
    ...ys.map((y) => courbe(X_AGENT + 60, H / 2, X_SORTIE - 36, y)),
  ];

  const description = `Une demande arrive par ${entrees.map((e) => e.nom).join(" ou ")}, l'agent Hermes la traite et agit dans ${sorties.map((s) => s.nom).join(", ")}.`;

  return (
    <>
      {/* Téléphone : le même trajet, de haut en bas. Réduit à 340 px, le
          schéma horizontal faisait se chevaucher les étiquettes. */}
      <div role="img" aria-label={description} className="flex flex-col items-center gap-4 sm:hidden">
        <RangeeOutils outils={entrees} />
        <Liaison />
        <AgentHermes />
        <Liaison />
        <RangeeOutils outils={sorties} />
      </div>

    <div
      role="img"
      aria-label={description}
      className="relative mx-auto hidden aspect-[16/9] w-full max-w-3xl sm:block"
    >
      <svg viewBox={`0 0 ${L} ${H}`} className="absolute inset-0 size-full" aria-hidden="true">
        {chemins.map((d, i) => (
          <g key={i}>
            <path id={`liaison-${i}`} d={d} fill="none" className="stroke-bleu-300 dark:stroke-bleu-800" strokeWidth={2} />
            <circle r={5} className="fill-bleu-600 motion-reduce:hidden dark:fill-bleu-400">
              {/* Les entrées partent d'abord, les sorties après : on lit le sens
                  de la demande sans légende. */}
              <animateMotion dur="2.4s" begin={`${i < ye.length ? i * 0.3 : 1.2 + (i - ye.length) * 0.25}s`} repeatCount="indefinite">
                <mpath href={`#liaison-${i}`} />
              </animateMotion>
            </circle>
          </g>
        ))}
      </svg>

      {entrees.map((outil, i) => (
        <Noeud key={outil.nom} outil={outil} x={X_ENTREE} y={ye[i]} etiquette={outil.nom} />
      ))}
      {sorties.map((outil, i) => (
        <Noeud key={outil.nom} outil={outil} x={X_SORTIE} y={ys[i]} etiquette={outil.nom} />
      ))}

      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${(X_AGENT / L) * 100}%`, top: "50%" }}
      >
        <AgentHermes />
      </div>
    </div>
    </>
  );
}

function AgentHermes() {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <span className="relative grid size-[clamp(72px,13vw,104px)] place-items-center shadow-[0_24px_60px_-18px_var(--bleu-600)]">
        <span aria-hidden="true" className="absolute inset-0 animate-ping-paced rounded-[28%] bg-bleu-500/35" />
        {/* Le logo de Nous Research, l'éditeur de Hermes Agent. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- logo de 96 px, déjà léger. */}
        <img src="/logos/hermes.png" alt="Hermes Agent" width={104} height={104} className="relative size-full rounded-[28%] border border-border/70" />
      </span>
      <span className="text-sm font-semibold whitespace-nowrap">Agent Hermes</span>
    </div>
  );
}

function RangeeOutils({ outils }: { outils: Outil[] }) {
  return (
    <div className="flex justify-center gap-5">
      {outils.map((outil) => (
        <div key={outil.nom} className="flex flex-col items-center gap-2">
          <TuileLogo outil={outil} className="size-14" />
          <span className="text-xs font-medium">{outil.nom}</span>
        </div>
      ))}
    </div>
  );
}

/** Un trait vertical où un point descend : le sens de la demande. */
function Liaison() {
  return (
    <span aria-hidden="true" className="relative h-10 w-px overflow-hidden bg-bleu-300 dark:bg-bleu-800">
      <span className="absolute left-1/2 size-2 -translate-x-1/2 animate-[descente_1.6s_ease-in-out_infinite] rounded-full bg-bleu-600 motion-reduce:hidden dark:bg-bleu-400" />
    </span>
  );
}
