import type { Metadata } from "next";
import Link from "next/link";

import { BandeauPaysage, TitreHero } from "@/components/rgm/bandeau";
import { AppelProjet, CARTE_PLATE, ColonnePage, ListeCoches } from "@/components/rgm/blocs-service";
import type { NomIcone } from "@/components/rgm/icones";
import { LIENS } from "@/components/rgm/liens";
import { TuileIcone } from "@/components/rgm/primitives";
import { metadonnees } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = metadonnees({
  titre: `Services — sites web et automatisation IA à ${SITE.ville}`,
  description:
    "Création de sites web, automatisation par agents IA et workflows n8n, maintenance et supervision. Développeur freelance à Lyon.",
  chemin: "/services",
});

const SERVICES: { icone: NomIcone; titre: string; texte: string; inclus: string[]; lien: string; bouton: string }[] = [
  {
    icone: "discovery",
    titre: "Sites web",
    texte: "Un site rapide qui transforme les visites en demandes.",
    inclus: ["Site vitrine et e-commerce", "Application métier et espace client", "Refonte et référencement local"],
    lien: LIENS.sitesWeb,
    bouton: "Découvrir les sites web",
  },
  {
    icone: "workflow",
    titre: "Automatisation IA",
    texte: "Agents et workflows reliés à vos outils.",
    inclus: ["Audit de vos processus", "Workflows n8n et agents Hermes", "Intégrations et validation humaine"],
    lien: LIENS.automatisation,
    bouton: "Découvrir l’automatisation IA",
  },
];

export default function PageServices() {
  return (
    <>
      <BandeauPaysage paysage="montagnes" decalage={-66} hauteur={380} hauteurMobile={320}>
        <TitreHero debut="Services" sousTitre="Sites web et automatisation IA, sur mesure." />
      </BandeauPaysage>
      <ColonnePage className="md:pt-20">
        <div className="flex flex-col gap-4 md:flex-row md:gap-6 md:pb-14">
          {SERVICES.map((s) => (
            <div key={s.titre} className={`${CARTE_PLATE} flex flex-1 flex-col items-start gap-4 p-7`}>
              <TuileIcone nom={s.icone} />
              <h2 className="text-[26px] leading-[1.4] font-bold md:text-[32px]">{s.titre}</h2>
              <p className="text-base leading-[1.4]">{s.texte}</p>
              <ListeCoches items={s.inclus} />
              <Link href={s.lien} className="inline-flex h-11 items-center rounded-[8px] border border-border bg-white px-4 text-sm font-medium">
                {s.bouton}
              </Link>
            </div>
          ))}
        </div>
        <AppelProjet />
      </ColonnePage>
    </>
  );
}
