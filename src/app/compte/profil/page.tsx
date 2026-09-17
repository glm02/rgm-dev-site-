import { EntetePage, Panneau } from "@/components/espace/entete-page";
import { FormulaireProfil } from "@/components/espace/formulaire-profil";
import { sessionOuRedirection } from "@/lib/auth";
import { dateLongue } from "@/lib/format";

export default async function PageProfil() {
  const session = await sessionOuRedirection("/compte/profil");
  if (!session) return null;

  const { profil } = session;

  return (
    <>
      <EntetePage
        titre="Mon profil"
        description="Les coordonnées que RGM Dev utilise pour vous joindre au sujet de vos projets."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Panneau>
          <FormulaireProfil profil={profil} />
        </Panneau>

        <Panneau titre="Votre compte">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Type de compte</dt>
              <dd className="mt-0.5 font-medium">{profil.role === "admin" ? "Administrateur" : "Client"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Membre depuis</dt>
              <dd className="mt-0.5 font-medium">{dateLongue(profil.cree_le)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Vos données</dt>
              <dd className="mt-0.5 leading-relaxed">
                Pour obtenir une copie ou demander la suppression de votre compte, écrivez à{" "}
                <a href="mailto:glm07rafael@gmail.com" className="font-medium text-bleu-700 underline underline-offset-4 dark:text-bleu-300">
                  glm07rafael@gmail.com
                </a>
                .
              </dd>
            </div>
          </dl>
        </Panneau>
      </div>
    </>
  );
}
