import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Apparait } from "@/components/commun/apparait";
import { TitreSection } from "@/components/commun/titre-section";
import { clientService } from "@/lib/supabase/service";

/**
 * La supervision, en chiffres réels.
 *
 * « Votre site est surveillé 24 h/24 » est une phrase que tout le monde écrit.
 * Ici, ce sont les mesures du robot qui contrôle les sites des clients toutes
 * les 5 minutes (workflow GitHub Actions → /api/supervision) : nombre de
 * sites, disponibilité et temps de réponse sur les dernières 24 heures.
 *
 * Seulement des agrégats : aucun nom de client ni adresse, et un site en
 * panne n'est jamais montré du doigt sur la vitrine.
 *
 * Lu avec la clé service (les tables de supervision ne sont pas publiques),
 * côté serveur uniquement. Sans clé ou sans mesure, la section disparaît.
 */
/** Les sites actifs et les contrôles des dernières 24 heures. */
async function lireMesures() {
  const supabase = clientService();
  if (!supabase) return null;

  const depuis = new Date(Date.now() - 24 * 3600 * 1000).toISOString();

  const [{ count: sites }, { data: controles }] = await Promise.all([
    supabase.from("sites_supervises").select("id", { count: "exact", head: true }).eq("actif", true),
    supabase.from("controles").select("ok, temps_ms, verifie_le").gte("verifie_le", depuis).limit(5000),
  ]);

  return { sites, mesures: controles ?? [] };
}

export async function SupervisionDirect() {
  const lecture = await lireMesures();
  if (!lecture) return null;
  const { sites, mesures } = lecture;
  if (!sites || mesures.length === 0) return null;

  const reussis = mesures.filter((c) => c.ok).length;
  const disponibilite = (reussis / mesures.length) * 100;
  const temps = mesures.map((c) => c.temps_ms).filter((t): t is number => typeof t === "number");
  const tempsMoyen = temps.length ? Math.round(temps.reduce((a, b) => a + b, 0) / temps.length) : null;
  const dernier = mesures.reduce((max, c) => (c.verifie_le > max ? c.verifie_le : max), mesures[0].verifie_le);

  const heure = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dernier));

  const chiffres = [
    { valeur: String(sites), libelle: sites > 1 ? "sites clients surveillés" : "site client surveillé" },
    { valeur: "5 min", libelle: "entre deux contrôles, jour et nuit" },
    {
      valeur: `${disponibilite >= 99.95 ? "100" : disponibilite.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`,
      libelle: "de disponibilité sur 24 heures",
    },
    ...(tempsMoyen ? [{ valeur: `${tempsMoyen} ms`, libelle: "de temps de réponse moyen" }] : []),
  ];

  return (
    <section className="conteneur py-20 sm:py-28">
      <TitreSection
        surtitre="Supervision"
        titre="Les sites livrés ne sont pas laissés seuls"
        sousTitre="Un robot contrôle chaque site client toutes les cinq minutes : disponibilité, temps de réponse, certificat. Au moindre problème, je reçois une alerte avant que le client ne s'en aperçoive."
      />

      <Apparait className="mt-14">
        <dl className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {chiffres.map((chiffre) => (
            <div key={chiffre.libelle} className="bg-card p-6 sm:p-8">
              <dt className="sr-only">{chiffre.libelle}</dt>
              <dd>
                <span className="block text-3xl font-semibold tracking-tight text-primary tabular-nums sm:text-4xl">
                  {chiffre.valeur}
                </span>
                <span className="mt-2 block text-sm">{chiffre.libelle}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="inline-flex items-center gap-2">
            <span className="relative flex size-2.5" aria-hidden="true">
              <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
            </span>
            Mesures réelles, dernier contrôle à {heure}.
          </p>
          <Link
            href="/services/maintenance-supervision"
            className="group inline-flex items-center gap-1 font-medium text-bleu-700 dark:text-bleu-300"
          >
            L&apos;offre maintenance
            <ArrowRight
              className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Link>
        </div>
      </Apparait>
    </section>
  );
}
