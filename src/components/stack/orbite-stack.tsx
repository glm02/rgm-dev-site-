import { MarqueRgm } from "@/components/site/marque-rgm";
import { TuileLogo } from "@/components/stack/tuile-logo";
import type { Outil } from "@/lib/stack";
import { cn } from "@/lib/utils";

/**
 * Les outils en orbite autour de l'agent : le visuel du haut de la page.
 *
 * Tout est en CSS (voir `animate-orbite` dans `globals.css`), rendu côté
 * serveur : pas une ligne de JavaScript, et l'image est complète avant toute
 * animation. Les positions sont en pourcentages, donc l'orbite suit la largeur
 * de l'écran sans recalcul. Deux anneaux tournent en sens opposés à des
 * vitesses différentes : assez pour que l'œil sente un système vivant, trop
 * lent pour distraire de la lecture.
 */
function Anneau({
  outils,
  rayon,
  duree,
  sens = 1,
  taille,
}: {
  outils: Outil[];
  /** En pourcentage de la largeur de la scène. */
  rayon: number;
  duree: number;
  sens?: 1 | -1;
  taille: string;
}) {
  return (
    <div
      className={cn("absolute inset-0", sens === 1 ? "animate-orbite" : "animate-orbite-inverse")}
      style={{ "--orbite-duree": `${duree}s` } as React.CSSProperties}
    >
      <div
        aria-hidden="true"
        className="absolute rounded-full border border-dashed border-bleu-300/70 dark:border-bleu-700/60"
        style={{ inset: `${50 - rayon}%` }}
      />
      {outils.map((outil, index) => {
        const angle = (index / outils.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <div
            key={outil.nom}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${50 + rayon * Math.cos(angle)}%`,
              top: `${50 + rayon * Math.sin(angle)}%`,
            }}
          >
            {/* Contre-rotation : le logo reste droit pendant que l'anneau tourne. */}
            <div
              className={sens === 1 ? "animate-orbite-inverse" : "animate-orbite"}
              style={{ "--orbite-duree": `${duree}s` } as React.CSSProperties}
            >
              <TuileLogo outil={outil} className={taille} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function OrbiteStack({
  interieure,
  exterieure,
}: {
  interieure: Outil[];
  exterieure: Outil[];
}) {
  return (
    <div
      role="img"
      aria-label={`Les outils de la stack autour de l'agent : ${[...interieure, ...exterieure].map((o) => o.nom).join(", ")}.`}
      className="relative mx-auto aspect-square w-full max-w-[540px]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--bleu-500)_22%,transparent),transparent_70%)] blur-2xl"
      />

      <Anneau outils={exterieure} rayon={45} duree={140} sens={-1} taille="size-[clamp(38px,9.5vw,58px)]" />
      <Anneau outils={interieure} rayon={28} duree={90} taille="size-[clamp(42px,10.5vw,64px)]" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Le symbole de l'en-tête, en grand : l'agent au centre, c'est RGM. */}
        <span className="relative grid size-[clamp(76px,20vw,116px)] place-items-center rounded-[28%] bg-primary text-primary-foreground shadow-[0_24px_60px_-18px_var(--bleu-600)]">
          <span aria-hidden="true" className="absolute inset-0 animate-ping-paced rounded-[28%] bg-bleu-500/30" />
          <MarqueRgm className="relative size-[56%]" />
        </span>
      </div>
    </div>
  );
}
