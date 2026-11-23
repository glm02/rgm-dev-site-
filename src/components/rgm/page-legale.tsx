import { BandeauPaysage, type NomPaysage } from "./bandeau";

/** Gabarit des pages Mentions légales, Confidentialité et 404 (hero court, colonne de 760). */
export function PageLegale({
  titre,
  sousTitre,
  paysage,
  decalage,
  children,
}: {
  titre: string;
  sousTitre?: string;
  paysage: NomPaysage;
  decalage: number;
  children: React.ReactNode;
}) {
  return (
    <>
      <BandeauPaysage paysage={paysage} decalage={decalage} hauteur={282} hauteurMobile={224}>
        <div className="flex flex-col items-center gap-3 text-center text-white">
          <h1 className="font-titre text-[44px] leading-[1.05] font-bold tracking-[-1.76px] md:text-[96px] md:tracking-[-3.84px]">{titre}</h1>
          {sousTitre ? <p className="text-base leading-[1.2] md:text-[18px]">{sousTitre}</p> : null}
        </div>
      </BandeauPaysage>
      <div className="mx-auto w-full max-w-[1416px] px-4 py-12 md:px-[108px] md:py-16">
        <div className="flex max-w-[760px] flex-col gap-7 text-base [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_h2]:text-[22px] [&_h2]:font-semibold md:[&_h2]:text-[24px]">
          {children}
        </div>
      </div>
    </>
  );
}
