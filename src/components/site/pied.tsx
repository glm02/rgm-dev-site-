import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

import { Logo } from "./logo";
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
 * Il porte aussi une partie du référencement local : la liste des villes n'est
 * pas du remplissage, c'est la zone d'intervention réelle, reprise telle
 * quelle dans le JSON-LD de l'entreprise.
 */
export function Pied() {
  const annee = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="conteneur-large py-14">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] md:gap-8">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {SITE.promesse}
            </p>

            <div className="mt-5 flex flex-col gap-2.5 text-sm">
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex w-fit items-center gap-2 text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
              >
                <Mail className="size-4" strokeWidth={1.5} />
                {SITE.email}
              </a>
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" strokeWidth={1.5} />
                {SITE.ville}, {SITE.region}
              </span>
              <a
                href={SITE.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
              >
                <MarqueGithub className="size-4" />
                github.com/glm02
              </a>
            </div>
          </div>

          {Object.entries(NAVIGATION_PIED).map(([titre, liens]) => (
            <nav key={titre} aria-label={titre}>
              <h2 className="text-xs font-semibold tracking-wider text-foreground uppercase">
                {titre}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {liens.map((lien) => (
                  <li key={lien.href}>
                    <Link
                      href={lien.href}
                      className="text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
                    >
                      {lien.libelle}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="filet-bleu my-10" />

        <div className="flex flex-col gap-5">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Zone d&apos;intervention</span>{" "}
            — {VILLES.join(", ")} et toute la métropole lyonnaise, dans un rayon de{" "}
            {SITE.rayonKm} km. Le travail à distance est possible partout en France.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              © {annee} {SITE.nom}. Tous droits réservés.
            </p>
            <p className="text-sm text-muted-foreground">
              Ce site est construit avec Next.js, Supabase et Tailwind CSS — et son code
              est le premier exemple de ce que je livre.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
