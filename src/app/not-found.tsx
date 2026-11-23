import Link from "next/link";

import { BoutonDegrade } from "@/components/rgm/bandeau";
import { LIENS } from "@/components/rgm/liens";
import { PageLegale } from "@/components/rgm/page-legale";
import { PiedDePage } from "@/components/rgm/pied-de-page";

export default function Introuvable() {
  return (
    <>
      <main>
        <PageLegale titre="404" sousTitre="Page introuvable." paysage="sommet-enneige" decalage={-169}>
          <div className="flex flex-wrap gap-4">
            <BoutonDegrade href="/" className="h-10 min-h-10 px-2.5 !text-white !no-underline">
              Retour à l’accueil
            </BoutonDegrade>
            <Link
              href={LIENS.services}
              className="inline-flex h-10 items-center rounded-[8px] border border-border bg-white px-2.5 text-xs font-medium !text-[#1a1a1a] !no-underline"
            >
              Voir les services
            </Link>
          </div>
        </PageLegale>
      </main>
      <PiedDePage />
    </>
  );
}
