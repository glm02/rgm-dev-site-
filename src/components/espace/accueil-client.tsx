import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, CheckCircle2, FileSignature, MessageCircle, Receipt } from "lucide-react";

import { EtatVide } from "./entete-page";
import { Pastille } from "./pastille";
import { dateLongue, euros } from "@/lib/format";
import { STATUT_MISSION } from "@/lib/libelles";
import type { Document, Jalon, Mission } from "@/lib/types";
import { cn } from "@/lib/utils";

export type MissionAvecJalons = Mission & {
  jalons: Pick<Jalon, "id" | "titre" | "statut" | "ordre" | "prevu_le">[];
};

export type DocumentEnAttente = Pick<Document, "id" | "mission_id" | "type" | "titre" | "montant" | "echeance_le">;

/**
 * L'accueil de l'espace client, sans la lecture des données (faite par la
 * page) : ce qui permet de le prévisualiser et de le tester avec des données
 * d'exemple.
 *
 * Ordre voulu : d'abord ce qui attend une action du client (un devis à
 * valider, une facture à régler, un message sans réponse), ensuite ses
 * projets. Un client ouvre son espace pour une raison précise ; on la lui
 * met sous les yeux au lieu de le laisser fouiller chaque projet.
 */
export function AccueilClient({
  missions,
  documents,
  messagesNonLus,
}: {
  missions: MissionAvecJalons[];
  documents: DocumentEnAttente[];
  /** Nombre de messages non lus de RGM Dev, par mission. */
  messagesNonLus: Record<string, number>;
}) {
  if (missions.length === 0) {
    return (
      <EtatVide
        titre="Aucun projet pour l'instant"
        texte="Votre espace se remplira dès le lancement de votre premier projet : étapes, devis, factures et échanges seront ici."
        action={
          <Link
            href="/contact"
            className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-[background-color,scale] duration-150 ease-out hover:bg-bleu-700 active:scale-96"
          >
            Démarrer un projet
          </Link>
        }
      />
    );
  }

  const titreMission = new Map(missions.map((m) => [m.id, m.titre]));
  const actions = [
    ...documents.map((doc) => ({
      cle: doc.id,
      href: `/compte/projets/${doc.mission_id}#documents`,
      icone: doc.type === "facture" ? Receipt : FileSignature,
      titre: doc.type === "facture" ? `Facture à régler : ${doc.titre}` : `Devis à valider : ${doc.titre}`,
      detail: [
        doc.montant ? `${euros(doc.montant)} HT` : null,
        doc.echeance_le ? `avant le ${dateLongue(doc.echeance_le)}` : null,
        titreMission.get(doc.mission_id),
      ]
        .filter(Boolean)
        .join(" · "),
    })),
    ...Object.entries(messagesNonLus)
      .filter(([, nombre]) => nombre > 0)
      .map(([missionId, nombre]) => ({
        cle: `msg-${missionId}`,
        href: `/compte/projets/${missionId}#conversation`,
        icone: MessageCircle,
        titre: nombre > 1 ? `${nombre} nouveaux messages de RGM Dev` : "Un nouveau message de RGM Dev",
        detail: titreMission.get(missionId) ?? "",
      })),
  ];

  return (
    <div className="space-y-8">
      <section aria-labelledby="titre-actions">
        <h2 id="titre-actions" className="mb-3 text-sm font-semibold tracking-wide uppercase">
          À faire de votre côté
        </h2>
        {actions.length === 0 ? (
          <p className="flex items-center gap-2.5 rounded-2xl border border-border bg-card px-5 py-4 text-sm">
            <CheckCircle2 className="size-5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
            Rien ne vous attend : tout avance de notre côté.
          </p>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-bleu-200 bg-card dark:border-bleu-800">
            {actions.map(({ cle, href, icone: Icone, titre, detail }) => (
              <li key={cle}>
                <Link
                  href={href}
                  className="group flex items-center gap-4 px-5 py-4 transition-[background-color] duration-150 ease-out hover:bg-secondary/60"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-bleu-50 text-primary dark:bg-bleu-950/50">
                    <Icone className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{titre}</span>
                    {detail && <span className="block text-sm">{detail}</span>}
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0 text-primary transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="titre-projets">
        <h2 id="titre-projets" className="mb-3 text-sm font-semibold tracking-wide uppercase">
          {missions.length > 1 ? "Vos projets" : "Votre projet"}
        </h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {missions.map((mission) => (
            <li key={mission.id}>
              <CarteMission mission={mission} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/**
 * Une carte projet : « où en est-on ? » (l'avancement) et « quelle est la
 * suite ? » (la prochaine étape non terminée).
 */
function CarteMission({ mission }: { mission: MissionAvecJalons }) {
  const statut = STATUT_MISSION[mission.statut];
  const jalons = [...mission.jalons].sort((a, b) => a.ordre - b.ordre);
  const suivant = jalons.find((jalon) => jalon.statut !== "fait");
  const faits = jalons.filter((jalon) => jalon.statut === "fait").length;
  const termine = mission.statut === "livre" || mission.statut === "maintenance";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6",
        "transition-[border-color,translate] duration-200 ease-out",
        "hover:-translate-y-0.5 hover:border-bleu-200 dark:hover:border-bleu-800",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">
          <Link
            href={`/compte/projets/${mission.id}`}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']"
          >
            {mission.titre}
          </Link>
        </h3>
        <Pastille ton={statut.ton}>{statut.libelle}</Pastille>
      </div>

      {mission.description && <p className="mt-2 line-clamp-2 text-sm">{mission.description}</p>}

      <div className="mt-5">
        <div className="flex items-baseline justify-between text-sm">
          <span>Avancement</span>
          <span className="font-semibold tabular-nums">{mission.avancement} %</span>
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuenow={mission.avancement}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Avancement de ${mission.titre}`}
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${mission.avancement}%` }} />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
        <div>
          <dt>Prochaine étape</dt>
          <dd className="mt-0.5 font-medium">
            {suivant ? suivant.titre : termine ? "Projet livré" : jalons.length ? "Tout est terminé" : "À planifier"}
          </dd>
        </div>
        {jalons.length > 0 && (
          <div>
            <dt>Étapes</dt>
            <dd className="mt-0.5 font-medium tabular-nums">
              {faits} / {jalons.length}
            </dd>
          </div>
        )}
        {mission.fin_prevue_le && !termine && (
          <div className="flex items-center gap-1.5 sm:col-span-2">
            <CalendarDays className="size-4" strokeWidth={1.75} aria-hidden="true" />
            Livraison prévue le {dateLongue(mission.fin_prevue_le)}
            {mission.montant ? ` · ${euros(mission.montant)} HT` : ""}
          </div>
        )}
      </dl>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1 text-sm font-medium text-bleu-700 dark:text-bleu-300">
          Ouvrir le projet
          <ArrowRight
            className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>
        {/* Au-dessus du lien qui couvre la carte (z-10) : c'est un second lien. */}
        {mission.url_live && (
          <a
            href={mission.url_live}
            target="_blank"
            rel="noreferrer"
            className="relative z-10 inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-[background-color] duration-150 ease-out hover:bg-secondary"
          >
            Voir mon site
            <ArrowUpRight className="size-3.5" strokeWidth={2} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}
