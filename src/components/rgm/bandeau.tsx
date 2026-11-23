import Image from "next/image";
import { cn } from "cn";
import { Navigation } from "./navigation";

const IMAGES = {
  nuages: "/figma/images/nuages.webp",
  montagnes: "/figma/images/montagnes.webp",
  sommets: "/figma/images/sommets.webp",
} as const;

/**
 * Carte visuelle du haut de page : image arrondie, navigation posée dessus,
 * contenu centré. Reprend les cadres « Hero » de Figma (marge 12, rayon 24).
 */
export function Bandeau({
  image = "nuages",
  cadrage,
  position = "center",
  children,
  className,
  hauteur = "page",
}: {
  image?: keyof typeof IMAGES;
  /** Recadrage Figma (mode CROP) traduit en background-size / background-position. */
  cadrage?: Record<"desktop" | "mobile", { taille: string; position: string }>;
  position?: string;
  children?: React.ReactNode;
  className?: string;
  hauteur?: "accueil" | "page";
}) {
  return (
    <div className="px-2 pt-2 md:px-3 md:pt-3">
      <header
        className={cn(
          "relative flex flex-col items-center overflow-hidden rounded-[20px] px-4 pt-4 pb-6 md:rounded-[24px] md:px-8 md:pt-6 md:pb-12",
          hauteur === "accueil"
            ? "min-h-[680px] md:min-h-[760px]"
            : "min-h-[290px] md:min-h-[350px]",
          className,
        )}
      >
        {cadrage ? (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-no-repeat md:hidden"
              style={{
                backgroundImage: `url(${IMAGES[image]})`,
                backgroundSize: cadrage.mobile.taille,
                backgroundPosition: cadrage.mobile.position,
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden bg-no-repeat md:block"
              style={{
                backgroundImage: `url(${IMAGES[image]})`,
                backgroundSize: cadrage.desktop.taille,
                backgroundPosition: cadrage.desktop.position,
              }}
            />
          </>
        ) : (
          <Image
            src={IMAGES[image]}
            alt=""
            fill
            priority
            sizes="100vw"
            className="pointer-events-none object-cover"
            style={{ objectPosition: position }}
          />
        )}
        <Navigation />
        <div className="rgm-entree relative z-10 flex w-full flex-1 flex-col items-center">
          {children}
        </div>
      </header>
    </div>
  );
}

/** Titre blanc d'une page intérieure, dernier mot en Permanent Marker. */
export function TitreBandeau({
  debut,
  marqueur,
  sousTitre,
}: {
  debut?: string;
  marqueur: string;
  sousTitre?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 pt-10 text-center text-white md:pt-16">
      <h1 className="text-[40px] leading-[1.04] font-bold tracking-[-1.6px] md:text-[72px] md:tracking-[-2.88px]">
        {debut ? <>{debut} </> : null}
        <span className="font-marqueur font-normal tracking-normal">
          {marqueur}
        </span>
      </h1>
      {sousTitre ? (
        <p className="max-w-[560px] text-[15px] font-medium md:text-base">
          {sousTitre}
        </p>
      ) : null}
    </div>
  );
}

const PAYSAGES = {
  montagnes: {
    image: "/figma/images/montagnes.webp",
    taille: "cover",
    y: "50%",
    ratio: 2.357,
  },
  nuages: {
    image: "/figma/images/nuages.webp",
    taille: "cover",
    y: "50%",
    ratio: 2.357,
  },
  "sommet-et-nuages": {
    image: "/figma/images/sommets.webp",
    taille: "100% 303.8%",
    y: "0%",
    ratio: 2.265,
  },
  "chaine-alpine": {
    image: "/figma/images/sommets.webp",
    taille: "100% 303.8%",
    y: "50.1%",
    ratio: 2.265,
  },
  "sommet-enneige": {
    image: "/figma/images/sommets.webp",
    taille: "100% 303.8%",
    y: "100%",
    ratio: 2.265,
  },
} as const;

export type NomPaysage = keyof typeof PAYSAGES;

const VOILES = {
  sombre:
    "linear-gradient(180deg, rgba(4,14,64,0.56) 0%, rgba(4,14,64,0.4) 27%, rgba(4,14,64,0.54) 49%, rgba(4,14,64,0.24) 71%, rgba(4,14,64,0.03) 100%)",
  clair:
    "linear-gradient(180deg, rgba(23,60,188,0.35) 0%, rgba(23,60,188,0.24) 27%, rgba(23,60,188,0.44) 49%, rgba(23,60,188,0.13) 71%, rgba(23,60,188,0) 100%)",
} as const;

/**
 * Haut de page intérieur (cadres « Hero · … » de Figma) : un paysage recadré
 * comme dans le composant « Paysage de couverture », sous un voile bleu.
 * `decalage` reprend le y du paysage dans Figma (desktop, en px).
 */
export function BandeauPaysage({
  paysage,
  decalage,
  hauteur,
  hauteurMobile,
  voile = "sombre",
  children,
}: {
  paysage: NomPaysage;
  voile?: keyof typeof VOILES;
  decalage: number;
  hauteur: number;
  hauteurMobile: number;
  children?: React.ReactNode;
}) {
  const p = PAYSAGES[paysage];
  const fond = {
    backgroundImage: `url(${p.image})`,
    backgroundSize: p.taille,
    backgroundPosition: `50% ${p.y}`,
    backgroundRepeat: "no-repeat",
  } as const;
  return (
    <div className="px-2 pt-2 md:px-3 md:pt-3">
      <header
        className="relative flex flex-col items-center overflow-hidden rounded-[20px] bg-[#040e40] px-4 pt-4 md:rounded-[24px] md:px-8 md:pt-6"
        style={{
          ["--h-d" as string]: `${hauteur}px`,
          ["--h-m" as string]: `${hauteurMobile}px`,
        }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute top-0 left-1/2 h-full -translate-x-1/2 md:hidden"
            style={{ ...fond, aspectRatio: String(p.ratio) }}
          />
          <div
            className="absolute left-0 hidden w-full md:block"
            style={{ ...fond, top: decalage, aspectRatio: String(p.ratio) }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                VOILES[voile],
            }}
          />
        </div>
        <Navigation />
        <div className="rgm-entree relative z-10 flex h-[calc(var(--h-m)-52px)] w-full flex-col items-center justify-center md:h-[calc(var(--h-d)-72px)]">
          {children}
        </div>
      </header>
    </div>
  );
}

/** Bouton bleu dégradé avec texture (« Demander un devis » des pages intérieures). */
export function BoutonDegrade({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex h-11 min-h-11 items-center justify-center rounded-[8px] px-4 text-sm font-medium text-white transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.97] motion-reduce:transform-none",
        className,
      )}
      style={{
        backgroundImage:
          "url(/figma/images/texture-bouton.png), radial-gradient(ellipse 72px 15px at 82% 17%, rgba(112,167,255,0.12), rgba(112,167,255,0.05) 49%, rgba(112,167,255,0) 100%), linear-gradient(145.7deg, #2244bb 8.1%, #2453cd 39.8%, #2460de 69.9%, #1d54d5 89.4%)",
        backgroundSize: "100px 100px, auto, auto",
      }}
    >
      {children}
    </a>
  );
}

