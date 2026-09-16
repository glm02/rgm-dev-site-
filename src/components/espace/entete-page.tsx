import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** L'entête d'une page d'espace : retour éventuel, titre, description, actions. */
export function EntetePage({
  titre,
  description,
  retour,
  actions,
}: {
  titre: React.ReactNode;
  description?: React.ReactNode;
  retour?: { href: string; libelle: string };
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-8">
      {retour && (
        <Link
          href={retour.href}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
          {retour.libelle}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold sm:text-3xl">{titre}</h1>
          {description && (
            <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}

/** Un bloc blanc sur le fond légèrement teinté des espaces. */
export function Panneau({
  titre,
  actions,
  children,
  className,
}: {
  titre?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-border bg-card ${className ?? ""}`}>
      {(titre || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          {titre && <h2 className="font-semibold">{titre}</h2>}
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

/** L'état vide d'une liste : il dit pourquoi c'est vide, et quoi faire. */
export function EtatVide({
  titre,
  texte,
  action,
}: {
  titre: string;
  texte: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
      <h2 className="font-semibold">{titre}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {texte}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Affiché quand Supabase n'est pas encore branché. */
export function EspaceIndisponible() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">Espace en préparation</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          La base de données n&apos;est pas encore branchée : cet espace s&apos;ouvrira
          dès que le projet Supabase sera configuré.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-[background-color,scale] duration-150 ease-out hover:bg-bleu-700 active:scale-96"
        >
          Retour au site
        </Link>
      </div>
    </main>
  );
}
