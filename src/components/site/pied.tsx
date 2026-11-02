import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

import { Logo } from "./logo";
import { SceneLogoVerre } from "./scene-logo-verre";
import { NAVIGATION_PIED, SITE, VILLES } from "@/lib/site";

/**
 * La marque GitHub, en SVG inline.
 *
 * Lucide a retiré les logos de marques de la version 1 : les garder l'exposait
 * à des questions de droit d'usage. On le dessine donc nous-mêmes, en
 * `currentColor` pour qu'il suive le thème comme les autres icônes.
 */
function MarqueGithub({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.24-.02-2.25-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.92 1.23 3.23 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

/**
 * Le pied de page.
 *
 * En haut, la scène du logo en verre au-dessus d'un paysage de nuit. Le haut
 * du bloc part de la couleur de la page (blanc en clair, noir en sombre) pour
 * que la section précédente se fonde dans le ciel ; le bas finit en noir pour
 * enchaîner sur les liens.
 *
 * Il porte aussi une partie du référencement local : la liste des villes n'est
 * pas du remplissage, c'est la zone d'intervention réelle, reprise telle
 * quelle dans le JSON-LD de l'entreprise. Tous les liens restent, regroupés en
 * deux colonnes.
 */
export function Pied() {
  const annee = new Date().getFullYear();
  const groupes = Object.entries(NAVIGATION_PIED);
  const colonnes = [groupes.slice(0, 2), groupes.slice(2)];

  return (
    <footer className="relative mt-24 bg-black text-white">
      <div className="relative h-[460px] overflow-hidden sm:h-[600px]">
        <SceneLogoVerre />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-background to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-black"
        />
      </div>

      <div className="conteneur-large pt-6 pb-12">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div className="flex max-w-sm flex-col items-start">
            <Logo className="[&>span:last-child]:text-white" />
            <a
              href={`mailto:${SITE.email}`}
              className="mt-6 inline-flex w-fit items-center gap-2 text-lg font-medium text-white underline-offset-4 hover:underline"
            >
              <Mail className="size-5" strokeWidth={1.5} aria-hidden="true" />
              {SITE.email}
            </a>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-white">
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4" strokeWidth={1.5} aria-hidden="true" />
                {SITE.ville}, {SITE.region}
              </span>
              <a
                href={SITE.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 underline-offset-4 hover:underline"
              >
                <MarqueGithub className="size-4" />
                github.com/glm02
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10">
            {colonnes.map((colonne, index) => (
              <div key={index} className="flex flex-col gap-10">
                {colonne.map(([titre, liens]) => (
                  <nav key={titre} aria-label={titre}>
                    <h2 className="text-xs font-semibold tracking-wider text-bleu-300 uppercase">
                      {titre}
                    </h2>
                    <ul className="mt-4 space-y-2.5">
                      {liens.map((lien) => (
                        <li key={lien.href}>
                          <Link
                            href={lien.href}
                            className="text-sm text-white underline-offset-4 transition-colors duration-150 ease-out hover:text-bleu-300"
                          >
                            {lien.libelle}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="my-10 h-px bg-white/15" />

        <div className="flex flex-col gap-5 text-sm text-white">
          <p>
            <span className="font-semibold">Zone d&apos;intervention</span> —{" "}
            {VILLES.join(", ")} et toute la métropole lyonnaise, dans un rayon de{" "}
            {SITE.rayonKm} km. Travail à distance possible partout en France.
          </p>
          <p>
            © {annee} {SITE.nom}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
