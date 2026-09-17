import type { Metadata } from "next";

import { CoqueEspace } from "@/components/espace/coque-espace";
import { EspaceIndisponible } from "@/components/espace/entete-page";
import { sessionOuRedirection } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Espace client",
  robots: { index: false, follow: false },
};

/**
 * La coque de l'espace client.
 *
 * La vérification de session est faite ici **et** répétée dans chaque action :
 * un layout protège l'affichage, pas les mutations.
 */
export default async function LayoutCompte({ children }: LayoutProps<"/compte">) {
  const session = await sessionOuRedirection("/compte");
  if (!session) return <EspaceIndisponible />;

  const { profil } = session;

  return (
    <CoqueEspace
      titre="Espace client"
      utilisateur={{ nom: profil.nom ?? "Mon compte", email: profil.email }}
      liens={[
        { href: "/compte", libelle: "Mes projets", icone: "projets" },
        { href: "/compte/avis", libelle: "Donner mon avis", icone: "avis" },
        { href: "/compte/profil", libelle: "Mon profil", icone: "profil" },
        ...(profil.role === "admin"
          ? [{ href: "/admin", libelle: "Administration", icone: "tableau" as const }]
          : []),
      ]}
    >
      {children}
    </CoqueEspace>
  );
}
