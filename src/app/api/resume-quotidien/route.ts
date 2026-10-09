import { NextResponse, type NextRequest } from "next/server";

import { echapper, envoyerTelegram } from "@/lib/notifications";
import { SITE } from "@/lib/site";
import { clientService } from "@/lib/supabase/service";

/**
 * Le résumé du matin, sur Telegram.
 *
 * Les alertes arrivent au fil de l'eau (demande de devis, message client, site
 * en panne). Ce qui manquait : ce qui **dort** — une relance prévue hier, une
 * facture échue, une demande jamais traitée, un avis en attente. Rien de tout
 * ça ne déclenche d'alerte, et c'est précisément ce qui fait perdre un client.
 *
 * Appelé chaque matin par le workflow GitHub Actions « Résumé quotidien »,
 * avec le même secret que la supervision. N'envoie rien s'il n'y a rien à
 * faire : un message quotidien vide apprend vite à ignorer les messages.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(requete: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || requete.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ erreur: "Non autorisé" }, { status: 401 });
  }

  const supabase = clientService();
  if (!supabase) {
    return NextResponse.json({ erreur: "SUPABASE_SERVICE_ROLE_KEY manquante" }, { status: 503 });
  }

  const aujourdHui = new Date().toISOString().slice(0, 10);

  const [relances, demandes, factures, avis, alertes] = await Promise.all([
    supabase
      .from("prospects")
      .select("id, entreprise, contact, relance_le")
      .lte("relance_le", aujourdHui)
      .in("statut", ["nouveau", "qualifie", "devis_envoye", "negociation"])
      .order("relance_le"),
    supabase.from("demandes_devis").select("id, nom, entreprise, cree_le").eq("statut", "nouveau").order("cree_le"),
    supabase
      .from("documents")
      .select("id, titre, montant, echeance_le, mission_id")
      .eq("type", "facture")
      .eq("statut", "envoye")
      .lt("echeance_le", aujourdHui),
    supabase.from("avis").select("id", { count: "exact", head: true }).eq("publie", false),
    supabase.from("alertes").select("id", { count: "exact", head: true }).is("resolue_le", null),
  ]);

  const erreur = [relances, demandes, factures, avis, alertes].find((r) => r.error)?.error;
  if (erreur) {
    console.error("[resume-quotidien]", erreur);
    return NextResponse.json({ erreur: "Lecture impossible" }, { status: 500 });
  }

  const blocs: string[] = [];
  const nom = (entreprise: string | null, contact: string | null) => echapper(entreprise ?? contact ?? "Sans nom");

  if (relances.data?.length) {
    blocs.push(
      `📞 <b>${relances.data.length} relance${relances.data.length > 1 ? "s" : ""} à faire</b>\n` +
        relances.data
          .slice(0, 8)
          .map((p) => `• ${nom(p.entreprise, p.contact)}${p.relance_le < aujourdHui ? ` (prévue le ${p.relance_le})` : ""}`)
          .join("\n"),
    );
  }
  if (demandes.data?.length) {
    blocs.push(
      `📥 <b>${demandes.data.length} demande${demandes.data.length > 1 ? "s" : ""} de devis non traitée${demandes.data.length > 1 ? "s" : ""}</b>\n` +
        demandes.data
          .slice(0, 8)
          .map((d) => `• ${nom(d.entreprise, d.nom)}`)
          .join("\n"),
    );
  }
  if (factures.data?.length) {
    blocs.push(
      `💶 <b>${factures.data.length} facture${factures.data.length > 1 ? "s" : ""} échue${factures.data.length > 1 ? "s" : ""}</b>\n` +
        factures.data
          .slice(0, 8)
          .map((f) => `• ${echapper(f.titre)}${f.montant ? ` — ${f.montant} € HT` : ""} (échéance ${f.echeance_le})`)
          .join("\n"),
    );
  }
  if (avis.count) blocs.push(`⭐ <b>${avis.count} avis à modérer</b>`);
  if (alertes.count) blocs.push(`🚨 <b>${alertes.count} alerte${alertes.count > 1 ? "s" : ""} de supervision ouverte${alertes.count > 1 ? "s" : ""}</b>`);

  if (blocs.length === 0) {
    return NextResponse.json({ envoye: false, raison: "Rien à signaler" });
  }

  const envoye = await envoyerTelegram(`☀️ <b>Ce matin</b>\n\n${blocs.join("\n\n")}\n\n${SITE.url}/admin`);
  return NextResponse.json({ envoye, rubriques: blocs.length });
}
