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
export const TECHNOS: { icone: SimpleIcon; nom?: string; usage: string }[] = [
  { icone: siNextdotjs, usage: "Des sites rendus côté serveur, rapides et bien référencés." },
  { icone: siReact, usage: "Des interfaces vivantes : espaces clients, tableaux de bord." },
  { icone: siTypescript, usage: "Un code typé, qui casse moins et se reprend facilement." },
  { icone: siSupabase, usage: "Base de données, comptes et fichiers, hébergés en Europe." },
  { icone: siPostgresql, usage: "Vos données dans une base standard, jamais enfermées." },
  { icone: siTailwindcss, usage: "Un design sur mesure, cohérent d'une page à l'autre." },
  { icone: siN8n, usage: "Les workflows qui relient vos outils et tournent seuls." },
  { icone: siAnthropic, usage: "Les agents IA qui lisent, trient et rédigent à votre place." },
  { icone: siPython, usage: "Traitement de données et scripts d'automatisation." },
  { icone: siNodedotjs, usage: "Les serveurs et API qui font tourner vos services." },
  { icone: siStripe, usage: "Le paiement en ligne, quand votre site doit encaisser." },
  { icone: siResend, usage: "Les emails automatiques qui arrivent en boîte de réception." },
  { icone: siVercel, usage: "Un hébergement mondial, mis en ligne à chaque modification." },
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
        "text-muted-foreground transition-colors duration-200 ease-out",
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
