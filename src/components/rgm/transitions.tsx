"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CIBLES = 'section h2, section [class~="rounded-[16px]"], section a.group, [data-revele]';

// Au premier chargement, le HTML serveur est déjà affiché : l'animer le ferait clignoter.
let premierChargement = true;

/**
 * Transitions globales du site : fondu du contenu à chaque changement de page
 * et apparition en cascade des titres et cartes situés sous la ligne de flottaison.
 */
export function Transitions({ children }: { children: React.ReactNode }) {
  const racine = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const navigationInterne = !premierChargement;
      premierChargement = false;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const conteneur = racine.current;
        if (!conteneur) return;

        if (navigationInterne) {
          gsap.from(conteneur, { autoAlpha: 0, y: 8, duration: 0.25, ease: "power1.out", clearProps: "all" });
        }

        const toutes = gsap.utils.toArray<HTMLElement>(CIBLES, conteneur);
        // Seuls les éléments sous l'écran à l'arrivée s'animent ; une carte dans une carte suit son parent.
        const cibles = toutes.filter(
          (el) => el.getBoundingClientRect().top > window.innerHeight && !toutes.some((autre) => autre !== el && autre.contains(el)),
        );
        if (!cibles.length) return;

        gsap.set(cibles, { autoAlpha: 0, y: 24 });
        ScrollTrigger.batch(cibles, {
          start: "top 88%",
          once: true,
          interval: 0.08,
          onEnter: (lot) =>
            gsap.to(lot, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.07, overwrite: true, clearProps: "transform,opacity,visibility" }),
        });
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      });
    },
    { scope: racine },
  );

  return <div ref={racine}>{children}</div>;
}
