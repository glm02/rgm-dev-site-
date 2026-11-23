import type { Metadata } from "next";
import Link from "next/link";

import { BandeauPaysage } from "@/components/rgm/bandeau";
import { FOND_TEXTURE } from "@/components/rgm/blocs-service";
import { LIENS } from "@/components/rgm/liens";
import { metadonnees } from "@/lib/seo";

export const metadata: Metadata = metadonnees({
  titre: "Méthode — de l'idée au premier résultat",
  description:
    "Comment se déroule un projet avec RGM Dev : appel de cadrage, devis, conception, développement, mise en service et suivi. Les outils utilisés au quotidien.",
  chemin: "/methode",
});

const ETAPES = [
  { titre: "L’appel de cadrage", texte: "Cadrer vos objectifs et vos besoins." },
  { titre: "Le devis", texte: "Valider le prix, le périmètre et le calendrier." },
  { titre: "La conception", texte: "Valider la structure et les maquettes." },
  { titre: "Le développement", texte: "Tester une version avant publication." },
  { titre: "La mise en service", texte: "Mettre en service et prendre en main l’outil." },
  { titre: "Après la livraison", texte: "Récupérer le code et la documentation." },
];

const AGENTS = [
  { nom: "Hermes", logo: "/figma/logos/hermes.png", texte: "Exécute vos tâches avec vos règles." },
  { nom: "OpenBot", logo: "/figma/logos/openbot.png", texte: "Coordonne plusieurs agents." },
];

const OUTILS: { nom: string; logo: string; texte: string; logoTexte?: string }[] = [
  { nom: "Next.js", logo: "/figma/logos/nextjs.svg", texte: "Sites rapides, accessibles et indexables." },
  { nom: "Supabase", logo: "/figma/logos/supabase.svg", texte: "Base PostgreSQL, connexions et droits d’accès.", logoTexte: "/figma/logos/postgresql.svg" },
  { nom: "Vercel", logo: "/figma/logos/vercel.svg", texte: "Déploiements et prévisualisations." },
  { nom: "n8n", logo: "/figma/logos/n8n.svg", texte: "Workflows et intégrations entre outils." },
  { nom: "Claude Code", logo: "/figma/logos/claude-code.svg", texte: "Lecture du code et développement assisté." },
  { nom: "GitHub", logo: "/figma/logos/github.svg", texte: "Historique, revue et automatisation." },
];

const USAGES = [
  {
    titre: "Agents IA",
    marques: [
      { nom: "Claude Code", logo: "/figma/logos/claude-code.svg" },
      { nom: "Codex", logo: "/figma/logos/codex.svg" },
      { nom: "Hermes", logo: "/figma/logos/hermes.png" },
    ],
  },
  {
    titre: "Intégrations",
    marques: [
      { nom: "Google Cloud", logo: "/figma/logos/google-cloud.svg" },
      { nom: "n8n", logo: "/figma/logos/n8n.svg" },
    ],
  },
];

const BOUTON = {
  backgroundImage:
    "url(/figma/images/texture-bouton.png), linear-gradient(145.7deg, #2244bb 8.1%, #2453cd 39.8%, #2460de 69.9%, #1d54d5 89.4%)",
  backgroundSize: "100px 100px, auto",
} as const;

const SECTION = "mx-auto flex w-full max-w-[1416px] flex-col gap-7 px-4 py-12 md:px-[108px] md:py-16";
const CARTE = "rounded-[16px] border border-border bg-white p-6";

function Logo({ src, taille }: { src: string; taille: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" width={taille} height={taille} className="shrink-0 object-contain" style={{ width: taille, height: taille }} />;
}

export default function PageMethode() {
  return (
    <>
      <BandeauPaysage paysage="chaine-alpine" decalage={-138} hauteur={350} hauteurMobile={290}>
        <div className="flex flex-col items-center gap-3 text-center text-white">
          <h1 className="font-marqueur text-[56px] leading-[1.05] md:text-[87px]">Méthode</h1>
          <p className="text-base leading-[1.2] md:text-[18px]">De l’idée au premier résultat.</p>
        </div>
      </BandeauPaysage>

      <section className={SECTION}>
        <h2 className="text-[24px] font-semibold">Les étapes du projet</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {ETAPES.map((e, i) => (
            <li key={e.titre} className={`${CARTE} flex flex-col gap-2.5`}>
              <span className="text-[13px] font-semibold">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-[22px] font-semibold">{e.titre}</h3>
              <p className="text-[15px]">{e.texte}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className="px-2 md:px-3">
        <section className={`${SECTION} items-start rounded-[24px]`} style={FOND_TEXTURE}>
          <h2 className="text-[24px] font-semibold">Ce que vous avez à la fin</h2>
          <p className="-mt-4 text-sm">Le site en ligne, le code source, un back-office et une documentation.</p>
          <Link href={LIENS.contact} className="inline-flex h-10 items-center rounded-[8px] px-2.5 text-sm font-medium text-white transition-transform duration-150 active:scale-[0.97] motion-reduce:transform-none max-md:min-h-11" style={BOUTON}>
            Demander un devis
          </Link>
        </section>
      </div>

      <div className="px-2 pt-3 md:px-3">
        <section className={`${SECTION} rounded-[24px] md:pt-[60px]`} style={FOND_TEXTURE}>
          <h2 className="text-[24px] font-semibold">Agents, automatisation et web</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {AGENTS.map((a) => (
              <div key={a.nom} className="flex flex-col gap-2 rounded-[16px] border border-border bg-[#f4f6fd] p-[22px]">
                <span className="overflow-hidden rounded-[4px]">
                  <Logo src={a.logo} taille={24} />
                </span>
                <h3 className="text-[22px] font-semibold">{a.nom}</h3>
                <p className="text-[15px]">{a.texte}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {OUTILS.map((o) => (
              <div key={o.nom} className={`${CARTE} flex flex-col gap-4`}>
                <span className="flex items-center gap-3 text-[18px] font-semibold">
                  <Logo src={o.logo} taille={24} />
                  {o.nom}
                </span>
                <p className="flex items-start gap-[5px] text-[15px]">
                  {o.logoTexte ? (
                    <span className="pt-0.5">
                      <Logo src={o.logoTexte} taille={17} />
                    </span>
                  ) : null}
                  {o.texte}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className={SECTION}>
        <h2 className="text-[24px] font-semibold">Comment je les utilise</h2>
        <p className="-mt-4 text-sm">Prototyper, tester et documenter.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {USAGES.map((u) => (
            <div key={u.titre} className={`${CARTE} flex flex-col gap-4`}>
              <h3 className="text-[18px] font-semibold">{u.titre}</h3>
              <div className="flex flex-wrap gap-[9px]">
                {u.marques.map((m) => (
                  <span key={m.nom} className="flex items-center gap-[5px] text-xs font-medium">
                    <Logo src={m.logo} taille={14} />
                    {m.nom}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Link href={LIENS.contact} className="inline-flex h-10 w-fit items-center rounded-[8px] px-2.5 text-xs font-medium text-white transition-transform duration-150 active:scale-[0.97] motion-reduce:transform-none max-md:min-h-11" style={BOUTON}>
          Demander un devis
        </Link>
      </section>
    </>
  );
}
