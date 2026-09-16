"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Le maillage : la scène Three.js du hero.
 *
 * Une nappe de points bleus, vue de biais, qui ondule lentement et se creuse
 * sous le curseur. L'idée est de représenter un système qui réagit — c'est ce
 * que vend RGM Dev — sans tomber dans la démonstration technique. Sur fond
 * blanc, ça doit rester un souffle, pas un écran de veille.
 *
 * Ce qui a décidé de l'implémentation :
 *
 * - **Three.js est chargé à la demande**, dans un `useEffect`, et non importé
 *   en tête de fichier. La bibliothèque pèse plus lourd que tout le reste de
 *   la page : la mettre dans le bundle initial retarderait l'affichage du
 *   titre, c'est-à-dire exactement ce que Google chronomètre.
 * - **Le rendu s'arrête** quand la toile sort de l'écran ou que l'onglet passe
 *   en arrière-plan. Une boucle d'animation qui tourne dans le vide vide la
 *   batterie d'un portable.
 * - **`prefers-reduced-motion` donne une image fixe**, pas un canevas vide :
 *   la composition reste, seul le mouvement disparaît.
 * - **Tout est en shader.** Déplacer 8 000 points depuis JavaScript à chaque
 *   image ferait tomber le fil principal ; le GPU le fait sans y penser.
 */
