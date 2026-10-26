import type { Outil } from "@/lib/stack";
import { cn } from "@/lib/utils";

/**
 * Un outil dans sa tuile blanche, en couleur de marque.
 *
 * Ailleurs sur le site les logos restent monochromes : ils accompagnent un
 * texte. Ici ils *sont* le contenu — la page montre une stack — donc ils
 * gardent leur couleur. Les marques noires suivent la couleur du texte pour
 * ne pas disparaître en thème sombre.
 *
 * Sans logo libre (Orca, Hermes, Codex…), un monogramme bleu : honnête, et
 * jamais un faux logo dessiné à la main.
 */
/** Luminance perçue (0 à 1) : comparer le code hexadécimal comme un nombre
 *  classait le bleu de Telegram parmi les marques noires. */
function luminance(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function TuileLogo({
  outil,
  className,
  tailleIcone = "size-[46%]",
}: {
  outil: Outil;
  className?: string;
  tailleIcone?: string;
}) {
  // Noir ou presque blanc (Base UI) : illisible sur l'un des deux thèmes, donc
  // on suit la couleur du texte.
  const lum = outil.icone ? luminance(outil.icone.hex) : 0;
  const sombre = outil.icone && (lum < 0.12 || lum > 0.85);

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-[28%] border border-border/70 bg-background",
        "shadow-[0_1px_2px_rgb(0_0_0/0.05),0_10px_28px_-14px_rgb(0_0_0/0.22)]",
        className,
      )}
    >
      {outil.icone ? (
        <svg
          viewBox="0 0 24 24"
          role="img"
          aria-label={outil.nom}
          className={cn(tailleIcone, sombre && "fill-foreground")}
          style={sombre ? undefined : { fill: `#${outil.icone.hex}` }}
        >
          <path d={outil.icone.path} />
        </svg>
      ) : (
        <span
          role="img"
          aria-label={outil.nom}
          className="text-[0.95em] font-semibold tracking-tight text-bleu-700 dark:text-bleu-300"
        >
          {outil.monogramme}
        </span>
      )}
    </span>
  );
}
