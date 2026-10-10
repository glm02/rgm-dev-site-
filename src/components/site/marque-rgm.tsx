/**
 * Le symbole RGM : six parallélogrammes qui dessinent deux chevrons imbriqués.
 *
 * Vectorisé à partir du fichier de Rafael (`rgm.dev/photo/faivocn.png`,
 * 2000 × 2000 px) : chaque forme a été relevée au pixel près, puis recopiée
 * ici en polygone. En SVG plutôt qu'en image : net à toutes les tailles,
 * aucune requête réseau, et `currentColor` lui fait suivre le thème.
 *
 * Mêmes coordonnées que `src/app/icon.svg` : modifier l'un, c'est modifier
 * l'autre.
 */
export const POLYGONES_RGM = [
  "587,378 826,378 1021,726 782,726",
  "1151,504 1391,504 1153,940 913,940",
  "540,728 780,728 542,1164 302,1164",
  "1457,835 1697,835 1459,1271 1219,1271",
  "846,1059 1086,1059 848,1495 608,1495",
  "978,1273 1217,1273 1412,1621 1173,1621",
] as const;

export function MarqueRgm({ className }: { className?: string }) {
  return (
    <svg viewBox="290 366 1420 1268" fill="currentColor" className={className} aria-hidden="true">
      {POLYGONES_RGM.map((points) => (
        <polygon key={points} points={points} />
      ))}
    </svg>
  );
}
