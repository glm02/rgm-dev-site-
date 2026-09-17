import "server-only";

import { connect } from "node:tls";

import { notifierAlerte } from "./notifications";
import { clientService } from "./supabase/service";
import type { SiteSupervise, TypeAlerte } from "./types";

/**
 * La supervision des sites livrés.
 *
 * Demande explicite de Rafael : être prévenu quand un site client tombe, sans
 * l'apprendre par le client. Une passe contrôle chaque site actif, enregistre
 * le résultat, et ne notifie que sur les **changements d'état** — un site en
 * panne pendant trois heures produit une alerte à la chute et une au retour,
 * pas trente-six.
 *
 * Tourne avec la clé service role : il n'y a pas d'utilisateur derrière un
 * cron, et `controles` / `alertes` n'ont pas de politique d'écriture.
 */

const DELAI_MS = 15_000;
/** En dessous de ce nombre de jours avant expiration du certificat, on prévient. */
const SEUIL_TLS_JOURS = 14;

export type ResultatControle = {
  site: string;
  ok: boolean;
  statut_http: number | null;
  temps_ms: number | null;
  erreur: string | null;
  tls_expire_le: string | null;
};

async function expirationTls(url: string): Promise<Date | null> {
  const { hostname, protocol, port } = new URL(url);
  if (protocol !== "https:") return null;

  return new Promise((resolve) => {
    const socket = connect(
      { host: hostname, port: port ? Number(port) : 443, servername: hostname, timeout: DELAI_MS },
      () => {
        const certificat = socket.getPeerCertificate();
        socket.end();
        resolve(certificat?.valid_to ? new Date(certificat.valid_to) : null);
      },
    );
    // Un certificat illisible n'est pas une panne du site : le contrôle HTTP
    // dira s'il répond. On renonce simplement à cette information.
    socket.on("error", () => resolve(null));
    socket.on("timeout", () => {
      socket.destroy();
      resolve(null);
    });
  });
}

export async function controlerSite(site: Pick<SiteSupervise, "nom" | "url" | "statut_attendu" | "seuil_lenteur_ms">): Promise<ResultatControle> {
  const debut = performance.now();
  const annulation = new AbortController();
  const minuterie = setTimeout(() => annulation.abort(), DELAI_MS);

  let statut: number | null = null;
  let erreur: string | null = null;

  try {
    const reponse = await fetch(site.url, {
      method: "GET",
      redirect: "follow",
      signal: annulation.signal,
      cache: "no-store",
      headers: { "user-agent": "RGM-Dev-Supervision/1.0 (+https://rgm-dev.site)" },
    });
    statut = reponse.status;
    // Vider le corps : sans ça, la connexion reste ouverte jusqu'au délai.
    await reponse.arrayBuffer().catch(() => undefined);
    if (statut !== site.statut_attendu) erreur = `HTTP ${statut} (attendu ${site.statut_attendu})`;
  } catch (e) {
    erreur = annulation.signal.aborted
      ? `Pas de réponse en ${DELAI_MS / 1000} s`
      : e instanceof Error
        ? e.message
        : "Erreur réseau";
  } finally {
    clearTimeout(minuterie);
  }

  const temps = Math.round(performance.now() - debut);
  const tls = await expirationTls(site.url);

  return {
    site: site.nom,
    ok: erreur === null,
    statut_http: statut,
    temps_ms: statut === null ? null : temps,
    erreur,
    tls_expire_le: tls ? tls.toISOString().slice(0, 10) : null,
  };
}

/** Une passe complète sur tous les sites actifs. */
export async function executerSupervision(): Promise<
  { configure: false } | { configure: true; resultats: ResultatControle[] }
> {
  const supabase = clientService();
  if (!supabase) return { configure: false };

  const { data: sites, error } = await supabase
    .from("sites_supervises")
    .select("*")
    .eq("actif", true);
  if (error) throw error;

  const resultats = await Promise.all(
    ((sites ?? []) as SiteSupervise[]).map(async (site) => {
      const resultat = await controlerSite(site);
      const maintenant = new Date().toISOString();

      await supabase.from("controles").insert({
        site_id: site.id,
        ok: resultat.ok,
        statut_http: resultat.statut_http,
        temps_ms: resultat.temps_ms,
        erreur: resultat.erreur,
      });

      await supabase
        .from("sites_supervises")
        .update({
          dernier_controle_le: maintenant,
          dernier_ok: resultat.ok,
          tls_expire_le: resultat.tls_expire_le ?? site.tls_expire_le,
        })
        .eq("id", site.id);

      const ouvrir = async (type: TypeAlerte, message: string) => {
        await supabase.from("alertes").insert({
          site_id: site.id,
          type,
          message,
          notifiee_le: maintenant,
          // Un retour en ligne est une information, pas un incident à traiter.
          resolue_le: type === "retour_en_ligne" ? maintenant : null,
        });
      };

      // Chute : il répondait (ou n'avait jamais été contrôlé), il ne répond plus.
      if (!resultat.ok && site.dernier_ok !== false) {
        const type: TypeAlerte = resultat.statut_http === null ? "hors_ligne" : "erreur_http";
        const message = `${site.nom} ne répond plus correctement : ${resultat.erreur}.`;
        await ouvrir(type, message);
        await notifierAlerte({ site: site.nom, url: site.url, type, message });
      }

      // Retour : il était en panne, il répond. On clôt les incidents ouverts.
      if (resultat.ok && site.dernier_ok === false) {
        await supabase
          .from("alertes")
          .update({ resolue_le: maintenant })
          .eq("site_id", site.id)
          .is("resolue_le", null)
          .in("type", ["hors_ligne", "erreur_http"]);

        const message = `${site.nom} répond de nouveau (HTTP ${resultat.statut_http}, ${resultat.temps_ms} ms).`;
        await ouvrir("retour_en_ligne", message);
        await notifierAlerte({ site: site.nom, url: site.url, type: "retour_en_ligne", message, retabli: true });
      }

      // Lenteur et certificat : une seule alerte ouverte à la fois par type,
      // sinon chaque passe en rajouterait une.
      const alerteOuverte = async (type: TypeAlerte) => {
        const { count } = await supabase
          .from("alertes")
          .select("id", { count: "exact", head: true })
          .eq("site_id", site.id)
          .eq("type", type)
          .is("resolue_le", null);
        return Boolean(count);
      };

      if (resultat.ok && resultat.temps_ms !== null && resultat.temps_ms > site.seuil_lenteur_ms) {
        if (!(await alerteOuverte("lenteur"))) {
          const message = `${site.nom} répond en ${resultat.temps_ms} ms (seuil : ${site.seuil_lenteur_ms} ms).`;
          await ouvrir("lenteur", message);
          await notifierAlerte({ site: site.nom, url: site.url, type: "lenteur", message });
        }
      }

      if (resultat.tls_expire_le) {
        const jours = Math.floor(
          (new Date(resultat.tls_expire_le).getTime() - Date.now()) / 86_400_000,
        );
        if (jours <= SEUIL_TLS_JOURS && !(await alerteOuverte("tls_bientot_expire"))) {
          const message = `Le certificat TLS de ${site.nom} expire dans ${jours} jour${jours > 1 ? "s" : ""}.`;
          await ouvrir("tls_bientot_expire", message);
          await notifierAlerte({ site: site.nom, url: site.url, type: "tls_bientot_expire", message });
        }
      }

      return resultat;
    }),
  );

  return { configure: true, resultats };
}
