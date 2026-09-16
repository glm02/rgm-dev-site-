import "server-only";

import { Resend } from "resend";

import { SITE } from "./site";

/**
 * Les notifications sortantes.
 *
 * Deux canaux, volontairement :
 *
 * - **Telegram** pour ce qui est urgent (un site client tombé). C'est ce qui
 *   fait vibrer un téléphone la nuit.
 * - **Email** pour ce qui doit laisser une trace (une demande de devis).
 *
 * Aucun des deux n'est obligatoire : si les variables manquent, on trace en
 * console et on continue. Un canal de notification muet ne doit jamais faire
 * échouer l'action qu'il devait annoncer.
 */

const EXPEDITEUR = process.env.RESEND_FROM ?? "RGM Dev <onboarding@resend.dev>";
const DESTINATAIRE = process.env.ALERTE_EMAIL ?? SITE.email;

function resend(): Resend | null {
  const cle = process.env.RESEND_API_KEY;
  return cle ? new Resend(cle) : null;
}

/** Échappe le HTML. Une saisie libre finit dans un email : elle ne doit rien exécuter. */
function echapper(valeur: string): string {
  return valeur
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// Telegram
// ---------------------------------------------------------------------------

export async function envoyerTelegram(texte: string): Promise<boolean> {
  const jeton = process.env.TELEGRAM_BOT_TOKEN;
  const salon = process.env.TELEGRAM_CHAT_ID;

  if (!jeton || !salon) {
    console.warn("[notifications] Telegram non configuré :", texte);
    return false;
  }

  try {
    const reponse = await fetch(`https://api.telegram.org/bot${jeton}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: salon,
        text: texte,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!reponse.ok) {
      console.error("[notifications] Telegram a refusé :", await reponse.text());
      return false;
    }

    return true;
  } catch (erreur) {
    console.error("[notifications] Telegram injoignable", erreur);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Demande de devis
// ---------------------------------------------------------------------------

type Demande = {
  nom: string;
  email: string;
  telephone: string | null;
  entreprise: string | null;
  type_projet: string | null;
  budget: string | null;
  echeance: string | null;
  message: string;
  utm_source: string | null;
  utm_campaign: string | null;
  page_origine: string | null;
};

export async function notifierDemandeDevis(demande: Demande): Promise<void> {
  const lignes = [
    ["Nom", demande.nom],
    ["Email", demande.email],
    ["Téléphone", demande.telephone],
    ["Entreprise", demande.entreprise],
    ["Type de projet", demande.type_projet],
    ["Budget annoncé", demande.budget],
    ["Échéance", demande.echeance],
    ["Page d'origine", demande.page_origine],
    ["Campagne", demande.utm_campaign ?? demande.utm_source],
  ].filter((paire): paire is [string, string] => Boolean(paire[1]));

  await envoyerTelegram(
    [
      "🔔 <b>Nouvelle demande de devis</b>",
      "",
      ...lignes.map(([cle, valeur]) => `<b>${cle} :</b> ${echapper(valeur)}`),
      "",
      echapper(demande.message.slice(0, 600)),
    ].join("\n"),
  );

  const client = resend();
  if (!client) {
    console.warn("[notifications] Resend non configuré — email de devis non envoyé.");
    return;
  }

  await client.emails.send({
    from: EXPEDITEUR,
    to: DESTINATAIRE,
    // Répondre directement au prospect depuis sa boîte, sans copier l'adresse.
    replyTo: demande.email,
    subject: `Devis — ${demande.nom}${demande.entreprise ? ` (${demande.entreprise})` : ""}`,
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:600px;color:#171717">
        <h1 style="font-size:18px;margin:0 0 20px">Nouvelle demande de devis</h1>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${lignes
            .map(
              ([cle, valeur]) => `
            <tr>
              <td style="padding:8px 12px 8px 0;color:#666;white-space:nowrap;vertical-align:top">${cle}</td>
              <td style="padding:8px 0"><strong>${echapper(valeur)}</strong></td>
            </tr>`,
            )
            .join("")}
        </table>
        <div style="margin-top:24px;padding:16px;background:#f5f7fb;border-left:3px solid #2563eb;border-radius:6px">
          <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${echapper(demande.message)}</p>
        </div>
      </div>
    `,
  });
}

// ---------------------------------------------------------------------------
// Supervision
// ---------------------------------------------------------------------------

export async function notifierAlerte(alerte: {
  site: string;
  url: string;
  type: string;
  message: string;
  /** Un retour en ligne se signale aussi : savoir que c'est réglé compte autant. */
  retabli?: boolean;
}): Promise<void> {
  const icone = alerte.retabli ? "✅" : "🚨";
  const titre = alerte.retabli ? "Retour en ligne" : "Alerte site";

  await envoyerTelegram(
    [
      `${icone} <b>${titre} — ${echapper(alerte.site)}</b>`,
      "",
      echapper(alerte.message),
      "",
      `<a href="${alerte.url}">${echapper(alerte.url)}</a>`,
    ].join("\n"),
  );

  // Un retour à la normale ne mérite pas un email : Telegram suffit. On
  // réserve l'email aux incidents, pour que la boîte reste lisible.
  if (alerte.retabli) return;

  const client = resend();
  if (!client) return;

  await client.emails.send({
    from: EXPEDITEUR,
    to: DESTINATAIRE,
    subject: `🚨 ${alerte.site} — ${alerte.type}`,
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:600px;color:#171717">
        <h1 style="font-size:18px;margin:0 0 12px">${echapper(alerte.site)}</h1>
        <p style="font-size:14px;line-height:1.6;margin:0 0 16px">${echapper(alerte.message)}</p>
        <p style="font-size:14px;margin:0">
          <a href="${alerte.url}" style="color:#2563eb">${echapper(alerte.url)}</a>
        </p>
      </div>
    `,
  });
}
