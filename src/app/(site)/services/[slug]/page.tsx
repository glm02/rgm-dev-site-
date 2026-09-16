import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { CarteOffre } from "@/components/commun/carte-offre";
import { FilAriane } from "@/components/commun/fil-ariane";
import { JsonLd } from "@/components/commun/json-ld";
import { AppelAction } from "@/components/sections/appel-action";
import { listerOffres, listerServices, serviceParSlug } from "@/lib/donnees";
import { jsonLdFilAriane, jsonLdService, metadonnees } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * Les pages service sont les cibles des campagnes Google Ads : elles doivent
 * exister à l'avance en statique, pas être rendues à la demande. D'où la
 * génération des chemins au build.
 */
export async function generateStaticParams() {
  const services = await listerServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await serviceParSlug(slug);

  if (!service) return metadonnees({ titre: "Service introuvable", description: "", chemin: `/services/${slug}`, horsIndex: true });

  return metadonnees({
    titre: service.seo_titre ?? service.titre,
    description: service.seo_description ?? service.accroche,
    chemin: `/services/${service.slug}`,
  });
}

export default async function PageService({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await serviceParSlug(slug);

  if (!service) notFound();

  const toutesLesOffres = await listerOffres();
  const offres = toutesLesOffres.filter((offre) => offre.service_id === service.id);

  const etapes = [
    { nom: "Accueil", href: "/" },
    { nom: "Services", href: "/services" },
    { nom: service.titre, href: `/services/${service.slug}` },
  ];

  return (
    <>
      <JsonLd donnees={jsonLdService(service, offres)} />
      <JsonLd donnees={jsonLdFilAriane(etapes)} />

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="halo-bleu pointer-events-none absolute inset-x-0 top-0 h-96"
        />

        <div className="conteneur relative pt-8 pb-16 sm:pb-20">
          <FilAriane etapes={etapes} />

          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl font-semibold sm:text-5xl">{service.titre}</h1>

            <p className="mt-5 text-xl leading-relaxed text-balance text-muted-foreground">
              {service.accroche}
            </p>

            {service.description && (
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            )}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/contact?service=${encodeURIComponent(service.titre)}`}
                className={cn(
                  "group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6",
                  "text-[15px] font-medium text-primary-foreground",
                  "shadow-[0_1px_2px_oklch(0_0_0/0.10),0_10px_30px_-12px_var(--bleu-600)]",
                  "transition-[background-color,scale] duration-150 ease-out",
                  "hover:bg-bleu-700 active:scale-96 dark:hover:bg-bleu-400",
                )}
              >
                Demander un devis
                <ArrowRight
                  className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/realisations"
                className={cn(
                  "inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-6",
                  "text-[15px] font-medium",
                  "transition-[background-color,scale] duration-150 ease-out",
                  "hover:bg-secondary active:scale-96",
                )}
              >
                Voir des exemples
              </Link>
            </div>
          </div>
        </div>
      </section>

      {offres.length > 0 && (
        <section className="border-y border-border bg-secondary/30 py-20 sm:py-24">
          <div className="conteneur">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Les formules {service.titre.toLowerCase()}
              </h2>
              <p className="mt-4 text-lg text-balance text-muted-foreground">
                Prix HT indicatifs. Le devis devient ferme une fois le périmètre écrit.
              </p>
            </div>

            <div
              className={cn(
                "mt-16 grid gap-5",
                offres.length === 1 && "mx-auto max-w-md",
                offres.length === 2 && "mx-auto max-w-3xl md:grid-cols-2",
                offres.length >= 3 && "md:grid-cols-3",
              )}
            >
              {offres.map((offre, index) => (
                <Apparait key={offre.id} delai={index * 70} className="h-full">
                  <CarteOffre offre={offre} />
                </Apparait>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="conteneur py-20 sm:py-24">
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
          <Apparait>
            <h2 className="text-2xl font-semibold">Ce qui est toujours compris</h2>
            <ul className="mt-6 space-y-3.5">
              {[
                "Un interlocuteur unique, du premier appel à la mise en ligne",
                "Le code vous appartient, sur votre dépôt",
                "Rendu serveur et temps de chargement mesurés",
                "Accessible au clavier et sur mobile",
                "Aucun abonnement obligatoire à un outil tiers",
              ].map((ligne) => (
                <li key={ligne} className="flex gap-2.5 text-[15px]">
                  <Check
                    className="mt-1 size-4 shrink-0 text-bleu-600 dark:text-bleu-400"
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />
                  <span className="leading-relaxed">{ligne}</span>
                </li>
              ))}
            </ul>
          </Apparait>

          <Apparait delai={70}>
            <h2 className="text-2xl font-semibold">Ce que je ne fais pas</h2>
            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
              Je ne prends pas de projet dont je ne suis pas certain de pouvoir tenir le
              délai, je ne facture pas une refonte quand une correction suffit, et je ne
              vends pas d&apos;IA là où une règle de trois ferait l&apos;affaire.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Si votre besoin sort de mon périmètre, je vous le dis au premier appel et,
              quand je le peux, je vous oriente vers quelqu&apos;un de mieux placé.
            </p>
          </Apparait>
        </div>
      </section>

      <AppelAction />
    </>
  );
}
