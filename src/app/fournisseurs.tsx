"use client";

import { ThemeProvider } from "next-themes";
import * as React from "react";

/**
 * Les fournisseurs de contexte de l'application.
 *
 * Regroupés dans un composant client à part pour que le layout racine reste un
 * Server Component : c'est lui qui porte les métadonnées et le rendu serveur
 * dont dépend le référencement.
 *
 * `disableTransitionOnChange` coupe les transitions le temps du basculement de
 * thème, puis les rétablit. Sans ça, le changement de couleur de chaque
 * élément s'anime pour son compte et l'écran se brouille au lieu de basculer
 * net.
 *
 * `defaultTheme="light"` et pas `"system"` : l'identité de RGM Dev est le bleu
 * sur blanc. Un visiteur dont le système est en sombre verrait sinon un site
 * noir à sa première visite — ce n'est pas la marque. Le thème sombre reste
 * accessible par le bouton, et le choix est mémorisé.
 */
export function Fournisseurs({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
