import { Button } from "@appica/ui-react/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@appica/ui-react/tabs";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

import { CarteOffre } from "@/components/commun/carte-offre";
import { TitreSection } from "@/components/commun/titre-section";
import { offresParService } from "@/lib/donnees";
import { cn } from "@/lib/utils";

/**
 * Les tarifs en page d'accueil, en onglets.
 *
 * Une première version montrait une offre par métier. Les onglets (Tabs
 * d'Appica) donnent accès aux sept formules sans allonger la page : le
 * visiteur choisit son métier, il ne fait pas défiler ceux des autres.
 *
 * **L'onglet ouvert par défaut est l'automatisation IA** — le service le plus
 * rentable et celui que RGM Dev met en avant (AGENTS.md §3). Dans chaque
 * onglet, l'offre marquée « en vedette » en base passe en bleu.
 */
export async function ApercuTarifs() {
  const groupes = (await offresParService()).filter((g) => g.offres.length > 0);
  if (groupes.length === 0) return null;

  const ouvert =
    groupes.find((g) => g.service.slug === "automatisation-ia")?.service.slug ??
    groupes[0].service.slug;

  const LIBELLES_COURTS: Record<string, string> = {
    "sites-web": "Sites web",
    "automatisation-ia": "Automatisation IA",
    "maintenance-supervision": "Maintenance",
  };

  const total = groupes.reduce((somme, g) => somme + g.offres.length, 0);

  // Ni filet ni aplat opaque : la nappe 3D passe derrière toute la page
  // d'accueil, et une bordure pleine la coupait net comme une image tronquée.
  return (
    <section
      id="tarifs"
      className="bg-linear-to-b from-transparent via-secondary/40 to-transparent py-20 sm:py-28"
    >
      <div className="conteneur">
        <TitreSection
          surtitre="Tarifs"
          titre="Les prix sont affichés"
          sousTitre="Choisissez votre besoin : vous savez ce que ça coûte avant de décrocher le téléphone."
        />

        <Tabs defaultValue={ouvert} variant="pill" size="lg" className="mt-12">
          <TabsList className="mx-auto">
            {groupes.map(({ service }) => (
              <TabsTrigger key={service.slug} value={service.slug}>
                {LIBELLES_COURTS[service.slug] ?? service.titre}
              </TabsTrigger>
            ))}
          </TabsList>

          {groupes.map(({ service, offres }) => (
            <TabsContent key={service.slug} value={service.slug} className="mt-12">
              <div
                className={cn(
                  "grid items-stretch gap-5",
                  offres.length === 1 && "mx-auto max-w-md",
                  offres.length === 2 && "mx-auto max-w-3xl md:grid-cols-2",
                  offres.length >= 3 && "md:grid-cols-3",
                )}
              >
                {offres.map((offre) => (
                  <CarteOffre key={offre.id} offre={offre} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-5">
          {/* Une ligne d'information plutôt que l'Alert d'Appica : dans cette
              colonne flex, l'Alert s'écrasait à 42 px de large, texte illisible. */}
          <p className="flex w-full items-start gap-3 rounded-xl border border-bleu-200 bg-bleu-50 px-5 py-4 text-sm leading-relaxed text-bleu-950 dark:border-bleu-800 dark:bg-bleu-950/40 dark:text-bleu-100">
            <Info className="mt-0.5 size-4 shrink-0 text-bleu-600 dark:text-bleu-300" aria-hidden="true" />
            Prix HT, à titre indicatif. Le devis devient ferme une fois le périmètre écrit — et il
            ne bouge plus ensuite.
          </p>

          <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/tarifs" />}>
            {/* Compté, pas écrit en dur : une offre ajoutée dans l'admin ne doit
                pas transformer ce lien en mensonge. */}
            Comparer les {total} formules
            <ArrowRight data-icon="end" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
