import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, Euro, Timer } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { CarteAvis } from "@/components/commun/carte-avis";
import { FilAriane } from "@/components/commun/fil-ariane";
import { JsonLd } from "@/components/commun/json-ld";
import { AppelAction } from "@/components/sections/appel-action";
import { listerAvis, listerProjets, projetParSlug } from "@/lib/donnees";
import { duree, fourchetteProjet } from "@/lib/format";
import { jsonLdFilAriane, jsonLdProjet, metadonnees } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const projets = await listerProjets();
  return projets.map((projet) => ({ slug: projet.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/realisations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const projet = await projetParSlug(slug);

  if (!projet) {
    return metadonnees({
      titre: "Projet introuvable",
      description: "",
      chemin: `/realisations/${slug}`,
      horsIndex: true,
    });
  }

  return metadonnees({
    titre: projet.seo_titre ?? `${projet.titre} — étude de cas`,
    description: projet.seo_description ?? projet.resume,
    chemin: `/realisations/${projet.slug}`,
    image: projet.image_couverture,
  });
}

export default async function PageProjet({ params }: PageProps<"/realisations/[slug]">) {
  const { slug } = await params;
  const projet = await projetParSlug(slug);

  if (!projet) notFound();

  const avis = await listerAvis({ projetId: projet.id });

  const etapes = [
    { nom: "Accueil", href: "/" },
    { nom: "Réalisations", href: "/realisations" },
    { nom: projet.titre, href: `/realisations/${projet.slug}` },
  ];

  const prix = fourchetteProjet(projet.prix_min, projet.prix_max);
  const dureeTexte = duree(projet.duree_jours);

  const recits = [
    { titre: "Le problème", texte: projet.probleme },
    { titre: "Ce que j'ai construit", texte: projet.solution },
    { titre: "Le résultat", texte: projet.resultat },
  ].filter((bloc): bloc is { titre: string; texte: string } => Boolean(bloc.texte));

  return (
    <>
      <JsonLd donnees={jsonLdProjet(projet, avis)} />
      <JsonLd donnees={jsonLdFilAriane(etapes)} />

      <article>
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="halo-bleu pointer-events-none absolute inset-x-0 top-0 h-96"
          />

          <div className="conteneur relative pt-8 pb-14">
            <FilAriane etapes={etapes} />

            <div className="mt-8 max-w-3xl">
              {projet.secteur && (
                <p className="text-sm font-semibold tracking-wider text-bleu-600 uppercase dark:text-bleu-400">
                  {projet.secteur}
                </p>
              )}

              <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{projet.titre}</h1>

              <p className="mt-5 text-xl leading-relaxed text-balance text-muted-foreground">
                {projet.resume}
              </p>

              {projet.url_live && (
                <a
                  href={projet.url_live}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "group mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5",
                    "text-sm font-medium text-primary-foreground",
                    "transition-[background-color,scale] duration-150 ease-out",
                    "hover:bg-bleu-700 active:scale-96 dark:hover:bg-bleu-400",
                  )}
                >
                  Voir le site en ligne
                  <ArrowUpRight
                    className="size-4 transition-[translate] duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </a>
              )}
            </div>

            {/* La fiche d'identité du projet. Le budget y figure : c'est la
                promesse du site, et la masquer ici la viderait de son sens. */}
            <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
              <Donnee
                icone={Euro}
                libelle="Budget"
                valeur={prix ?? "Projet interne"}
              />
              <Donnee
                icone={Timer}
                libelle="Durée"
                valeur={dureeTexte ?? "—"}
              />
              <Donnee
                icone={CalendarDays}
                libelle="Technologies"
                valeur={`${projet.stack.length} briques`}
              />
            </dl>
          </div>
        </section>

        <section className="conteneur pb-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-12">
              {recits.map((bloc, index) => (
                <Apparait key={bloc.titre} delai={index * 60}>
                  <h2 className="text-2xl font-semibold sm:text-3xl">{bloc.titre}</h2>
                  <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
                    {bloc.texte}
                  </p>
                </Apparait>
              ))}

              {recits.length === 0 && (
                <p className="text-muted-foreground">
                  L&apos;étude de cas détaillée de ce projet est en cours de rédaction.
                </p>
              )}
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-sm font-semibold tracking-wider uppercase">
                  Stack technique
                </h2>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {projet.stack.map((techno) => (
                    <li
                      key={techno}
                      className="rounded-md bg-secondary px-2.5 py-1.5 text-xs font-medium text-secondary-foreground"
                    >
                      {techno}
                    </li>
                  ))}
                </ul>

                {projet.client_nom && (
                  <>
                    <h2 className="mt-7 text-sm font-semibold tracking-wider uppercase">
                      Client
                    </h2>
                    <p className="mt-2.5 text-sm text-muted-foreground">
                      {projet.client_nom}
                    </p>
                  </>
                )}

                <Link
                  href="/contact"
                  className={cn(
                    "mt-7 inline-flex h-11 w-full items-center justify-center rounded-xl",
                    "border border-border bg-background text-sm font-medium",
                    "transition-[background-color,scale] duration-150 ease-out",
                    "hover:bg-secondary active:scale-96",
                  )}
                >
                  Un projet similaire ?
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {avis.length > 0 && (
          <section className="conteneur py-16">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Ce qu&apos;en dit le client
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {avis.map((un, index) => (
                <Apparait key={un.id} delai={index * 70} className="h-full">
                  <CarteAvis avis={un} />
                </Apparait>
              ))}
            </div>
          </section>
        )}
      </article>

      <AppelAction />
    </>
  );
}

function Donnee({
  icone: Icone,
  libelle,
  valeur,
}: {
  icone: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  libelle: string;
  valeur: string;
}) {
  return (
    <div className="bg-card p-5">
      <dt className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icone className="size-4" strokeWidth={1.75} />
        {libelle}
      </dt>
      <dd className="mt-1.5 text-lg font-semibold tabular-nums">{valeur}</dd>
    </div>
  );
}
