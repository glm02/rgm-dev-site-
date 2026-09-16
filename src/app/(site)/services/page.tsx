import type { Metadata } from "next";

import { AppelAction } from "@/components/sections/appel-action";
import { Services } from "@/components/sections/services";
import { metadonnees } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = metadonnees({
  titre: `Services — sites web et automatisation IA à ${SITE.ville}`,
  description:
    "Création de sites web, automatisation par agents IA et workflows n8n, maintenance et supervision. Développeur freelance à Lyon.",
  chemin: "/services",
});

export default function PageServices() {
  return (
    <>
      <div className="conteneur pt-14 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold sm:text-5xl">Services</h1>
          <p className="mt-5 text-lg leading-relaxed text-balance text-muted-foreground">
            Trois façons de travailler ensemble. Les deux premières créent quelque
            chose, la troisième fait qu&apos;il continue de tourner.
          </p>
        </div>
      </div>

      <Services />
      <AppelAction />
    </>
  );
}
