"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/** Un tour complet en 16 s : assez lent pour qu'on suive les reflets sur les arêtes. */
const DUREE_TOUR = 16;
/** Au-delà de 1,75, la transmission coûte cher pour une différence invisible. */
const PIXEL_RATIO_MAX = 1.75;

/**
 * Le logo RGM en verre, qui tourne au-dessus du pied de page.
 *
 * Three.js pèse lourd : il n'est importé que lorsque le bloc arrive à 400 px de
 * l'écran, et la boucle de rendu s'arrête dès qu'il en sort. Avec
 * `prefers-reduced-motion`, une seule image fixe est rendue, logo de trois
 * quarts, sans rotation ni flottement.
 *
 * Le verre ne se voit que par ce qu'il reflète et ce qu'il laisse passer :
 * d'où le « studio » invisible (bandes blanches en haut, bande cuivrée sur le
 * côté, panneau bleu dessous) qui ne sert qu'à dessiner les arêtes. Le fond
 * est transparent : le logo flotte directement sur la page (le paysage de nuit
 * d'origine a été retiré à la demande de Rafael).
 */
export function SceneLogoVerre({ className }: { className?: string }) {
  const conteneurRef = React.useRef<HTMLDivElement>(null);
  const [pret, setPret] = React.useState(false);

  React.useEffect(() => {
    const conteneur = conteneurRef.current;
    if (!conteneur) return;

    let annule = false;
    let demonter: (() => void) | undefined;

    async function demarrer() {
      if (!conteneur) return;
      let THREE: typeof import("three");
      let SVGLoader: typeof import("three/addons/loaders/SVGLoader.js").SVGLoader;
      try {
        THREE = await import("three");
        ({ SVGLoader } = await import("three/addons/loaders/SVGLoader.js"));
      } catch (erreur) {
        console.warn("[scene-logo-verre] Three.js indisponible", erreur);
        return;
      }
      if (annule || !conteneur.isConnected) return;

      const reduireMouvement = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          premultipliedAlpha: true,
          powerPreference: "high-performance",
        });
      } catch (erreur) {
        console.warn("[scene-logo-verre] WebGL impossible", erreur);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_MAX));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);
      const canvas = renderer.domElement;
      canvas.style.cssText = "display:block;width:100%;height:100%";
      canvas.setAttribute("aria-hidden", "true");
      conteneur.appendChild(canvas);

      // Pas de `scene.background` : le canvas reste transparent.
      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 0, 10);

      // --- Le studio, rendu une fois en carte d'environnement -------------
      // Des plans émissifs autour d'une pièce sombre : seuls leurs reflets
      // compteront. Rien de tout ça n'apparaît à l'image.
      const studio = new THREE.Scene();
      studio.background = new THREE.Color(0x02040a);
      const aJeter: Array<{ dispose: () => void }> = [];
      function bande(couleur: number, intensite: number, l: number, h: number) {
        const geo = new THREE.PlaneGeometry(l, h);
        const mat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(couleur).multiplyScalar(intensite),
          side: THREE.DoubleSide,
        });
        aJeter.push(geo, mat);
        const plan = new THREE.Mesh(geo, mat);
        studio.add(plan);
        return plan;
      }
      // Trois bandes blanches au plafond : les filets nets sur le haut des arêtes.
      for (const x of [-3, 0, 3]) {
        const b = bande(0xffffff, 4, 1.1, 14);
        b.position.set(x, 6, 0);
        b.rotation.x = Math.PI / 2;
      }
      // La bande cuivrée sur le côté droit : un seul reflet chaud qui passe.
      const cuivre = bande(0xd8894a, 2.6, 2.2, 9);
      cuivre.position.set(7, 0.5, 0);
      cuivre.rotation.y = -Math.PI / 2;
      // Une bande blanche plus douce à gauche, pour que l'autre flanc existe.
      const gauche = bande(0xffffff, 1.4, 1.2, 9);
      gauche.position.set(-7, 1, 1);
      gauche.rotation.y = Math.PI / 2;
      // Le panneau bleu sous le logo : il remonte dans les biseaux du bas.
      const bleu = bande(0x2563eb, 2.2, 14, 6);
      bleu.position.set(0, -6, 0);
      bleu.rotation.x = -Math.PI / 2;

      const pmrem = new THREE.PMREMGenerator(renderer);
      const environnement = pmrem.fromScene(studio, 0.03).texture;
      scene.environment = environnement;
      pmrem.dispose();
      for (const objet of aJeter) objet.dispose();

      // --- Le logo, extrudé depuis /logo.svg -----------------------------
      const groupe = new THREE.Group();
      scene.add(groupe);

      // Sur fond transparent, un verre incolore disparaît dans la page blanche.
      // Le verre est donc teinté dans la masse au bleu du site : plus il est
      // épais à un endroit, plus il fonce, ce qui dessine le volume.
      const materiau = new THREE.MeshPhysicalMaterial({
        color: 0x60a5fa,
        transmission: 1,
        roughness: 0,
        metalness: 0,
        thickness: 1.2,
        attenuationColor: new THREE.Color(0x2563eb),
        attenuationDistance: 1.6,
        ior: 1.33,
        clearcoat: 1,
        clearcoatRoughness: 0,
        dispersion: 0.35,
        envMapIntensity: 1.4,
      });

      let geometrie: import("three").ExtrudeGeometry | undefined;
      try {
        const donnees = await new SVGLoader().loadAsync("/logo.svg");
        if (annule) {
          renderer.dispose();
          return;
        }
        const formes = donnees.paths.flatMap((chemin) => SVGLoader.createShapes(chemin));
        // Unités du SVG : chaque chevron fait ~240 de large. Biseau fort et
        // beaucoup de segments pour des bords très arrondis ; le décalage
        // négatif garde le contour d'origine, sinon les six pièces, presque
        // jointives dans le dessin, se souderaient.
        geometrie = new THREE.ExtrudeGeometry(formes, {
          depth: 70,
          bevelEnabled: true,
          bevelThickness: 42,
          bevelSize: 40,
          bevelOffset: -40,
          bevelSegments: 14,
          curveSegments: 8,
        });
        geometrie.center();
        // Le SVG a l'axe Y vers le bas : on le retourne, puis on ramène le logo
        // à environ 2,6 unités de haut.
        geometrie.scale(1, -1, 1);
        geometrie.computeBoundingBox();
        const boite = geometrie.boundingBox!;
        const echelle = 2.6 / (boite.max.y - boite.min.y);
        geometrie.scale(echelle, echelle, echelle);
        geometrie.computeVertexNormals();
        groupe.add(new THREE.Mesh(geometrie, materiau));
      } catch (erreur) {
        console.warn("[scene-logo-verre] Logo introuvable", erreur);
      }

      // --- Taille, rendu, boucle -----------------------------------------
      function redimensionner() {
        const largeur = conteneur!.clientWidth;
        const hauteur = Math.max(conteneur!.clientHeight, 1);
        renderer.setSize(largeur, hauteur, false);
        camera.aspect = largeur / hauteur;
        // Sur téléphone, on recule la caméra pour que le logo ne déborde pas.
        camera.position.z = camera.aspect < 1 ? 10 / Math.max(camera.aspect, 0.55) : 10;
        camera.updateProjectionMatrix();
      }

      function rendre(temps: number) {
        const s = temps / 1000;
        if (reduireMouvement) {
          groupe.rotation.y = -0.55;
          groupe.position.y = 0;
        } else {
          groupe.rotation.y = (s / DUREE_TOUR) * Math.PI * 2;
          groupe.position.y = Math.sin(s * 0.9) * 0.12;
          groupe.rotation.x = Math.sin(s * 0.6) * 0.05;
        }
        renderer.render(scene, camera);
      }

      let visible = false;
      let boucle = false;
      function demarrerBoucle() {
        if (boucle || reduireMouvement) return;
        boucle = true;
        renderer.setAnimationLoop(rendre);
      }
      function arreterBoucle() {
        boucle = false;
        renderer.setAnimationLoop(null);
      }

      redimensionner();
      rendre(0);
      setPret(true);

      const observateurTaille = new ResizeObserver(() => {
        redimensionner();
        if (!boucle) rendre(0);
      });
      observateurTaille.observe(conteneur);

      // Rendu en pause hors écran : rien ne tourne pour personne.
      const observateurVue = new IntersectionObserver(([entree]) => {
        visible = entree.isIntersecting;
        if (visible) demarrerBoucle();
        else arreterBoucle();
      });
      observateurVue.observe(conteneur);

      demonter = () => {
        arreterBoucle();
        observateurVue.disconnect();
        observateurTaille.disconnect();
        geometrie?.dispose();
        materiau.dispose();
        environnement.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        canvas.remove();
      };
    }

    // Three.js n'est chargé qu'à l'approche du bloc.
    const observateurApproche = new IntersectionObserver(
      ([entree]) => {
        if (!entree.isIntersecting) return;
        observateurApproche.disconnect();
        void demarrer();
      },
      { rootMargin: "400px 0px" },
    );
    observateurApproche.observe(conteneur);

    return () => {
      annule = true;
      observateurApproche.disconnect();
      demonter?.();
    };
  }, []);

  return (
    <div
      ref={conteneurRef}
      className={cn(
        "absolute inset-0 transition-opacity duration-700 ease-out",
        pret ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}
