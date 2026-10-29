import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";

/**
 * La politique de sécurité du contenu (CSP) : la liste de ce que le
 * navigateur a le droit de charger. Un script injecté venu d'ailleurs ne
 * s'exécute pas, une page piégée ne peut pas afficher le site dans un cadre.
 *
 * `'unsafe-inline'` reste pour les scripts : sans lui, il faudrait un nonce à
 * chaque requête, ce qui rend toutes les pages dynamiques et coûte en
 * vitesse et en référencement. Les sources externes, elles, sont fermées.
 * `'unsafe-eval'` n'existe qu'en développement (rechargement à chaud).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const entetesSecurite = [
  { key: "Content-Security-Policy", value: csp },
  // Deux ans, sous-domaines compris : le navigateur refuse ensuite tout HTTP.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  // Ne pas annoncer « Next.js » dans chaque réponse : inutile d'aider à cibler.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: entetesSecurite }];
  },
  experimental: {
    serverActions: {
      // L'admin dépose des factures et des images via des Server Actions,
      // limitées à 1 Mo par défaut. 4 Mo : Vercel refuse de toute façon une
      // requête au-delà de 4,5 Mo. Voir TAILLE_MAX_OCTETS dans lib/stockage.ts.
      bodySizeLimit: "4mb",
    },
  },
  images: {
    // AVIF d'abord : 20 à 30 % plus léger que WebP à qualité égale, et tous les
    // navigateurs récents le lisent. WebP reste en repli.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Les images déposées depuis l'admin vivront dans Supabase Storage. Le
      // sous-domaine du projet n'est pas encore connu, d'où le joker.
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
