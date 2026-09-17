"use client";

import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Loader2, Mail } from "lucide-react";
import * as React from "react";

import { clientNavigateur } from "@/lib/supabase/navigateur";
import { urlDeRetour } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";

const MESSAGES_ERREUR: Record<string, string> = {
  lien_invalide: "Ce lien de connexion n'est plus valide. Demandez-en un nouveau.",
  session_refusee: "La session n'a pas pu être ouverte. Réessayez.",
  access_denied: "La connexion a été annulée.",
};

/**
 * La connexion.
 *
 * Trois façons d'entrer, dans l'ordre de ce que les gens utilisent vraiment :
 * Google, GitHub, puis le lien magique par email. Pas de mot de passe — c'est
 * un compte que le client ouvrira trois fois dans sa vie, lui imposer un mot de
 * passe garantit qu'il l'aura oublié à la deuxième.
 */
export function FormulaireConnexion({
  fournisseurs = ["google", "github"],
}: {
  /**
   * Les fournisseurs OAuth activés dans Supabase, lus côté serveur. Un bouton
   * « Continuer avec Google » alors que Google n'est pas activé mènerait à une
   * page d'erreur de Supabase : on ne l'affiche pas.
   */
  fournisseurs?: ("google" | "github")[];
}) {
  const parametres = useSearchParams();
  const suite = parametres.get("suite") ?? "/compte";
  const erreurUrl = parametres.get("erreur");

  const [email, setEmail] = React.useState("");
  const [etat, setEtat] = React.useState<"inerte" | "envoi" | "envoye">("inerte");
  const [erreur, setErreur] = React.useState<string | null>(
    erreurUrl ? (MESSAGES_ERREUR[erreurUrl] ?? "La connexion a échoué.") : null,
  );

  const supabase = clientNavigateur();
  const indisponible = supabase === null;

  const redirection = urlDeRetour(`/auth/callback?suite=${encodeURIComponent(suite)}`);

  async function connexionOAuth(fournisseur: "google" | "github") {
    if (!supabase) return;
    setErreur(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: fournisseur,
      options: { redirectTo: redirection },
    });

    if (error) setErreur("Ce fournisseur n'a pas répondu. Réessayez.");
  }

  async function envoyerLien(evenement: React.FormEvent) {
    evenement.preventDefault();
    if (!supabase || etat === "envoi") return;

    setErreur(null);
    setEtat("envoi");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirection },
    });

    if (error) {
      setErreur("L'envoi a échoué. Vérifiez l'adresse et réessayez.");
      setEtat("inerte");
      return;
    }

    setEtat("envoye");
  }

  if (indisponible) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-6 text-sm leading-relaxed text-muted-foreground">
        La connexion n&apos;est pas encore active : le projet Supabase est en cours
        de création. En attendant, écrivez-moi à{" "}
        <a
          href="mailto:glm07rafael@gmail.com"
          className="font-medium text-foreground underline underline-offset-2"
        >
          glm07rafael@gmail.com
        </a>
        .
      </div>
    );
  }

  if (etat === "envoye") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-bleu-200 bg-bleu-50 p-7 text-center dark:border-bleu-800 dark:bg-bleu-950/40"
      >
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-5.5" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">Regardez vos mails</h2>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          Un lien de connexion vient de partir vers{" "}
          <span className="font-medium text-foreground">{email}</span>. Il est valable
          une heure.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {erreur && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {erreur}
        </p>
      )}

      {fournisseurs.length > 0 && (
        <>
          <div className="grid gap-3">
            {fournisseurs.includes("google") && (
              <BoutonFournisseur onClick={() => connexionOAuth("google")} nom="Google">
                <LogoGoogle />
              </BoutonFournisseur>
            )}
            {fournisseurs.includes("github") && (
              <BoutonFournisseur onClick={() => connexionOAuth("github")} nom="GitHub">
                <LogoGithub />
              </BoutonFournisseur>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs tracking-wide text-muted-foreground uppercase">ou</span>
            <span className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <form onSubmit={envoyerLien} className="space-y-3">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Votre email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(evenement) => setEmail(evenement.target.value)}
            placeholder="vous@entreprise.fr"
            className={cn(
              "h-12 w-full rounded-xl border border-input bg-background px-4 text-[15px]",
              "transition-[border-color,box-shadow] duration-150 ease-out",
              "placeholder:text-muted-foreground/70",
              "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
            )}
          />
        </div>

        <button
          type="submit"
          disabled={etat === "envoi"}
          className={cn(
            "group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl",
            "bg-primary text-[15px] font-medium text-primary-foreground",
            "transition-[background-color,scale,opacity] duration-150 ease-out",
            "hover:bg-bleu-700 active:scale-96 dark:hover:bg-bleu-400",
            "disabled:pointer-events-none disabled:opacity-70",
          )}
        >
          {etat === "envoi" ? (
            <>
              <Loader2 className="size-4 animate-spin" strokeWidth={2} aria-hidden="true" />
              Envoi…
            </>
          ) : (
            <>
              <Mail className="size-4" strokeWidth={1.75} aria-hidden="true" />
              Recevoir un lien de connexion
              <ArrowRight
                className="size-4 transition-[translate] duration-150 ease-out group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Pas de mot de passe à retenir. Le lien reçu par mail vous connecte
        directement.
      </p>
    </div>
  );
}

function BoutonFournisseur({
  onClick,
  nom,
  children,
}: {
  onClick: () => void;
  nom: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl",
        "border border-border bg-background text-[15px] font-medium",
        "transition-[background-color,border-color,scale] duration-150 ease-out",
        "hover:bg-secondary active:scale-96",
      )}
    >
      {children}
      Continuer avec {nom}
    </button>
  );
}

/* Les logos sont dessinés ici : Lucide a retiré les marques de sa version 1. */

function LogoGoogle() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.05l3.66 2.84C6.71 7.29 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function LogoGithub() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.24-.02-2.25-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.92 1.23 3.23 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}
