import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { listerProjets } from "@/lib/donnees";
import { cn } from "@/lib/utils";

/**
 * « Ils m'ont confié leur site » : la liste des vrais clients, juste sous le
 * hero.
 *
 * Elle répond à la première objection d'un visiteur (« est-ce que d'autres
 * l'ont déjà fait travailler ? ») avant même qu'il lise les services. Chaque
 * nom mène à sa fiche réalisation : c'est aussi du maillage interne, utile au
 * référencement.
 *
 * Alimentée par la table `projets` : un client ajouté et publié dans l'admin
 * apparaît ici tout seul. Les projets internes (sans client) sont écartés,
 * pour ne présenter comme client que quelqu'un qui l'est.
 *
 * Une grille fixe et non un défilé automatique : on lit les noms, on ne les
 * regarde pas passer.
 */
export async function Clients() {
  const projets = (await listerProjets()).filter(
    (projet) => projet.client_nom && !/interne/i.test(projet.client_nom),
  );

  if (projets.length === 0) return null;

  return (
    <section aria-labelledby="titre-clients" className="py-14 sm:py-18">
      <div className="conteneur">
        <Apparait>
          <h2 id="titre-clients" className="text-center text-sm font-semibold tracking-wide uppercase">
            Ils m&apos;ont confié leur site
          </h2>
        </Apparait>

        <ul
          className={cn(
            "mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border",
            "sm:grid-cols-2",
            projets.length >= 4 ? "lg:grid-cols-4" : projets.length === 3 ? "lg:grid-cols-3" : "",
          )}
        >
          {projets.map((projet, index) => (
            <li key={projet.id} className="bg-background">
              <Apparait delai={index * 60} className="h-full">
                <Link
                  href={`/realisations/${projet.slug}`}
                  className={cn(
                    "group flex h-full flex-col justify-between gap-3 p-6",
                    "transition-[background-color] duration-150 ease-out hover:bg-secondary/60",
                    "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:ring-inset",
                  )}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-lg font-semibold">{projet.client_nom}</span>
                    <ArrowUpRight
                      className="size-4.5 shrink-0 text-primary transition-[translate] duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </span>
                  {projet.secteur && <span className="text-sm">{projet.secteur}</span>}
                </Link>
              </Apparait>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