export function ToileMaillage({
  className,
  fixe = false,
}: {
  className?: string;
  /**
   * Fond fixe sur toute la page plutôt que calé dans une section.
   *
   * La toile reste alors accrochée à la fenêtre : le trou central du masque ne
   * bouge pas, le texte reste lisible quel que soit l'endroit où l'on se
   * trouve, et la houle continue de vivre pendant qu'on défile.
   */
  fixe?: boolean;
}) {
  const conteneur = React.useRef<HTMLDivElement>(null);
  const [pret, setPret] = React.useState(false);

  React.useEffect(() => {
    const hote = conteneur.current;
    if (!hote) return;

    let annule = false;
    let demonter: (() => void) | undefined;

    (async () => {
      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch (erreur) {
        // WebGL indisponible ou chargement échoué : le hero garde son halo CSS
        // et reste parfaitement lisible. Ce n'est pas une panne.
        console.warn("[maillage] Three.js n'a pas pu être chargé", erreur);
        return;
      }
      if (annule || !hote.isConnected) return;

      const moinsDeMouvement = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // --- Rendu ------------------------------------------------------------
      let rendu: import("three").WebGLRenderer;
      try {
        rendu = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false, // inutile pour des points, et coûteux
          powerPreference: "low-power",
        });
      } catch (erreur) {
        console.warn("[maillage] WebGL indisponible", erreur);
        return;
      }

      // Au-delà de 1.75 le gain est invisible et le coût double.
      rendu.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      rendu.setSize(hote.clientWidth, hote.clientHeight, false);
      rendu.domElement.style.width = "100%";
      rendu.domElement.style.height = "100%";
      rendu.domElement.style.display = "block";
      hote.appendChild(rendu.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        42,
        hote.clientWidth / Math.max(hote.clientHeight, 1),
        0.1,
        100,
      );
      // Angle rasant. Vue de plus haut, la nappe se lit comme une trame de
      // points réguliers ; c'est l'inclinaison qui lui donne son relief.
      camera.position.set(0, 1.85, 6.2);
      camera.lookAt(0, -0.5, -0.5);

      // --- La nappe de points -----------------------------------------------
      // Moins dense sur petit écran : un téléphone n'a pas la place d'afficher
      // la différence, mais il en paierait le prix en GPU et en batterie.
      const petitEcran = window.innerWidth < 640;
      const COLONNES = petitEcran ? 82 : 132;
      const RANGEES = petitEcran ? 48 : 76;
      const LARGEUR = 17;
      const PROFONDEUR = 11;

      const total = COLONNES * RANGEES;
      const positions = new Float32Array(total * 3);
      const aleas = new Float32Array(total);

      let curseur = 0;
      for (let rangee = 0; rangee < RANGEES; rangee++) {
        for (let colonne = 0; colonne < COLONNES; colonne++) {
          positions[curseur * 3] = (colonne / (COLONNES - 1) - 0.5) * LARGEUR;
          positions[curseur * 3 + 1] = 0;
          positions[curseur * 3 + 2] = (rangee / (RANGEES - 1) - 0.5) * PROFONDEUR;
          // Une pointe d'irrégularité : une grille parfaitement régulière
          // moirera dès qu'elle bouge.
          aleas[curseur] = Math.random();
          curseur++;
        }
      }

      const geometrie = new THREE.BufferGeometry();
      geometrie.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometrie.setAttribute("aAlea", new THREE.BufferAttribute(aleas, 1));

      const couleur = lireCouleur(hote, "--bleu-500", "#3b82f6");
      const couleurLoin = lireCouleur(hote, "--bleu-300", "#93c5fd");

      const uniforms = {
        uTemps: { value: 0 },
        uDefilement: { value: 0 },
        uPointeur: { value: new THREE.Vector2(0, 0) },
        uForcePointeur: { value: 0 },
        uCouleur: { value: new THREE.Color(couleur) },
        uCouleurLoin: { value: new THREE.Color(couleurLoin) },
        uEchelle: { value: rendu.getPixelRatio() },
        uOpacite: { value: 0 },
      };

      const materiau = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        // Additif en clair, ça blanchirait : on reste en mélange normal.
        blending: THREE.NormalBlending,
        vertexShader: /* glsl */ `
          uniform float uTemps;
          uniform float uDefilement;
          uniform vec2  uPointeur;
          uniform float uForcePointeur;
          uniform float uEchelle;

          attribute float aAlea;

          varying float vIntensite;
          varying float vDistance;

          void main() {
            vec3 pos = position;

            // Le défilement fait glisser la nappe vers l'observateur. C'est ce
            // qui relie le fond au geste de lecture : sans ça, une toile fixe
            // sur toute la page donne l'impression d'un papier peint.
            pos.z = mod(pos.z + uDefilement + ${(PROFONDEUR / 2).toFixed(4)}, ${PROFONDEUR.toFixed(4)}) - ${(PROFONDEUR / 2).toFixed(4)};

            // Deux houles croisées de périodes différentes : leur somme ne se
            // répète pas à l'œil, là où une seule sinusoïde se lit tout de suite.
            float houle =
                sin(pos.x * 0.42 + uTemps * 0.55) * 0.52
              + sin(pos.z * 0.62 - uTemps * 0.38) * 0.38
              + sin((pos.x + pos.z) * 0.24 + uTemps * 0.28) * 0.26;

            // Le creux sous le curseur. Amorti par la distance, pour que le
            // relief se résorbe au lieu de s'arrêter net.
            float d = distance(pos.xz, uPointeur);
            float creux = exp(-d * d * 0.16) * uForcePointeur;

            pos.y += houle + creux * 0.85;

            // Les crêtes sont plus denses que les creux : c'est ce qui fait
            // lire la houle comme un relief et non comme un bruit.
            vIntensite = clamp((houle + 1.15) * 0.44 + creux * 0.6, 0.0, 1.0);

            vec4 vuePos = modelViewMatrix * vec4(pos, 1.0);
            vDistance = -vuePos.z;

            // Taille corrigée par la perspective : sans le rapport à la
            // profondeur, les points du fond seraient aussi gros que ceux du
            // premier plan et la nappe perdrait tout relief.
            //
            // Le plafond n'est pas cosmétique : au premier plan, la correction
            // donnait des pastilles de 20 px qui mangeaient le sous-titre. La
            // nappe doit rester un fond.
            float taille = (2.7 + aAlea * 1.5) * uEchelle * (6.2 / vDistance);
            gl_PointSize = clamp(taille, 1.0, 5.6 * uEchelle);
            gl_Position = projectionMatrix * vuePos;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3  uCouleur;
          uniform vec3  uCouleurLoin;
          uniform float uOpacite;

          varying float vIntensite;
          varying float vDistance;

          void main() {
            // Un point carré se voit ; on le taille en disque à bord adouci.
            vec2 centre = gl_PointCoord - vec2(0.5);
            float rayon = dot(centre, centre);
            if (rayon > 0.25) discard;
            float bord = smoothstep(0.25, 0.04, rayon);

            // Le fond s'éclaircit et s'efface : c'est ce qui donne la
            // profondeur, et ce qui garde le titre lisible par-dessus.
            float lointain = smoothstep(5.0, 15.0, vDistance);
            vec3 teinte = mix(uCouleur, uCouleurLoin, lointain);

            // Le tout premier plan s'efface aussi. Sans ça, les points les plus
            // proches sont à la fois les plus gros et les plus opaques : ils
            // passent devant le texte au lieu de rester derrière.
            float proche = 1.0 - smoothstep(3.4, 1.6, vDistance);

            float alpha = bord
                        * (0.30 + vIntensite * 0.62)
                        * (1.0 - lointain * 0.55)
                        * proche
                        * uOpacite;

            gl_FragColor = vec4(teinte, alpha);
          }
        `,
      });

      const nappe = new THREE.Points(geometrie, materiau);
      scene.add(nappe);

      // --- Défilement --------------------------------------------------------
      let cibleDefilement = 0;
      const surDefilement = () => {
        // Une page entière ne vaut qu'une fraction de la profondeur de la
        // nappe : sinon le fond file plus vite que le contenu et donne le
        // tournis.
        cibleDefilement = (window.scrollY / window.innerHeight) * 1.6;
      };

      if (fixe) {
        surDefilement();
        window.addEventListener("scroll", surDefilement, { passive: true });
      }

      // --- Pointeur ----------------------------------------------------------
      const ciblePointeur = new THREE.Vector2(0, 0);
      let cibleForce = 0;

      const surPointeur = (evenement: PointerEvent) => {
        const cadre = hote.getBoundingClientRect();
        const x = (evenement.clientX - cadre.left) / cadre.width - 0.5;
        const y = (evenement.clientY - cadre.top) / cadre.height - 0.5;
        ciblePointeur.set(x * LARGEUR * 0.9, y * PROFONDEUR * 1.3);
        cibleForce = 1;
      };
      const surSortie = () => {
        cibleForce = 0;
      };

      // Seulement sur un vrai pointeur : au doigt, « survoler » n'existe pas et
      // l'effet se déclencherait sur un défilement.
      const finPointeur = window.matchMedia("(hover: hover) and (pointer: fine)");
      if (finPointeur.matches && !moinsDeMouvement) {
        window.addEventListener("pointermove", surPointeur, { passive: true });
        hote.addEventListener("pointerleave", surSortie);
      }

      // --- Redimensionnement --------------------------------------------------
      const observateurTaille = new ResizeObserver(() => {
        const l = hote.clientWidth;
        const h = Math.max(hote.clientHeight, 1);
        rendu.setSize(l, h, false);
        camera.aspect = l / h;
        camera.updateProjectionMatrix();
      });
      observateurTaille.observe(hote);

      // --- Boucle ------------------------------------------------------------
      let image = 0;
      let visible = true;
      let dernier = performance.now();

      const observateurVue = new IntersectionObserver(
        ([entree]) => {
          visible = entree.isIntersecting;
          if (visible && !moinsDeMouvement && image === 0) boucle();
        },
        { threshold: 0 },
      );
      observateurVue.observe(hote);

      const surVisibilite = () => {
        if (document.hidden) {
          cancelAnimationFrame(image);
          image = 0;
        } else if (visible && !moinsDeMouvement) {
          dernier = performance.now();
          boucle();
        }
      };
      document.addEventListener("visibilitychange", surVisibilite);

      function rendre(delta: number) {
        uniforms.uTemps.value += delta;

        // Rattrapage progressif : suivre `scrollY` au pixel près ferait sauter
        // la nappe à chaque cran de molette.
        uniforms.uDefilement.value +=
          (cibleDefilement - uniforms.uDefilement.value) * 0.08;

        // Interpolation douce vers la cible : suivre le curseur au pixel près
        // donne un mouvement sec et artificiel.
        uniforms.uPointeur.value.lerp(ciblePointeur, 0.06);
        uniforms.uForcePointeur.value +=
          (cibleForce - uniforms.uForcePointeur.value) * 0.05;

        // Fondu d'entrée : la première image arrive avec un temps de retard sur
        // le texte, l'apparition brutale se verrait.
        uniforms.uOpacite.value = Math.min(uniforms.uOpacite.value + delta * 1.1, 1);

        rendu.render(scene, camera);
      }

      function boucle() {
        image = requestAnimationFrame(boucle);
        const maintenant = performance.now();
        // Plafonné : revenir sur un onglet endormi ferait sauter la houle de
        // plusieurs secondes d'un coup.
        const delta = Math.min((maintenant - dernier) / 1000, 0.05);
        dernier = maintenant;
        rendre(delta);
      }

      if (moinsDeMouvement) {
        // Une seule image, composition intacte, aucun mouvement.
        uniforms.uTemps.value = 2.4;
        uniforms.uOpacite.value = 1;
        rendu.render(scene, camera);
      } else {
        boucle();
      }

      if (!annule) setPret(true);

      demonter = () => {
        cancelAnimationFrame(image);
        observateurTaille.disconnect();
        observateurVue.disconnect();
        document.removeEventListener("visibilitychange", surVisibilite);
        window.removeEventListener("scroll", surDefilement);
        window.removeEventListener("pointermove", surPointeur);
        hote.removeEventListener("pointerleave", surSortie);
        // Sans ces libérations, une navigation client laisse le contexte WebGL
        // et ses tampons en mémoire — au bout de quelques pages, le navigateur
        // refuse d'en créer de nouveaux.
        geometrie.dispose();
        materiau.dispose();
        rendu.dispose();
        rendu.domElement.remove();
      };
    })();

    return () => {
      annule = true;
      demonter?.();
    };
  }, []);

  return (
    <div
      ref={conteneur}
      aria-hidden="true"
      className={cn(
        "pointer-events-none overflow-hidden",
        // `-z-10` n'est pas un détail : un élément positionné sans z-index
        // passerait DEVANT le texte. En z-index négatif, il se peint au-dessus
        // du fond du `body` mais sous les fonds de section et sous le contenu —
        // exactement la couche voulue.
        fixe ? "fixed inset-0 -z-10" : "absolute inset-0",
        // Le masque creuse le centre de la fenêtre : le texte se lit sur du
        // blanc, les points restent en périphérie. En fond de page, c'est ce
        // qui permet à la nappe d'être partout sans jamais gêner une lecture.
        fixe
          ? "[mask-image:radial-gradient(40%_46%_at_50%_48%,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.35)_40%,black_100%)]"
          : [
              // En section, il faut en plus éteindre le bas : sans ça la nappe
              // se coupait net sur la bande suivante, comme une image tronquée.
              "[mask-image:radial-gradient(52%_74%_at_50%_44%,transparent_0%,transparent_42%,black_92%,black_100%),linear-gradient(to_bottom,black_0%,black_58%,transparent_94%)]",
              "[mask-composite:intersect] [-webkit-mask-composite:source-in]",
            ],
        "transition-opacity duration-700 ease-out",
        pret ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}

/**
 * Lit une variable CSS et la rend exploitable par Three.js.
 *
 * Le thème est défini en OKLCH, que `THREE.Color` ne sait pas interpréter. On
 * laisse donc le navigateur faire la conversion : peindre la couleur sur un
 * élément jetable, puis relire ce que la couche de rendu en a fait — c'est-à-dire
 * une valeur que Three sait lire.
 */
function lireCouleur(hote: HTMLElement, variable: string, secours: string): string {
  try {
    const brut = getComputedStyle(hote).getPropertyValue(variable).trim();
    if (!brut) return secours;

    const sonde = document.createElement("span");
    sonde.style.cssText = `color:${brut};position:absolute;opacity:0;pointer-events:none`;
    hote.appendChild(sonde);
    const resolu = getComputedStyle(sonde).color;
    sonde.remove();

    return resolu.startsWith("rgb") ? resolu : secours;
  } catch {
    return secours;
  }
}
