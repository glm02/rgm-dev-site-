import {
  siAnthropic,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siResend,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";

import { cn } from "@/lib/utils";

/**
 * Les vraies marques des outils utilisés.
 *
 * Les glyphes viennent de `simple-icons`. Ils sont rendus **côté serveur** : ce
 * qui part au navigateur est un `<path>` déjà résolu, jamais la bibliothèque —
 * qui pèse plusieurs mégaoctets.
 *
 * Affichage en monochrome au repos, couleur de marque au survol. Treize logos
 * en couleur d'un coup transformeraient une bande sobre en guirlande, et le
 * site est bleu et blanc. La couleur récompense l'attention au lieu de la
 * réclamer.
 *
 * Les logos ne servent qu'à désigner les technologies réellement employées ;
 * ils restent la propriété de leurs détenteurs.
 */
export const TECHNOS: { icone: SimpleIcon; nom?: string }[] = [
  { icone: siNextdotjs },
  { icone: siReact },
  { icone: siTypescript },
  { icone: siSupabase },
  { icone: siPostgresql },
  { icone: siTailwindcss },
  { icone: siN8n },
  { icone: siAnthropic },
  { icone: siPython },
  { icone: siNodedotjs },
  { icone: siStripe },
  { icone: siResend },
  { icone: siVercel },
];

export function LogoTechno({
  icone,
  nom,
  className,
}: {
  icone: SimpleIcon;
  nom?: string;
  className?: string;
}) {
  const libelle = nom ?? icone.title;

  return (
    <span
      className={cn(
        "group/logo inline-flex shrink-0 items-center gap-2.5",
        "text-muted-foreground/70 transition-colors duration-200 ease-out",
        "hover:text-foreground",
        className,
      )}
      style={{ "--marque": `#${icone.hex}` } as React.CSSProperties}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={cn(
          "size-5 fill-current transition-colors duration-200 ease-out",
          // Les marques noires deviennent invisibles en thème sombre : on les
          // laisse suivre la couleur du texte plutôt que de forcer le noir.
          icone.hex.toLowerCase() === "000000"
            ? ""
            : "group-hover/logo:fill-[var(--marque)]",
        )}
      >
        <path d={icone.path} />
      </svg>

      <span className="text-[13px] font-medium tracking-wide whitespace-nowrap">
        {libelle}
      </span>
    </span>
  );
}
