import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Fournisseurs } from "./fournisseurs";
import { Toaster } from "@/components/ui/sonner";
import { SITE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nom} — ${SITE.slogan}`,
    // Chaque page complète ce gabarit. Le nom en fin de titre plutôt qu'au
    // début : dans un résultat Google, ce sont les premiers mots qui sont lus.
    template: `%s — ${SITE.nom}`,
  },
  description: SITE.promesse,
  applicationName: SITE.nom,
  authors: [{ name: SITE.nom, url: SITE.url }],
  creator: SITE.nom,
  keywords: [
    "développeur freelance Lyon",
    "création site web Lyon",
    "développeur Next.js Lyon",
    "automatisation IA Lyon",
    "agent IA entreprise",
    "workflow n8n",
    "refonte site internet Lyon",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE.url,
    siteName: SITE.nom,
    title: `${SITE.nom} — ${SITE.slogan}`,
    description: SITE.promesse,
    // L'aperçu affiché quand le lien est partagé (LinkedIn, WhatsApp, Slack).
    images: [{ url: "/images/og-banner.jpg", width: 1376, height: 768, alt: SITE.slogan }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  // Les deux couleurs de barre d'adresse, pour que le navigateur mobile suive
  // le thème du site au lieu de rester blanc.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // `suppressHydrationWarning` : next-themes pose la classe de thème sur
    // <html> avant l'hydratation, ce qui fait forcément diverger le serveur et
    // le client. C'est attendu, et c'est le seul endroit où on le tolère.
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <Fournisseurs>
          {children}
          <Toaster position="bottom-right" closeButton />
        </Fournisseurs>
      </body>
    </html>
  );
}
