import Image from "next/image";
import Link from "next/link";
import { Activity, ArrowRight, Bot, LayoutTemplate, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Objet3dService } from "@/components/commun/objet-3d-service";
import { Apparait } from "@/components/commun/apparait";
import { TitreSection } from "@/components/commun/titre-section";
import { listerServices } from "@/lib/donnees";
import { cn } from "@/lib/utils";

/**
 * Les icônes disponibles pour un service.
 *
 * Table explicite plutôt qu'import dynamique : ça garde le tree-shaking
 * efficace, et un nom d'icône saisi de travers dans l'admin retombe sur
 * `Sparkles` au lieu de casser la page.
 */
const ICONES: Record<string, LucideIcon> = {
  "layout-template": LayoutTemplate,
  bot: Bot,
  activity: Activity,
};

export async function Services() {
  const services = await listerServices();

  return (
    <section className="conteneur py-20 sm:py-28">
      <TitreSection
        surtitre="Ce que je fais"
        titre="Deux métiers, une même exigence"
        sousTitre="Construire des choses qui marchent, qui se chargent vite, et que vous pouvez faire évoluer sans moi."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {services.map((service, index) => {
          const Icone = ICONES[service.icone ?? ""] ?? Sparkles;

          return (
            <Apparait
              key={service.id}
              as="article"
              delai={index * 70}
              className={cn(
                // Rayons concentriques : la carte en `rounded-2xl` avec `p-1.5`
                // enveloppe une illustration en `rounded-xl`.
                "group relative flex flex-col rounded-2xl border border-border bg-card p-1.5",
                "transition-[border-color,box-shadow,translate] duration-200 ease-out",
                "hover:-translate-y-0.5 hover:border-bleu-200 dark:hover:border-bleu-800",
                "hover:shadow-[0_1px_2px_oklch(0_0_0/0.04),0_12px_32px_-16px_oklch(0_0_0/0.18)]",
              )}
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-950/95 outline outline-black/10 dark:outline-white/10">
                <Objet3dService slug={service.slug} />
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-xl",
                    "bg-bleu-50 text-bleu-600 dark:bg-bleu-900/40 dark:text-bleu-300",
                    "transition-[background-color,color] duration-200 ease-out",
                    "group-hover:bg-primary group-hover:text-primary-foreground",
                    "relative z-10 -mt-11 ring-4 ring-card",
                  )}
                >
                  <Icone className="size-5.5" strokeWidth={1.75} aria-hidden="true" />
                </span>

                <h3 className="mt-5 text-xl font-semibold">{service.titre}</h3>

                <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
                  {service.accroche}
                </p>

                {service.description && (
                  <p className="mt-3.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                )}

                <Link
                  href={`/services/${service.slug}`}
                  className={cn(
                    "mt-6 inline-flex w-fit items-center gap-1.5 rounded-lg text-sm font-medium",
                    "text-bleu-700 outline-none dark:text-bleu-300",
                    "after:absolute after:inset-0 after:rounded-2xl after:content-['']",
                  )}
                >
                  En savoir plus
                  <ArrowRight
                    className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </Apparait>
          );
        })}
      </div>
    </section>
  );
}
