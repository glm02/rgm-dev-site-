import { NextResponse, type NextRequest } from "next/server";

import { executerSupervision } from "@/lib/supervision";

/**
 * Le point d'entrée de la supervision, appelé par une tâche planifiée.
 *
 * Deux appelants prévus :
 * - le cron Vercel (`vercel.json`) — une fois par jour, limite du plan Hobby ;
 * - un workflow n8n sur le VPS, toutes les 5 minutes, pour une vraie
 *   surveillance. Même en-tête d'autorisation dans les deux cas.
 *
 * Protégé par `CRON_SECRET` : sans secret configuré, la route refuse tout,
 * plutôt que de laisser n'importe qui déclencher des requêtes vers les sites
 * des clients.
 */

// Contrôles réseau et module `node:tls` : runtime Node, jamais mis en cache.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(requete: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();

  if (!secret || requete.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ erreur: "Non autorisé" }, { status: 401 });
  }

  try {
    const bilan = await executerSupervision();

    if (!bilan.configure) {
      return NextResponse.json(
        { erreur: "Supabase non configuré (SUPABASE_SERVICE_ROLE_KEY manquante)" },
        { status: 503 },
      );
    }

    return NextResponse.json({
      controles: bilan.resultats.length,
      en_panne: bilan.resultats.filter((r) => !r.ok).map((r) => r.site),
      resultats: bilan.resultats,
    });
  } catch (erreur) {
    console.error("[supervision]", erreur);
    return NextResponse.json({ erreur: "Échec de la supervision" }, { status: 500 });
  }
}
