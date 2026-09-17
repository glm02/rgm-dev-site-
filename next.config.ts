import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
