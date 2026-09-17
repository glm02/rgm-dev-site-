"use client";

import { Badge } from "@appica/ui-react/badge";
import { Button } from "@appica/ui-react/button";
import { Card } from "@appica/ui-react/card";
import { GradientGlow } from "@appica/ui-react/gradient-glow";
import { Meter, MeterProgress } from "@appica/ui-react/meter";
import { NumberField } from "@appica/ui-react/number-field";
import { Progress } from "@appica/ui-react/progress";
import { Slider } from "@appica/ui-react/slider";
import { Sparkline, SparklineChart } from "@appica/ui-react/sparkline";
import { Toggle } from "@appica/ui-react/toggle";
import { ToggleGroup } from "@appica/ui-react/toggle-group";
import Link from "next/link";
import { ArrowRight, Clock3, FileText, Inbox, Receipt, Repeat } from "lucide-react";
import * as React from "react";

import { euros } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Les tâches types, pour pré-remplir le calculateur d'un clic.
 *
 * Les heures sont des ordres de grandeur pour une petite équipe, pas des
 * promesses : le visiteur les ajuste au curseur juste après.
 */
const TACHES = [
  { id: "relances", libelle: "Relances clients", icone: Repeat, heures: 4, part: 80 },
  { id: "devis", libelle: "Devis et factures", icone: Receipt, heures: 6, part: 60 },
  { id: "mails", libelle: "Tri des mails", icone: Inbox, heures: 5, part: 70 },
  { id: "saisie", libelle: "Saisie et reporting", icone: FileText, heures: 8, part: 75 },
] as const;

/** Semaines travaillées par an, congés déduits. */
const SEMAINES = 47;

/**
 * « Combien vous coûtent ces tâches ? »
 *
 * Le calculateur rend concret ce que « automatisation IA » laisse abstrait : un
 * nombre d'heures et d'euros par an, et le temps qu'il faut pour rentabiliser
 * le projet. C'est l'argument de vente du service le plus rentable de RGM Dev.
 *
 * Il reste honnête : les hypothèses sont affichées, modifiables, et le coût du
 * projet reprend la fourchette réelle de la page tarifs — pas un chiffre choisi
 * pour flatter le résultat.
 */
