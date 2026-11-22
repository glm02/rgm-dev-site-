import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/commun/json-ld";
import { BandeauPaysage, BoutonDegrade, TitreHero, type NomPaysage } from "@/components/rgm/bandeau";
import {
  AppelBesoin,
  CarteFaq,
  ColonnePage,
  ExempleEtBudget,
  Marqueur,
  ParcoursDevis,
  Prestations,
  type Prestation,
} from "@/components/rgm/blocs-service";
import { LIENS } from "@/components/rgm/liens";
import { Logo } from "@/components/rgm/primitives";
import { listerOffres, listerServices, serviceParSlug } from "@/lib/donnees";
import { jsonLdFilAriane, jsonLdService, metadonnees } from "@/lib/seo";

type ContenuService = {
  paysage: NomPaysage;
  decalage: number;
  hauteur: number;
  hauteurMobile: number;
  hero: { debut?: string; marqueur: string; sousTitre: string; taille?: number; tailleMarqueur?: number; aLaLigne?: boolean; logos?: string[] };
  parcours?: boolean;
  titrePrestations: React.ReactNode;
  prestations: Prestation[];
  exemple: string;
  budget: { libelle: string; prix: string };
  faq: { q: string; r: string }[];
  appel: { texte: string; avecPaysage?: boolean };
};

const CONTENUS: Record<string, ContenuService> = {
  "sites-web": {
    paysage: "chaine-alpine",
    decalage: -130,
    hauteur: 365,
    hauteurMobile: 310,
    hero: { debut: "Sites", marqueur: "web", sousTitre: "Vitrine, e-commerce et refonte." },
    titrePrestations: "Ce que vous pouvez mettre en place",
    prestations: [
      { visuel: { icone: "category" }, titre: "Site vitrine", texte: "Présentez vos services et recevez vos demandes de devis." },
      { visuel: { icone: "category" }, titre: "Site sur mesure", texte: "Ajoutez une réservation, un catalogue ou un espace client." },
      { visuel: { icone: "workflow" }, titre: "Refonte", texte: "Améliorez l’expérience mobile, la vitesse et le référencement." },
    ],
    exemple: "Un site par métier et un outil de suivi des demandes de devis.",
    budget: { libelle: "Site vitrine · 2 à 3 semaines", prix: "1 500 à 3 000 €" },
    faq: [
      { q: "Pourrai-je modifier le site ?", r: "Oui. Vous modifiez vos contenus depuis le back-office." },
      { q: "Le référencement est-il prévu ?", r: "Oui. Le référencement local est travaillé dès la structure du site." },
      { q: "Que se passe-t-il après la mise en ligne ?", r: "Un forfait peut couvrir la surveillance, les sauvegardes et les mises à jour." },
    ],
    appel: { texte: "Présentez votre activité et les fonctions attendues." },
  },
  "automatisation-ia": {
    paysage: "sommet-et-nuages",
    decalage: -78,
    hauteur: 470,
    hauteurMobile: 405,
    hero: {
      debut: "Automatisation",
      marqueur: "Agents IA",
      sousTitre: "Un agent sur mesure, connecté à vos outils.",
      tailleMarqueur: 69,
      aLaLigne: true,
      logos: ["/figma/logos/hermes.png", "/figma/logos/openbot.png", "/figma/logos/n8n.svg"],
    },
    parcours: true,
    titrePrestations: (
      <>
        <Marqueur>Agents</Marqueur>, workflows et audit
      </>
    ),
    prestations: [
      { visuel: { logos: ["/figma/logos/hermes.png", "/figma/logos/openbot.png"] }, titre: "Agent sur mesure", texte: "Hermes ou OpenBot, avec vos règles." },
      { visuel: { logos: ["/figma/logos/n8n.svg"] }, titre: "Workflow n8n", texte: "Reliez vos outils et automatisez leurs échanges." },
      { visuel: { icone: "search" }, titre: "Audit des tâches", texte: "Repérez les tâches à déléguer." },
    ],
    exemple: "Devis, planning et relances.",
    budget: { libelle: "Audit d’automatisation · 1 semaine", prix: "600 à 900 €" },
    faq: [
      { q: "Par quoi commence-t-on ?", r: "Par un audit des tâches répétitives et du temps qu’elles prennent." },
      { q: "L’agent peut-il utiliser mes outils ?", r: "Oui, selon les accès et intégrations que vous autorisez." },
      { q: "Puis-je valider les actions sensibles ?", r: "Oui. Une validation peut précéder l’envoi d’un devis ou d’un message." },
    ],
    appel: { texte: "Quelle tâche voulez-vous déléguer ?", avecPaysage: true },
  },
};

