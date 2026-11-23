import Link from "next/link";
import { COLONNES_PIED } from "./liens";

/** Composant Figma « Pied de page / Desktop » et « / Mobile ». */
export function PiedDePage() {
  return (
    <footer className="mx-auto w-full max-w-[1416px] border-t border-border bg-white px-4 pt-10 pb-6 md:px-[108px] md:pt-16 md:pb-8">
      <div className="flex flex-col gap-7 md:flex-row md:gap-12">
        <div className="flex flex-col gap-2.5 md:flex-1">
          <span className="text-[20px] font-bold tracking-[-0.6px] text-foreground">RGM DEV</span>
          <p className="text-sm text-foreground">Sites web et agents IA, à Lyon.</p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 md:flex md:gap-14">
          {COLONNES_PIED.map((c) => (
            <div key={c.titre} className="flex flex-col gap-3 max-md:gap-0">
              <span className="text-[13px] font-semibold text-foreground">{c.titre}</span>
              {c.liens.map((l) => (
                <Link key={l.libelle} href={l.href} className="inline-flex items-center text-sm text-foreground hover:underline max-md:min-h-11">
                  {l.libelle}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex justify-between border-t border-border pt-5 text-[13px] text-foreground md:mt-14">
        <span>© 2026 RGM Dev</span>
        <span>Lyon · Auvergne-Rhône-Alpes</span>
      </div>
    </footer>
  );
}