export function CalculateurGain({
  prixMin,
  prixMax,
}: {
  /** Fourchette de l'offre « Automatisation d'un processus », en € HT. */
  prixMin: number;
  prixMax: number;
}) {
  const [tache, setTache] = React.useState<string>("devis");
  const [heures, setHeures] = React.useState(6);
  const [part, setPart] = React.useState(60);
  const [coutHoraire, setCoutHoraire] = React.useState<number | null>(35);

  const choisirTache = (ids: string[]) => {
    const id = ids[0];
    const modele = TACHES.find((t) => t.id === id);
    if (!modele) return;
    setTache(modele.id);
    setHeures(modele.heures);
    setPart(modele.part);
  };

  const cout = coutHoraire ?? 0;
  const heuresGagneesSemaine = (heures * part) / 100;
  const heuresGagneesAn = Math.round(heuresGagneesSemaine * SEMAINES);
  const gainAn = Math.round(heuresGagneesSemaine * cout * SEMAINES);
  const projet = Math.round((prixMin + prixMax) / 2);
  const gainSemaine = heuresGagneesSemaine * cout;
  const semainesAmortissement = gainSemaine > 0 ? Math.ceil(projet / gainSemaine) : null;

  // Le gain cumulé sur 12 mois, projet déduit : la courbe passe sous zéro puis
  // remonte. Le moment où elle croise l'axe est le vrai argument.
  const cumul = Array.from({ length: 13 }, (_, mois) =>
    Math.round((gainAn / 12) * mois - projet),
  );
  const libellesMois = cumul.map((_, mois) => (mois === 0 ? "Démarrage" : `Mois ${mois}`));

  return (
    <section className="conteneur py-20 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-wider text-bleu-600 uppercase dark:text-bleu-400">
          Automatisation IA
        </p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Combien vous coûtent ces tâches ?</h2>
        <p className="mt-4 text-lg leading-relaxed text-balance text-muted-foreground">
          Choisissez une tâche, ajustez les curseurs : vous voyez le temps récupéré, ce qu&apos;il
          représente, et quand le projet est remboursé.
        </p>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* --- Les réglages -------------------------------------------------- */}
        <Card className="p-6 sm:p-7">
          <p className="text-sm font-medium">La tâche qui vous prend du temps</p>
          <ToggleGroup
            value={[tache]}
            onValueChange={(valeurs: unknown[]) => choisirTache(valeurs as string[])}
            className="mt-3 grid w-full grid-cols-2 gap-2"
            aria-label="Tâche à automatiser"
          >
            {TACHES.map(({ id, libelle, icone: Icone }) => (
              <Toggle
                key={id}
                value={id}
                className={cn(
                  "flex h-auto items-center gap-2.5 rounded-xl border border-border bg-background px-3 py-3 text-left text-sm font-medium",
                  "transition-[background-color,border-color,color,scale] duration-150 ease-out active:scale-[0.97]",
                  "hover:bg-secondary data-pressed:border-bleu-300 data-pressed:bg-bleu-50 data-pressed:text-bleu-800",
                  "dark:data-pressed:border-bleu-700 dark:data-pressed:bg-bleu-950/50 dark:data-pressed:text-bleu-100",
                )}
              >
                <Icone className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                {libelle}
              </Toggle>
            ))}
          </ToggleGroup>

          <div className="mt-8 space-y-7">
            <Reglage
              libelle="Heures passées par semaine"
              valeur={`${heures} h`}
              aide="Toutes personnes confondues."
            >
              <Slider
                value={heures}
                onValueChange={(v: number | readonly number[]) => setHeures(Array.isArray(v) ? v[0] : (v as number))}
                min={1}
                max={40}
                step={1}
                thumbAriaLabel="Heures par semaine"
                tooltipVisibility="never"
              />
            </Reglage>

            <Reglage
              libelle="Part automatisable"
              valeur={`${part} %`}
              aide="Rarement 100 % : il reste des cas qu'un humain doit trancher."
            >
              <Slider
                value={part}
                onValueChange={(v: number | readonly number[]) => setPart(Array.isArray(v) ? v[0] : (v as number))}
                min={10}
                max={95}
                step={5}
                thumbAriaLabel="Part automatisable"
                tooltipVisibility="never"
              />
            </Reglage>

            <div>
              <label htmlFor="cout-horaire" className="text-sm font-medium">
                Coût horaire chargé
              </label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Salaire, charges et frais : 30 à 45 € pour un employé, davantage pour un dirigeant.
              </p>
              <NumberField
                id="cout-horaire"
                value={coutHoraire}
                onValueChange={(v: number | null) => setCoutHoraire(v)}
                min={10}
                max={300}
                step={5}
                format={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}
                locale="fr-FR"
                className="mt-2.5 w-48"
              />
            </div>
          </div>
        </Card>

        {/* --- Le résultat --------------------------------------------------- */}
        {/* Le halo tournant (GradientGlow) désigne la carte à lire. Un seul sur
            la page : c'est la réponse à la question du titre. */}
        <GradientGlow
          from="var(--bleu-400)"
          via="var(--bleu-600)"
          to="var(--bleu-300)"
          blur="2xl"
          speed={8}
          className="rounded-2xl"
        >
          <Card className="h-full p-6 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">Ce que vous récupérez</p>
              <Badge variant="soft" size="sm">
                Estimation
              </Badge>
            </div>

            <p className="mt-4 text-5xl font-semibold tracking-tight tabular-nums text-bleu-700 dark:text-bleu-300">
              {euros(gainAn)}
              <span className="ml-2 text-base font-medium text-muted-foreground">par an</span>
            </p>

            <div className="mt-6">
              <div className="flex items-baseline justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <Clock3 className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  {heuresGagneesAn} heures libérées par an
                </span>
                <span className="font-medium tabular-nums">
                  {heuresGagneesSemaine.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} h / sem.
                </span>
              </div>
              {/* Rapporté à une semaine de 35 h : « 4,2 h » ne parle à personne,
                  « un huitième de poste » si. */}
              <Meter
                value={Math.min(heuresGagneesSemaine, 35)}
                max={35}
                aria-label="Heures libérées sur une semaine de 35 heures"
                className="mt-2.5"
              >
                <MeterProgress />
              </Meter>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Soit {Math.round((heuresGagneesSemaine / 35) * 100)} % d&apos;un temps plein.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-xl bg-secondary/60 p-4">
              <Progress
                variant="circular"
                size={56}
                thickness={6}
                value={semainesAmortissement ? Math.min(100, Math.round((semainesAmortissement / 52) * 100)) : 100}
                aria-label="Part de l'année nécessaire pour rentabiliser le projet"
              />
              <div>
                <p className="text-sm font-semibold">
                  {semainesAmortissement && semainesAmortissement <= 104
                    ? `Remboursé en ${semainesAmortissement} semaine${semainesAmortissement > 1 ? "s" : ""}`
                    : "Pas rentable à ce volume"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Pour un projet à {euros(projet)} HT, milieu de la fourchette {euros(prixMin)} – {euros(prixMax)}.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs text-muted-foreground">Gain cumulé sur 12 mois, projet déduit</p>
              <Sparkline
                data={cumul}
                labels={libellesMois}
                color="var(--bleu-600)"
                format={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}
                locale="fr-FR"
                className="mt-2"
              >
                <SparklineChart
                  variant="area"
                  height={64}
                  curve={0.3}
                  baseline={0}
                  tooltip
                  aria-label={`Gain cumulé sur 12 mois : ${euros(cumul[12])} à la fin de la première année`}
                />
              </Sparkline>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="mt-7 w-full"
              nativeButton={false}
              render={
                <Link href={`/contact?service=${encodeURIComponent("Automatisation IA")}&heures=${heures}`} />
              }
            >
              Récupérer ces {heuresGagneesAn} heures
              <ArrowRight data-icon="end" aria-hidden="true" />
            </Button>
          </Card>
        </GradientGlow>
      </div>
    </section>
  );
}

function Reglage({
  libelle,
  valeur,
  aide,
  children,
}: {
  libelle: string;
  valeur: string;
  aide: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium">{libelle}</p>
        <p className="text-sm font-semibold tabular-nums text-bleu-700 dark:text-bleu-300">{valeur}</p>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{aide}</p>
      <div className="mt-3.5">{children}</div>
    </div>
  );
}