export async function generateStaticParams() {
  const services = await listerServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = await serviceParSlug(slug);
  if (!service) return metadonnees({ titre: "Service introuvable", description: "", chemin: `/services/${slug}`, horsIndex: true });
  return metadonnees({
    titre: service.seo_titre ?? service.titre,
    description: service.seo_description ?? service.accroche,
    chemin: `/services/${service.slug}`,
  });
}

export default async function PageService({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = await serviceParSlug(slug);
  if (!service) notFound();

  const offres = (await listerOffres()).filter((offre) => offre.service_id === service.id);
  const etapes = [
    { nom: "Accueil", href: "/" },
    { nom: "Services", href: "/services" },
    { nom: service.titre, href: `/services/${service.slug}` },
  ];

  const c: ContenuService = CONTENUS[slug] ?? {
    paysage: "montagnes",
    decalage: -66,
    hauteur: 380,
    hauteurMobile: 320,
    hero: { marqueur: service.titre, sousTitre: service.accroche },
    titrePrestations: "Les formules",
    prestations: offres.slice(0, 3).map((o) => ({ visuel: { icone: "shield" }, titre: o.nom, texte: o.description ?? "" })),
    exemple: "Un site surveillé, sauvegardé et mis à jour.",
    budget: { libelle: offres[0]?.nom ?? service.titre, prix: offres[0] ? `${offres[0].prix_min} à ${offres[0].prix_max} €` : "Sur devis" },
    faq: [],
    appel: { texte: "Présentez votre activité et les fonctions attendues." },
  };

  return (
    <>
      <JsonLd donnees={jsonLdService(service, offres)} />
      <JsonLd donnees={jsonLdFilAriane(etapes)} />
      {c.faq.length > 0 ? (
        <JsonLd
          donnees={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.r } })),
          }}
        />
      ) : null}

      <BandeauPaysage paysage={c.paysage} decalage={c.decalage} hauteur={c.hauteur} hauteurMobile={c.hauteurMobile}>
        <TitreHero
          debut={c.hero.debut}
          marqueur={c.hero.marqueur}
          sousTitre={c.hero.sousTitre}
          taille={c.hero.taille}
          tailleMarqueur={c.hero.tailleMarqueur}
          marqueurALaLigne={c.hero.aLaLigne}
        >
          <BoutonDegrade href={`${LIENS.contact}?service=${encodeURIComponent(service.titre)}`} className="mt-3">
            Demander un devis
          </BoutonDegrade>
          {c.hero.logos ? (
            <div className="flex gap-2">
              {c.hero.logos.map((l) => (
                <span key={l} className="flex size-8 items-center justify-center rounded-[8px] bg-white">
                  <Logo src={l} taille={20} className="object-contain" />
                </span>
              ))}
            </div>
          ) : null}
        </TitreHero>
      </BandeauPaysage>

      <ColonnePage>
        {c.parcours ? <ParcoursDevis /> : null}
        <Prestations titre={c.titrePrestations} items={c.prestations} />
        <ExempleEtBudget exemple={c.exemple} lienExemple={`${LIENS.realisations}/atout-travaux`} libelleBudget={c.budget.libelle} prix={c.budget.prix} />
        {c.faq.length > 0 ? <CarteFaq questions={c.faq} /> : null}
        <AppelBesoin texte={c.appel.texte} avecPaysage={c.appel.avecPaysage} />
      </ColonnePage>
    </>
  );
}
