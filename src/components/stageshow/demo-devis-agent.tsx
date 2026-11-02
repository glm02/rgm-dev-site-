"use client";

import { Bar, Check, Connector, Count, Icon, Roll, Stage, Swap, type Act } from "./kit";
import "./demo-devis-agent.css";

/**
 * Une automatisation racontée en une dizaine de secondes : une demande de
 * devis arrive, l'agent en extrait le besoin, prépare le devis chiffré, et il
 * ne reste qu'à valider.
 *
 * Construite avec le kit Stageshow (MIT, Benji Taylor) en partant de son
 * exemple de référence `payout-flow` : même scène sans curseur, mêmes
 * arrivées qui se chevauchent, même fin qui reste à l'écran. Jouée une seule
 * fois à l'entrée dans l'écran ; avec `prefers-reduced-motion`, seule l'image
 * finale (`poster`) est affichée.
 *
 * Peu de vrais mots : seulement ce que l'histoire raconte. Le reste est en
 * barres neutres, pour que l'œil aille au devis.
 */

type S = { etape: number; envoye: boolean };
const DEPART: S = { etape: 0, envoye: false };

const CHAMPS = [
  { libelle: "Besoin", valeur: "Site vitrine + devis en ligne" },
  { libelle: "Délai", valeur: "6 semaines" },
  { libelle: "Budget", valeur: "2 000 – 3 000 €" },
];

const script = async (a: Act<S>) => {
  await a.wait(300);
  a.mark("arrivee");
  a.put({ etape: 1 }); // la demande arrive
  await a.wait(900);
  a.put({ etape: 2 }); // l'agent en extrait les champs, l'un après l'autre
  await a.wait(1600);
  a.mark("devis");
  a.put({ etape: 3 }); // la demande glisse de côté, le devis arrive
  await a.wait(1300);
  a.put({ etape: 4 }); // le trait relie la demande au devis
  await a.wait(1200);
  a.mark("envoi");
  a.put({ etape: 5 }); // validation
  await a.wait(1200);
  a.put({ envoye: true });
  await a.wait(500);
  a.put({ etape: 6 }); // la note finale
};

export function DemoDevisAgent() {
  return (
    <Stage<S>
      width={640}
      height={400}
      compact={{ below: 480, width: 358, height: 650 }}
      initial={DEPART}
      play="once"
      poster={{ etape: 6, envoye: true }}
      script={script}
      className="dda"
    >
      {(s, rect, layout) => {
        const compact = layout === "compact";
        const source = rect("champ-0");
        const devis = rect("devis");
        return (
          <>
            <div className="dda-halo" />

            <section
              className="dda-demande"
              data-in={s.etape >= 1 || undefined}
              data-cote={s.etape >= 3 || undefined}
            >
              <div className="dda-tete">
                <span className="dda-pastille">
                  <Icon name="mail" size={14} />
                </span>
                <span className="dda-fort">Nouvelle demande de devis</span>
              </div>
              <Bar w={180} h={5} tone={2} />
              <Bar w={140} h={5} tone={2} />
              <div className="dda-sous-titre">
                <span className="dda-fort">Lu par l&apos;agent</span>
                <Bar w={40} h={5} tone={2} />
              </div>
              {CHAMPS.map((champ, i) => (
                <div
                  key={champ.libelle}
                  className="dda-champ"
                  data-target={`champ-${i}`}
                  data-in={s.etape >= 2 || undefined}
                  style={{ transitionDelay: s.etape >= 2 ? `${i * 120}ms` : "0ms" }}
                >
                  <span className="dda-libelle">{champ.libelle}</span>
                  <span className="dda-valeur">{champ.valeur}</span>
                </div>
              ))}
            </section>

            <section className="dda-devis" data-target="devis" data-in={s.etape >= 3 || undefined}>
              <div className="dda-tete" style={{ ["--i" as string]: 0 }}>
                <span className="dda-pastille dda-pastille--bleu">
                  <Icon name="file" size={14} />
                </span>
                <span className="dda-fort">Devis préparé</span>
              </div>
              <Count
                className="dda-montant"
                style={{ ["--i" as string]: 1 }}
                value={s.etape >= 3 ? 2400 : 0}
                duration={1300}
                format={euros}
              />
              <div className="dda-lignes" style={{ ["--i" as string]: 2 }}>
                <div className="dda-ligne">
                  <Bar w={90} h={5} tone={3} />
                  <span>1 800 €</span>
                </div>
                <div className="dda-ligne">
                  <Bar w={70} h={5} tone={3} />
                  <span>600 €</span>
                </div>
              </div>
              <div className="dda-bouton" style={{ ["--i" as string]: 3 }} data-envoye={s.envoye || undefined}>
                <span className="dda-etat" data-on={s.etape < 5 || undefined}>
                  Valider et envoyer
                </span>
                <span className="dda-etat" data-on={s.etape >= 5 || undefined}>
                  <Check on={s.envoye} pending={!s.envoye} size={14} />
                  <Swap id={s.envoye ? "envoye" : "envoi"}>{s.envoye ? "Envoyé" : "Envoi"}</Swap>
                </span>
              </div>
              <span className="dda-statut" style={{ ["--i" as string]: 4 }}>
                <Roll variant="fade">{s.envoye ? "Client prévenu par e-mail" : "En attente de votre accord"}</Roll>
              </span>
            </section>

            {source.width > 0 && devis.width > 0 && (
              <Connector
                show={s.etape >= 4}
                from={{
                  x: compact ? source.x - 6 : source.x + source.width + 6,
                  y: source.y + source.height / 2,
                }}
                to={{ x: devis.x, y: compact ? devis.y + 24 : source.y + source.height / 2 }}
                route={compact ? "v" : "straight"}
              />
            )}

            <div
              className="dda-note"
              data-in={s.etape >= 6 || undefined}
              style={{ left: devis.x, top: devis.y + devis.height + 16 }}
            >
              Préparé en 40 secondes
            </div>
          </>
        );
      }}
    </Stage>
  );
}

const euros = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} €`;
