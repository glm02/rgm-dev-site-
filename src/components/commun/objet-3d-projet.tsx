"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ProjetSlug = "socle" | "atout-travaux" | "campagne-vallauris" | "boreal" | string;

/**
 * Objet 3D interactif pour les réalisations (Three.js WebGL).
 *
 * Évite les captures factices ou génériques : chaque projet possède un modèle
 * 3D vectoriel et interactif qui met en valeur sa complexité technique réelle.
 *
 * Conforme à la charte Emil Kowalski / better-ui :
 * - Chargement dynamique de Three.js (zéro impact sur le First Contentful Paint)
 * - Interpolation douce des mouvements (lerp 0.08)
 * - Respect strict de `prefers-reduced-motion`
 * - Pause automatique hors de l'écran (IntersectionObserver)
 * - Rayons et contrastes calibrés sur le design system RGM Dev
 */
export function Objet3dProjet({
  slug,
  className,
}: {
  slug: ProjetSlug;
  className?: string;
}) {
  const conteneurRef = React.useRef<HTMLDivElement>(null);
  const [pret, setPret] = React.useState(false);

  React.useEffect(() => {
    const conteneur = conteneurRef.current;
    if (!conteneur) return;

    let annule = false;
    let demonter: (() => void) | undefined;

    (async () => {
      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch (erreur) {
        console.warn("[objet-3d-projet] Three.js indisponible", erreur);
        return;
      }
      if (annule || !conteneur.isConnected) return;

      const reduireMouvement = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // 1. Rendu WebGL optimisé
      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch (e) {
        console.warn("[objet-3d-projet] WebGL impossible", e);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(conteneur.clientWidth, conteneur.clientHeight, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      renderer.domElement.style.pointerEvents = "none";
      conteneur.appendChild(renderer.domElement);

      // 2. Scène & Caméra
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        42,
        conteneur.clientWidth / Math.max(conteneur.clientHeight, 1),
        0.1,
        100,
      );
      camera.position.set(0, 0, 7.5);

      // Éclairage studio haute fidélité
      const ambiante = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambiante);

      const spotBleu = new THREE.DirectionalLight(0x2563eb, 3.0);
      spotBleu.position.set(6, 6, 6);
      scene.add(spotBleu);

      const spotCyan = new THREE.DirectionalLight(0x38bdf8, 2.2);
      spotCyan.position.set(-6, -4, 4);
      scene.add(spotCyan);

      const groupePrincipal = new THREE.Group();
      scene.add(groupePrincipal);

      const elementsAnimes: Array<(t: number) => void> = [];

      // -----------------------------------------------------------------------
      // 1. PROJET SOCLE : Cartographie 3D foncier raccordable & data centers 100MW
      // -----------------------------------------------------------------------
      if (slug === "socle") {
        groupePrincipal.rotation.x = 0.85;
        groupePrincipal.rotation.z = -0.3;

        // Grille topographique de fond (territoire et foncier)
        const gridGeom = new THREE.PlaneGeometry(5.4, 5.4, 18, 18);
        const gridEdges = new THREE.EdgesGeometry(gridGeom);
        const gridMat = new THREE.LineBasicMaterial({
          color: 0x2563eb,
          transparent: true,
          opacity: 0.35,
        });
        const gridWire = new THREE.LineSegments(gridEdges, gridMat);
        gridWire.position.z = -0.4;
        groupePrincipal.add(gridWire);

        // Fond sombre contrasté
        const fondMat = new THREE.MeshStandardMaterial({
          color: 0x090d16,
          metalness: 0.9,
          roughness: 0.2,
          transparent: true,
          opacity: 0.85,
        });
        const fondMesh = new THREE.Mesh(gridGeom, fondMat);
        fondMesh.position.z = -0.42;
        groupePrincipal.add(fondMesh);

        // Hubs Data Centers 100MW (tours prismatiques hexagonales)
        const hubs: import("three").Mesh[] = [];
        const hubGeom = new THREE.CylinderGeometry(0.24, 0.28, 0.7, 6);
        const hubMat = new THREE.MeshStandardMaterial({
          color: 0x1d4ed8,
          emissive: 0x2563eb,
          emissiveIntensity: 0.6,
          metalness: 0.7,
          roughness: 0.3,
        });

        const positionsHubs = [
          [-1.5, 1.2, 0],
          [0.8, 1.5, 0],
          [-0.4, 0.1, 0],
          [1.4, -0.8, 0],
          [-1.2, -1.3, 0],
          [0.2, -1.6, 0],
        ];

        positionsHubs.forEach(([x, y]) => {
          const hub = new THREE.Mesh(hubGeom, hubMat);
          hub.position.set(x, y, 0);
          hub.rotation.x = Math.PI / 2;
          groupePrincipal.add(hub);
          hubs.push(hub);

          // Anneau de portée / raccordement électrique 225 kV
          const anneauGeom = new THREE.RingGeometry(0.38, 0.42, 24);
          const anneauMat = new THREE.MeshBasicMaterial({
            color: 0x60a5fa,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.45,
          });
          const anneau = new THREE.Mesh(anneauGeom, anneauMat);
          anneau.position.set(x, y, 0.05);
          groupePrincipal.add(anneau);
        });

        // Lignes du réseau haute tension (interconnexions électriques)
        const ligneMat = new THREE.LineBasicMaterial({
          color: 0x93c5fd,
          transparent: true,
          opacity: 0.75,
        });

        const connexions = [
          [0, 2], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [0, 4]
        ];

        const geometriesLignes: import("three").BufferGeometry[] = [];

        connexions.forEach(([i1, i2]) => {
          const p1 = new THREE.Vector3(positionsHubs[i1][0], positionsHubs[i1][1], 0.35);
          const p2 = new THREE.Vector3(positionsHubs[i2][0], positionsHubs[i2][1], 0.35);
          const lineGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
          geometriesLignes.push(lineGeom);
          const line = new THREE.Line(lineGeom, ligneMat);
          groupePrincipal.add(line);
        });

        // Paquet d'impulsion énergétique qui voyage
        const pulseGeom = new THREE.SphereGeometry(0.08, 12, 12);
        const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const pulse1 = new THREE.Mesh(pulseGeom, pulseMat);
        const pulse2 = new THREE.Mesh(pulseGeom, pulseMat);
        groupePrincipal.add(pulse1, pulse2);

        elementsAnimes.push((t) => {
          // Respiration des tours data centers
          hubs.forEach((hub, idx) => {
            const h = 0.7 + Math.sin(t * 2.5 + idx) * 0.15;
            hub.scale.set(1, h, 1);
          });

          // Déplacement des paquets de données/mégawatts le long des lignes
          const ratio1 = (t * 0.6) % 1;
          const pStart1 = new THREE.Vector3(positionsHubs[0][0], positionsHubs[0][1], 0.35);
          const pEnd1 = new THREE.Vector3(positionsHubs[2][0], positionsHubs[2][1], 0.35);
          pulse1.position.lerpVectors(pStart1, pEnd1, ratio1);

          const ratio2 = (t * 0.75 + 0.5) % 1;
          const pStart2 = new THREE.Vector3(positionsHubs[2][0], positionsHubs[2][1], 0.35);
          const pEnd2 = new THREE.Vector3(positionsHubs[3][0], positionsHubs[3][1], 0.35);
          pulse2.position.lerpVectors(pStart2, pEnd2, ratio2);
        });
      }

      // -----------------------------------------------------------------------
      // 2. PROJET ATOUT TRAVAUX : Circuit thermique & tuyauterie isométrique
      // -----------------------------------------------------------------------
      else if (slug === "atout-travaux") {
        groupePrincipal.rotation.x = 0.45;
        groupePrincipal.rotation.y = -0.65;

        const tuyauMatAcier = new THREE.MeshStandardMaterial({
          color: 0x334155,
          metalness: 0.85,
          roughness: 0.25,
        });

        const tuyauMatCuivre = new THREE.MeshStandardMaterial({
          color: 0xd97706,
          metalness: 0.9,
          roughness: 0.2,
          emissive: 0xb45309,
          emissiveIntensity: 0.2,
        });

        // Collecteur thermique principal (manifold)
        const tubeGeom1 = new THREE.CylinderGeometry(0.18, 0.18, 4.2, 24);
        const tube1 = new THREE.Mesh(tubeGeom1, tuyauMatAcier);
        tube1.position.set(0, 0, 0);
        groupePrincipal.add(tube1);

        // Départs verticaux de circuits (chauffage / ramonage / plomberie)
        const departs: import("three").Mesh[] = [];
        const departGeom = new THREE.CylinderGeometry(0.1, 0.1, 1.4, 20);

        [-1.3, -0.4, 0.5, 1.4].forEach((pos, idx) => {
          const mat = idx % 2 === 0 ? tuyauMatCuivre : tuyauMatAcier;
          const depart = new THREE.Mesh(departGeom, mat);
          depart.rotation.z = Math.PI / 2;
          depart.position.set(pos, 0.7, 0);
          groupePrincipal.add(depart);
          departs.push(depart);

          // Vanne / Molette de régulation
          const vanneGeom = new THREE.TorusGeometry(0.2, 0.04, 12, 24);
          const vanneMat = new THREE.MeshStandardMaterial({
            color: idx % 2 === 0 ? 0xef4444 : 0x2563eb,
            metalness: 0.7,
            roughness: 0.3,
          });
          const vanne = new THREE.Mesh(vanneGeom, vanneMat);
          vanne.position.set(pos, 1.4, 0);
          vanne.rotation.x = Math.PI / 2;
          groupePrincipal.add(vanne);
        });

        // Manomètre de pression central
        const cadranGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 32);
        const cadranMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6 });
        const cadran = new THREE.Mesh(cadranGeom, cadranMat);
        cadran.position.set(0, -0.8, 0.15);
        cadran.rotation.x = Math.PI / 2;

        const aiguilleGeom = new THREE.BoxGeometry(0.04, 0.28, 0.02);
        const aiguilleMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const aiguille = new THREE.Mesh(aiguilleGeom, aiguilleMat);
        aiguille.position.set(0, 0.1, 0.06);
        cadran.add(aiguille);
        groupePrincipal.add(cadran);

        // Anneaux de serrage / raccords
        const raccordGeom = new THREE.TorusGeometry(0.22, 0.05, 16, 24);
        const raccordMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
        [-1.8, -0.9, 0, 0.9, 1.8].forEach((x) => {
          const raccord = new THREE.Mesh(raccordGeom, raccordMat);
          raccord.position.set(x, 0, 0);
          raccord.rotation.y = Math.PI / 2;
          groupePrincipal.add(raccord);
        });

        elementsAnimes.push((t) => {
          // Aiguille manomètre qui oscille naturellement
          aiguille.rotation.z = Math.sin(t * 3) * 0.4 + 0.2;
        });
      }

      // -----------------------------------------------------------------------
      // 3. PROJET CAMPAGNE VALLAURIS : Architecture contemporaine & mas provençal
      // -----------------------------------------------------------------------
      else if (slug === "campagne-vallauris") {
        groupePrincipal.rotation.x = 0.55;
        groupePrincipal.rotation.y = -0.5;

        // Socle topographique terrasse
        const terrasseGeom = new THREE.BoxGeometry(4.2, 3.2, 0.15);
        const terrasseMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          metalness: 0.5,
          roughness: 0.5,
        });
        const terrasse = new THREE.Mesh(terrasseGeom, terrasseMat);
        terrasse.position.set(0, 0, -0.1);
        groupePrincipal.add(terrasse);

        // Arêtes du mas
        const masGeom = new THREE.BoxGeometry(2.4, 1.6, 1.2);
        const masEdges = new THREE.EdgesGeometry(masGeom);
        const masWire = new THREE.LineSegments(
          masEdges,
          new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
        );
        masWire.position.set(-0.5, 0.2, 0.6);
        groupePrincipal.add(masWire);

        // Toit à double pan
        const toitGeom = new THREE.ConeGeometry(1.6, 0.7, 4);
        const toitEdges = new THREE.EdgesGeometry(toitGeom);
        const toitWire = new THREE.LineSegments(
          toitEdges,
          new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.9 })
        );
        toitWire.rotation.y = Math.PI / 4;
        toitWire.position.set(-0.5, 0.2, 1.55);
        groupePrincipal.add(toitWire);

        // Verrière / Baie vitrée ouverte vers la nature
        const baieGeom = new THREE.PlaneGeometry(1.8, 0.8);
        const baieMat = new THREE.MeshStandardMaterial({
          color: 0x2563eb,
          transparent: true,
          opacity: 0.6,
          metalness: 0.9,
          roughness: 0.1,
        });
        const baie = new THREE.Mesh(baieGeom, baieMat);
        baie.position.set(-0.5, -0.61, 0.6);
        groupePrincipal.add(baie);

        // Orbite solaire dorée (lumière de Provence)
        const soleilGeom = new THREE.SphereGeometry(0.2, 16, 16);
        const soleilMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
        const soleil = new THREE.Mesh(soleilGeom, soleilMat);
        groupePrincipal.add(soleil);

        const anneauSolaireGeom = new THREE.TorusGeometry(2.5, 0.015, 16, 64);
        const anneauSolaireMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.35,
        });
        const anneauSolaire = new THREE.Mesh(anneauSolaireGeom, anneauSolaireMat);
        anneauSolaire.rotation.x = Math.PI / 3;
        groupePrincipal.add(anneauSolaire);

        elementsAnimes.push((t) => {
          // Course du soleil provençal
          const angle = t * 0.8;
          soleil.position.set(Math.cos(angle) * 2.5, Math.sin(angle) * 2.5 * 0.5, Math.sin(angle) * 1.8);
        });
      }

      // -----------------------------------------------------------------------
      // 4. AUTRES PROJETS / BORÉAL : Prisme événementiel & aurore boréale
      // -----------------------------------------------------------------------
      else {
        // Icosaèdre prismatique aux reflets boréaux
        const prismeGeom = new THREE.IcosahedronGeometry(1.5, 1);
        const prismeEdges = new THREE.EdgesGeometry(prismeGeom);
        const prismeWire = new THREE.LineSegments(
          prismeEdges,
          new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
        );
        groupePrincipal.add(prismeWire);

        const prismeCoeurGeom = new THREE.IcosahedronGeometry(0.9, 0);
        const prismeCoeurMat = new THREE.MeshStandardMaterial({
          color: 0x1d4ed8,
          emissive: 0x2563eb,
          emissiveIntensity: 0.7,
          metalness: 0.9,
          roughness: 0.1,
        });
        const prismeCoeur = new THREE.Mesh(prismeCoeurGeom, prismeCoeurMat);
        groupePrincipal.add(prismeCoeur);

        // Ruban de lumière ondulant (aurore)
        const rubanGeom = new THREE.TorusGeometry(2.2, 0.06, 16, 80, Math.PI * 1.6);
        const rubanMat = new THREE.MeshStandardMaterial({
          color: 0x60a5fa,
          emissive: 0x38bdf8,
          emissiveIntensity: 0.6,
        });
        const ruban = new THREE.Mesh(rubanGeom, rubanMat);
        ruban.rotation.x = Math.PI / 3;
        groupePrincipal.add(ruban);

        elementsAnimes.push((t) => {
          prismeWire.rotation.y = t * 0.3;
          prismeCoeur.rotation.x = -t * 0.4;
          ruban.rotation.z = t * 0.5;
        });
      }

      // 3. Suivi interactif du curseur (parallaxe douce)
      let curseurCibleX = 0;
      let curseurCibleY = 0;
      let curseurActuelX = 0;
      let curseurActuelY = 0;

      const surMouvementCurseur = (event: MouseEvent) => {
        const rect = conteneur.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        curseurCibleX = x * 0.75;
        curseurCibleY = y * 0.75;
      };

      const parentCarte = conteneur.closest("article") ?? conteneur;
      parentCarte.addEventListener("mousemove", surMouvementCurseur as EventListener, { passive: true });

      const surQuitteCurseur = () => {
        curseurCibleX = 0;
        curseurCibleY = 0;
      };
      parentCarte.addEventListener("mouseleave", surQuitteCurseur, { passive: true });

      // 4. Redimensionnement
      const surRedim = () => {
        if (!conteneur) return;
        const w = conteneur.clientWidth;
        const h = conteneur.clientHeight;
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      window.addEventListener("resize", surRedim, { passive: true });

      // 5. IntersectionObserver (économie batterie/GPU)
      let visible = true;
      const observateur = new IntersectionObserver(
        (entrees) => {
          visible = Boolean(entrees[0]?.isIntersecting);
        },
        { threshold: 0.1 }
      );
      observateur.observe(conteneur);

      let idAnim: number;
      const horloge = new THREE.Clock();

      const animer = () => {
        idAnim = requestAnimationFrame(animer);
        if (!visible) return;

        const delta = horloge.getElapsedTime();

        // Parallaxe douce
        curseurActuelX += (curseurCibleX - curseurActuelX) * 0.08;
        curseurActuelY += (curseurCibleY - curseurActuelY) * 0.08;

        if (!reduireMouvement) {
          groupePrincipal.rotation.y += (curseurActuelX * 1.6 - groupePrincipal.rotation.y * 0.1) * 0.04;
          groupePrincipal.rotation.x += (curseurActuelY * 1.6 - groupePrincipal.rotation.x * 0.1) * 0.04;

          // Rotation de fond
          groupePrincipal.rotation.y += 0.0025;

          // Animations spécifiques
          for (const anim of elementsAnimes) {
            anim(delta);
          }
        }

        renderer.render(scene, camera);
      };

      animer();
      setPret(true);

      demonter = () => {
        cancelAnimationFrame(idAnim);
        observateur.disconnect();
        window.removeEventListener("resize", surRedim);
        parentCarte.removeEventListener("mousemove", surMouvementCurseur as EventListener);
        parentCarte.removeEventListener("mouseleave", surQuitteCurseur);
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    })();

    return () => {
      annule = true;
      demonter?.();
    };
  }, [slug]);

  return (
    <div
      ref={conteneurRef}
      className={cn("relative size-full overflow-hidden select-none bg-slate-950/95", className)}
      aria-hidden="true"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 -z-10",
          "bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.22_255/0.22)_0%,transparent_72%)]",
          "transition-opacity duration-700",
          pret ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
