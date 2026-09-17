"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

const VARIANTES = {
  principal:
    "bg-primary text-primary-foreground hover:bg-bleu-700 dark:hover:bg-bleu-400",
  secondaire: "border border-border bg-background hover:bg-secondary",
  discret: "text-muted-foreground hover:bg-secondary hover:text-foreground",
  danger: "text-destructive hover:bg-destructive/10",
} as const;

/**
 * Le bouton d'envoi d'un formulaire admin.
 *
 * `useFormStatus` lit l'état du `<form>` parent : pas de prop à faire
 * descendre, et le bouton se désactive pendant l'envoi — ce qui évite le
 * double clic qui créerait deux fois la même offre.
 */
export function BoutonEnvoyer({
  children,
  variante = "principal",
  taille = "normal",
  confirmation,
  className,
  ...props
}: {
  children: React.ReactNode;
  variante?: keyof typeof VARIANTES;
  taille?: "petit" | "normal";
  /** Si présent, demande une confirmation avant l'envoi (suppressions). */
  confirmation?: string;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children">) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(evenement) => {
        if (confirmation && !window.confirm(confirmation)) evenement.preventDefault();
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap",
        "transition-[background-color,color,scale,opacity] duration-150 ease-out active:scale-96",
        "disabled:pointer-events-none disabled:opacity-60",
        taille === "petit" ? "h-8 px-2.5 text-xs" : "h-10 px-4 text-sm",
        VARIANTES[variante],
        className,
      )}
      {...props}
    >
      {pending && <Loader2 className="size-3.5 animate-spin" strokeWidth={2} aria-hidden="true" />}
      {children}
    </button>
  );
}
