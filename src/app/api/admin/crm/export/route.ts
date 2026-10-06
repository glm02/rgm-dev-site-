import { NextResponse } from "next/server";

import { AccesRefuse, exigerAdmin } from "@/lib/auth";
import { filtrerProspects, lignesCsv, lireFiltres } from "@/lib/crm";
import type { Prospect } from "@/lib/types";

/**
 * Le pipeline, tel qu'il est filtré à l'écran, en fichier tableur.
 *
 * Les filtres sont relus depuis l'URL plutôt que postés : le bouton d'export
 * est un simple lien, et ce qu'on télécharge est exactement ce qu'on voit.
 *
 * La vérification du rôle est refaite ici : une route est joignable
 * directement, l'interface ne protège rien.
 */
export async function GET(requete: Request) {
  let session;
  try {
    session = await exigerAdmin();
  } catch (erreur) {
    const message = erreur instanceof AccesRefuse ? erreur.message : "Accès refusé.";
    return NextResponse.json({ erreur: message }, { status: 403 });
  }

  const url = new URL(requete.url);
  const filtres = lireFiltres(Object.fromEntries(url.searchParams));

  const { data } = await session.supabase
    .from("prospects")
    .select("*")
    .order("derniere_activite_le", { ascending: false });

  const prospects = filtrerProspects((data ?? []) as Prospect[], filtres);
  const jour = new Date().toISOString().slice(0, 10);

  return new NextResponse(lignesCsv(prospects), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="pipeline-rgm-dev-${jour}.csv"`,
      "cache-control": "no-store",
    },
  });
}
