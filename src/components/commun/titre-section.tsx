import { Apparait } from "./apparait";
import { TexteAnime } from "./texte-anime";
import { cn } from "@/lib/utils";

/**
 * L'entête d'une section : surtitre, titre, sous-titre.
 *
 * Toujours le même bloc, pour que le rythme vertical du site reste le même
 * d'une section à l'autre. Le surtitre est court et catégorise ; le titre
 * porte l'idée ; le sous-titre développe en une phrase et s'arrête là.
 */
export function TitreSection({
  surtitre,
  titre,
  sousTitre,
  centre = true,
  className,
}: {
  surtitre?: string;
  titre: React.ReactNode;
  sousTitre?: React.ReactNode;
  centre?: boolean;
  className?: string;
}) {
  return (
    <Apparait
      className={cn(
        "max-w-2xl",
        centre && "mx-auto text-center",
        className,
      )}
    >
      {surtitre && (
        <p className="text-sm font-semibold tracking-wider text-bleu-600 uppercase dark:text-bleu-400">
          {/* Le surtitre se décode quand la section arrive à l'écran : il
              signale le changement de chapitre sans toucher au titre, qui
              reste immobile et lisible. */}
          <TexteAnime effet="scramble" duree={0.8}>
            {surtitre}
          </TexteAnime>
        </p>
      )}

      <h2 className={cn("text-3xl font-semibold sm:text-4xl", surtitre && "mt-3")}>
        {titre}
      </h2>

      {sousTitre && (
        <p className="mt-4 text-lg leading-relaxed text-balance text-muted-foreground">
          {sousTitre}
        </p>
      )}
    </Apparait>
  );
}
