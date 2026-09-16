"use client";

import { Loader2, SendHorizontal } from "lucide-react";
import * as React from "react";

import { envoyerMessage } from "@/lib/actions/compte";
import { depuis } from "@/lib/format";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * La conversation d'un projet, partagée par l'espace client et l'admin.
 *
 * Les messages de l'utilisateur connecté sont à droite, en bleu ; ceux de
 * l'autre partie à gauche. Aucune bibliothèque de chat : une liste et un
 * formulaire suffisent pour quelques échanges par semaine.
 */
export function Conversation({
  missionId,
  messages,
  moiId,
  nomAutre,
}: {
  missionId: string;
  messages: Message[];
  moiId: string;
  /** Comment afficher l'autre partie : « RGM Dev » côté client, le nom du client côté admin. */
  nomAutre: string;
}) {
  const [etat, action, enCours] = React.useActionState(envoyerMessage, { statut: "inerte" });
  const formulaire = React.useRef<HTMLFormElement>(null);
  const fin = React.useRef<HTMLDivElement>(null);

  // Vider le champ une fois le message parti — et seulement à ce moment-là :
  // en cas d'échec, le texte doit rester pour être renvoyé.
  React.useEffect(() => {
    if (etat.statut === "succes") formulaire.current?.reset();
  }, [etat]);

  React.useEffect(() => {
    fin.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  return (
    <div className="flex flex-col">
      <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Aucun message pour l&apos;instant. Une question sur le projet ? Écrivez ici.
          </p>
        ) : (
          messages.map((message) => {
            const moi = message.auteur_id === moiId;
            return (
              <div key={message.id} className={cn("flex", moi ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[85%]", moi && "text-right")}>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-left text-[15px] leading-relaxed whitespace-pre-wrap",
                      moi
                        ? "rounded-br-md bg-primary text-primary-foreground"
                        : "rounded-bl-md bg-secondary text-secondary-foreground",
                    )}
                  >
                    {message.contenu}
                  </div>
                  <p className="mt-1 px-1 text-xs text-muted-foreground">
                    {moi ? "Vous" : nomAutre} · {depuis(message.cree_le)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={fin} />
      </div>

      <form ref={formulaire} action={action} className="mt-4 border-t border-border pt-4">
        <input type="hidden" name="mission_id" value={missionId} />
        <label htmlFor={`message-${missionId}`} className="sr-only">
          Votre message
        </label>
        <div className="flex items-end gap-2">
          <textarea
            id={`message-${missionId}`}
            name="contenu"
            rows={2}
            required
            placeholder="Écrire un message…"
            className={cn(
              "min-h-12 flex-1 resize-y rounded-xl border border-input bg-background px-4 py-3 text-[15px]",
              "transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-muted-foreground/70",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
            )}
          />
          <button
            type="submit"
            disabled={enCours}
            aria-label="Envoyer le message"
            className={cn(
              "grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground",
              "transition-[background-color,scale,opacity] duration-150 ease-out",
              "hover:bg-bleu-700 active:scale-96 disabled:opacity-70 dark:hover:bg-bleu-400",
            )}
          >
            {enCours ? (
              <Loader2 className="size-5 animate-spin" strokeWidth={2} aria-hidden="true" />
            ) : (
              <SendHorizontal className="size-5" strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>
        {etat.statut === "erreur" && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {etat.message ?? etat.erreurs?.contenu?.[0]}
          </p>
        )}
      </form>
    </div>
  );
}