/** Titre de héros intérieur (SF Pro, dernier mot en Permanent Marker) et sous-titre. */
export function TitreHero({
  debut,
  marqueur,
  sousTitre,
  taille = 96,
  tailleMarqueur = 87,
  marqueurALaLigne,
  children,
}: {
  debut?: string;
  marqueur?: string;
  sousTitre?: string;
  taille?: number;
  tailleMarqueur?: number;
  marqueurALaLigne?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex w-full max-w-[1050px] flex-col items-center gap-3 text-center text-white">
      <h1
        className="font-titre font-bold leading-[1.05] text-[44px] md:text-[length:var(--t)]"
        style={{
          ["--t" as string]: `${taille}px`,
          letterSpacing: `${-taille * 0.04}px`,
        }}
      >
        {debut ? <>{debut} </> : null}
        {marqueur ? (
          <span
            className={cn(
              "font-marqueur font-normal tracking-normal text-[40px] md:text-[length:var(--tm)]",
              marqueurALaLigne && "block pt-2 md:pt-3",
            )}
            style={{ ["--tm" as string]: `${tailleMarqueur}px` }}
          >
            {marqueur}
          </span>
        ) : null}
      </h1>
      {sousTitre ? (
        <p className="text-[16px] leading-[1.2] md:text-[18px]">{sousTitre}</p>
      ) : null}
      {children}
    </div>
  );
}
