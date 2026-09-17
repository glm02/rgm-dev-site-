import type { Metadata } from "next";

import { CoqueEspace } from "@/components/espace/coque-espace";
import { EspaceIndisponible } from "@/components/espace/entete-page";
import { sessionAdminOuRedirection } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

/**
 * La coque de l'administration.
 *
 * Les compteurs de la navigation sont la liste des choses à faire : demandes
 * non traitées, avis à modérer, incidents ouverts. On doit voir d'un coup
 * d'œil s'il y a du travail, sans ouvrir chaque page.
 */
export default async function LayoutAdmin({ children }: LayoutProps<"/admin">) {
  const session = await sessionAdminOuRedirection("/admin");
  if (!session) return <EspaceIndisponible />;

  const { supabase, profil } = session;

  const [demandes, avis, alertes] = await Promise.all([
    supabase.from("demandes_devis").select("id", { count: "exact", head: true }).eq("statut", "nouveau"),
    supabase.from("avis").select("id", { count: "exact", head: true }).eq("publie", false),
    supabase.from("alertes").select("id", { count: "exact", head: true }).is("resolue_le", null),
  ]);

  return (
    <CoqueEspace
      titre="Administration"
      utilisateur={{ nom: profil.nom ?? "Admin", email: profil.email }}
      liens={[
        { href: "/admin", libelle: "Tableau de bord", icone: "tableau" },
        { href: "/admin/demandes", libelle: "Demandes", icone: "demandes", compteur: demandes.count ?? 0 },
        { href: "/admin/clients", libelle: "Clients", icone: "clients" },
        { href: "/admin/realisations", libelle: "Réalisations", icone: "realisations" },
        { href: "/admin/offres", libelle: "Services et tarifs", icone: "offres" },
        { href: "/admin/avis", libelle: "Avis", icone: "moderation", compteur: avis.count ?? 0 },
        { href: "/admin/articles", libelle: "Blog", icone: "articles" },
        { href: "/admin/supervision", libelle: "Supervision", icone: "supervision", compteur: alertes.count ?? 0 },
      ]}
    >
      {children}
    </CoqueEspace>
  );
}
