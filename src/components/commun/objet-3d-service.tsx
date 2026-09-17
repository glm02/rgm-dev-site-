"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ServiceSlug = "sites-web" | "automatisation-ia" | "maintenance-supervision" | string;

export function Objet3dService({
  slug,
  className,
}: {
  slug: ServiceSlug;
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
        console.warn("[objet-3d] Three.js indisponible", erreur);
        return;
      }
      if (annule || !conteneur.isConnected) return;

      const reduireMouvement = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // 1. Moteur de rendu WebGL
      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch (e) {
        console.warn("[objet-3d] WebGL impossible", e);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(conteneur.clientWidth, conteneur.clientHeight, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      renderer.domElement.style.pointerEvents = "none"; // Laisse les clics passer au lien parent
      conteneur.appendChild(renderer.domElement);

      // 2. Scène & Caméra
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        conteneur.clientWidth / Math.max(conteneur.clientHeight, 1),
        0.1,
        100,
      );
      camera.position.set(0, 0, 7);

      // Éclairage
      const lumiereAmbiante = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(lumiereAmbiante);

      const lumiereBleue = new THREE.DirectionalLight(0x2563eb, 2.5);
      lumiereBleue.position.set(5, 5, 5);
      scene.add(lumiereBleue);

      const lumiereCyan = new THREE.DirectionalLight(0x38bdf8, 1.8);
      lumiereCyan.position.set(-5, -3, 3);
      scene.add(lumiereCyan);

      // Groupe principal pivotant
      const groupePrincipal = new THREE.Group();
      scene.add(groupePrincipal);

      // Éléments spécifiques à animer
      const elementsAnimes: Array<(t: number) => void> = [];

      // -----------------------------------------------------------------------
      // SCÈNE 1 : SITES WEB (Navigateur 3D isométrique avec cartes en lévitation)
      // -----------------------------------------------------------------------
      if (slug === "sites-web") {
        groupePrincipal.rotation.x = 0.35;
        groupePrincipal.rotation.y = -0.55;

        // Cadre extérieur du navigateur
        const cadreGeom = new THREE.BoxGeometry(4.2, 2.6, 0.12);
        const cadreEdges = new THREE.EdgesGeometry(cadreGeom);
        const cadreMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.85 });
        const cadreWire = new THREE.LineSegments(cadreEdges, cadreMat);
        groupePrincipal.add(cadreWire);

        // Fond semi-transparent
        const fondMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          transparent: true,
          opacity: 0.6,
          metalness: 0.2,
          roughness: 0.1,
        });
        const fondMesh = new THREE.Mesh(cadreGeom, fondMat);
        groupePrincipal.add(fondMesh);

        // Barre d'outils (3 pastilles)
        const dotGeom = new THREE.SphereGeometry(0.06, 12, 12);
        const dotMatBleu = new THREE.MeshBasicMaterial({ color: 0x60a5fa });
        const dotMatBlanc = new THREE.MeshBasicMaterial({ color: 0x93c5fd });
        const dotMatAccent = new THREE.MeshBasicMaterial({ color: 0x2563eb });

        const dot1 = new THREE.Mesh(dotGeom, dotMatAccent);
        dot1.position.set(-1.8, 1.05, 0.1);
        const dot2 = new THREE.Mesh(dotGeom, dotMatBleu);
        dot2.position.set(-1.6, 1.05, 0.1);
        const dot3 = new THREE.Mesh(dotGeom, dotMatBlanc);
        dot3.position.set(-1.4, 1.05, 0.1);
        groupePrincipal.add(dot1, dot2, dot3);

        // Carte 1 : En-tête / Hero flottant
        const carteHeroGeom = new THREE.BoxGeometry(3.6, 0.75, 0.08);
        const carteHeroEdges = new THREE.EdgesGeometry(carteHeroGeom);
        const carteHeroWire = new THREE.LineSegments(
          carteHeroEdges,
          new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.9 })
        );
        const carteHeroMesh = new THREE.Mesh(
          carteHeroGeom,
          new THREE.MeshStandardMaterial({ color: 0x1e293b, transparent: true, opacity: 0.75 })
        );
        const groupeHero = new THREE.Group();
        groupeHero.add(carteHeroMesh, carteHeroWire);
        groupeHero.position.set(0, 0.45, 0.25);
        groupePrincipal.add(groupeHero);

        // Carte 2 : Composant gauche (grille)
        const carteGaucheGeom = new THREE.BoxGeometry(1.65, 0.9, 0.06);
        const carteGaucheEdges = new THREE.EdgesGeometry(carteGaucheGeom);
        const carteGaucheWire = new THREE.LineSegments(
          carteGaucheEdges,
          new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
        );
        const carteGaucheMesh = new THREE.Mesh(
          carteGaucheGeom,
          new THREE.MeshStandardMaterial({ color: 0x0f172a, transparent: true, opacity: 0.8 })
        );
        const groupeGauche = new THREE.Group();
        groupeGauche.add(carteGaucheMesh, carteGaucheWire);
        groupeGauche.position.set(-0.95, -0.55, 0.35);
        groupePrincipal.add(groupeGauche);

        // Carte 3 : Composant droit (CTA interactif)
        const carteDroiteGeom = new THREE.BoxGeometry(1.65, 0.9, 0.06);
        const carteDroiteEdges = new THREE.EdgesGeometry(carteDroiteGeom);
        const carteDroiteWire = new THREE.LineSegments(
          carteDroiteEdges,
          new THREE.LineBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.95 })
        );
        const carteDroiteMesh = new THREE.Mesh(
          carteDroiteGeom,
          new THREE.MeshStandardMaterial({ color: 0x1d4ed8, transparent: true, opacity: 0.85 })
        );
        const groupeDroit = new THREE.Group();
        groupeDroit.add(carteDroiteMesh, carteDroiteWire);
        groupeDroit.position.set(0.95, -0.55, 0.45);
        groupePrincipal.add(groupeDroit);

        elementsAnimes.push((t) => {
          groupeHero.position.z = 0.25 + Math.sin(t * 2) * 0.08;
          groupeGauche.position.z = 0.35 + Math.sin(t * 2 + 1.2) * 0.09;
          groupeDroit.position.z = 0.45 + Math.sin(t * 2 + 2.4) * 0.1;
        });
      }

      // -----------------------------------------------------------------------
      // SCÈNE 2 : AUTOMATISATION IA (Cœur neuronal, anneaux orbitaux & flux n8n)
      // -----------------------------------------------------------------------
      else if (slug === "automatisation-ia") {
        // Cœur géométrique (Icosaèdre avec arêtes lumineuses)
        const coeurGeom = new THREE.IcosahedronGeometry(0.9, 0);
        const coeurEdges = new THREE.EdgesGeometry(coeurGeom);
        const coeurWire = new THREE.LineSegments(
          coeurEdges,
          new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.95 })
        );
        const coeurMesh = new THREE.Mesh(
          coeurGeom,
          new THREE.MeshStandardMaterial({
            color: 0x1d4ed8,
            emissive: 0x2563eb,
            emissiveIntensity: 0.7,
            metalness: 0.8,
            roughness: 0.2,
          })
        );
        const groupeCoeur = new THREE.Group();
        groupeCoeur.add(coeurMesh, coeurWire);
        groupePrincipal.add(groupeCoeur);

        // Anneaux orbitaux (workflows interconnectés)
        const creeAnneau = (rayon: number, tube: number, angleX: number, angleY: number, couleur: number) => {
          const geom = new THREE.TorusGeometry(rayon, tube, 16, 64);
          const mat = new THREE.MeshStandardMaterial({
            color: couleur,
            emissive: couleur,
            emissiveIntensity: 0.5,
            metalness: 0.6,
            roughness: 0.2,
          });
          const mesh = new THREE.Mesh(geom, mat);
          mesh.rotation.x = angleX;
          mesh.rotation.y = angleY;
          groupePrincipal.add(mesh);
          return mesh;
        };

        const anneau1 = creeAnneau(1.85, 0.025, Math.PI / 3, Math.PI / 6, 0x2563eb);
        const anneau2 = creeAnneau(2.2, 0.02, -Math.PI / 4, Math.PI / 3, 0x38bdf8);
        const anneau3 = creeAnneau(2.55, 0.018, Math.PI / 2.2, -Math.PI / 5, 0x93c5fd);

        // Noeuds / Satellites (Agents IA qui gravitent)
        const satelliteGeom = new THREE.SphereGeometry(0.12, 16, 16);
        const satelliteMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0x60a5fa,
          emissiveIntensity: 0.9,
        });

        const satellites = [
          new THREE.Mesh(satelliteGeom, satelliteMat),
          new THREE.Mesh(satelliteGeom, satelliteMat),
          new THREE.Mesh(satelliteGeom, satelliteMat),
          new THREE.Mesh(satelliteGeom, satelliteMat),
        ];
        satellites.forEach((s) => groupePrincipal.add(s));

        // Lignes de connexion directes entre cœur et satellites
        const ligneMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 });
        const geomLigne1 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
        const geomLigne2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
        const ligne1 = new THREE.Line(geomLigne1, ligneMat);
        const ligne2 = new THREE.Line(geomLigne2, ligneMat);
        groupePrincipal.add(ligne1, ligne2);

        elementsAnimes.push((t) => {
          groupeCoeur.rotation.x = t * 0.8;
          groupeCoeur.rotation.y = t * 1.1;

          anneau1.rotation.z = t * 0.5;
          anneau2.rotation.z = -t * 0.4;
          anneau3.rotation.y = t * 0.35;

          // Trajectoire orbitaire des satellites
          const r1 = 1.85;
          satellites[0].position.set(Math.cos(t * 1.4) * r1, Math.sin(t * 1.4) * r1 * 0.5, Math.sin(t * 1.4) * r1 * 0.8);
          satellites[1].position.set(Math.cos(t * 1.1 + 2) * 2.2, Math.sin(t * 1.1 + 2) * 2.2 * 0.7, Math.cos(t * 1.1 + 2) * 1.2);
          satellites[2].position.set(Math.sin(t * 0.9 + 4) * 2.5, Math.cos(t * 0.9 + 4) * 1.8, Math.sin(t * 0.9 + 4) * 1.4);
          satellites[3].position.set(-Math.cos(t * 1.6) * 1.5, Math.sin(t * 1.6) * 1.5, Math.cos(t * 1.6) * 1.5);

          // Mise à jour des lignes de flux
          const pos1 = geomLigne1.attributes.position as import("three").BufferAttribute;
          pos1.setXYZ(1, satellites[0].position.x, satellites[0].position.y, satellites[0].position.z);
          pos1.needsUpdate = true;

          const pos2 = geomLigne2.attributes.position as import("three").BufferAttribute;
          pos2.setXYZ(1, satellites[1].position.x, satellites[1].position.y, satellites[1].position.z);
          pos2.needsUpdate = true;
        });
      }

      // -----------------------------------------------------------------------
      // SCÈNE 3 : SUPERVISION & MAINTENANCE (Radar géodésique, scanner 24/7 & bouclier)
      // -----------------------------------------------------------------------
      else {
        // Dôme géodésique / Bouclier de surveillance
        const sphereGeom = new THREE.IcosahedronGeometry(1.65, 2);
        const sphereEdges = new THREE.EdgesGeometry(sphereGeom);
        const sphereWire = new THREE.LineSegments(
          sphereEdges,
          new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.65 })
        );
        groupePrincipal.add(sphereWire);

        // Noyau central (statut serveur / heartbeat)
        const coeurGeom = new THREE.SphereGeometry(0.55, 24, 24);
        const coeurMat = new THREE.MeshStandardMaterial({
          color: 0x2563eb,
          emissive: 0x38bdf8,
          emissiveIntensity: 0.8,
          metalness: 0.3,
          roughness: 0.2,
        });
        const coeurMesh = new THREE.Mesh(coeurGeom, coeurMat);
        groupePrincipal.add(coeurMesh);

        // Anneau radar équatorial
        const radarGeom = new THREE.RingGeometry(0.7, 2.3, 48);
        const radarMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.2,
        });
        const radarMesh = new THREE.Mesh(radarGeom, radarMat);
        radarMesh.rotation.x = Math.PI / 2;
        groupePrincipal.add(radarMesh);

        // Impulsion radar mobile qui scanne
        const pulseGeom = new THREE.TorusGeometry(1.65, 0.03, 16, 64);
        const pulseMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.9,
        });
        const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        groupePrincipal.add(pulseMesh);

        elementsAnimes.push((t) => {
          sphereWire.rotation.y = t * 0.25;
          sphereWire.rotation.x = Math.sin(t * 0.15) * 0.2;

          // Battement de cœur (heartbeat 24/7)
          const pulsation = 1 + Math.sin(t * 4) * 0.08;
          coeurMesh.scale.set(pulsation, pulsation, pulsation);

          // Balayage scanner vertical
          pulseMesh.position.y = Math.sin(t * 2) * 1.5;
          pulseMesh.rotation.x = Math.PI / 2;
          const echellePulse = Math.sqrt(Math.max(0.1, 1 - (pulseMesh.position.y / 1.7) ** 2));
          pulseMesh.scale.set(echellePulse, echellePulse, 1);
        });
      }

      // 3. Suivi interactif de la souris
      let curseurCibleX = 0;
      let curseurCibleY = 0;
      let curseurActuelX = 0;
      let curseurActuelY = 0;

      const surMouvementCurseur = (event: MouseEvent) => {
        const rect = conteneur.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        curseurCibleX = x * 0.7;
        curseurCibleY = y * 0.7;
      };

      const parentCarte = conteneur.closest("article") ?? conteneur;
      parentCarte.addEventListener("mousemove", surMouvementCurseur as EventListener, { passive: true });

      const surQuitteCurseur = () => {
        curseurCibleX = 0;
        curseurCibleY = 0;
      };
      parentCarte.addEventListener("mouseleave", surQuitteCurseur, { passive: true });

      // 4. Gestion du redimensionnement
      const surRedimensionnement = () => {
        if (!conteneur) return;
        const w = conteneur.clientWidth;
        const h = conteneur.clientHeight;
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      window.addEventListener("resize", surRedimensionnement, { passive: true });

      // 5. Boucle d'animation avec IntersectionObserver
      let visible = true;
      const observateur = new IntersectionObserver(
        (entrees) => {
          visible = Boolean(entrees[0]?.isIntersecting);
        },
        { threshold: 0.1 }
      );
      observateur.observe(conteneur);

      let idAnimation: number;
      const horloge = new THREE.Clock();

      const animer = () => {
        idAnimation = requestAnimationFrame(animer);
        if (!visible) return;

        const deltaTemps = horloge.getElapsedTime();

        // Interpolation douce du curseur
        curseurActuelX += (curseurCibleX - curseurActuelX) * 0.08;
        curseurActuelY += (curseurCibleY - curseurActuelY) * 0.08;

        if (!reduireMouvement) {
          groupePrincipal.rotation.y += (curseurActuelX * 1.5 - groupePrincipal.rotation.y * 0.1) * 0.05;
          groupePrincipal.rotation.x += (curseurActuelY * 1.5 - groupePrincipal.rotation.x * 0.1) * 0.05;

          // Rotation lente de fond
          groupePrincipal.rotation.y += 0.003;

          // Animation interne
          for (const anim of elementsAnimes) {
            anim(deltaTemps);
          }
        }

        renderer.render(scene, camera);
      };

      animer();
      setPret(true);

      // Fonction de nettoyage
      demonter = () => {
        cancelAnimationFrame(idAnimation);
        observateur.disconnect();
        window.removeEventListener("resize", surRedimensionnement);
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
      className={cn("relative size-full overflow-hidden select-none", className)}
      aria-hidden="true"
    >
      {/* Halo lumineux d'ambiance en arrière-plan */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 -z-10",
          "bg-[radial-gradient(ellipse_at_center,oklch(0.6_0.22_255/0.18)_0%,transparent_70%)]",
          "transition-opacity duration-700",
          pret ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
