import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

/**
 * Rendu du Markdown des articles et des pages de contenu.
 *
 * `react-markdown` n'interprète pas le HTML brut par défaut, et on ne lui
 * ajoute pas `rehype-raw` : un article saisi dans l'admin ne peut donc pas
 * injecter de script, même par erreur de copier-coller.
 *
 * La typographie est écrite ici plutôt qu'avec `@tailwindcss/typography` : le
 * plugin impose sa propre échelle, et le site en a déjà une.
 */
export function Markdown({ contenu, className }: { contenu: string; className?: string }) {
  return (
    <div className={cn("text-[17px] leading-[1.75] text-foreground/90", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="mt-12 mb-4 text-2xl font-semibold text-foreground sm:text-3xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-9 mb-3 text-xl font-semibold text-foreground">{children}</h3>
          ),
          p: ({ children }) => <p className="my-5">{children}</p>,
          a: ({ href, children }) => {
            const externe = href?.startsWith("http");
            return (
              <a
                href={href}
                {...(externe ? { target: "_blank", rel: "noreferrer" } : {})}
                className="font-medium text-bleu-700 underline decoration-bleu-300 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-bleu-600 dark:text-bleu-300"
              >
                {children}
              </a>
            );
          },
          ul: ({ children }) => (
            <ul className="my-5 list-disc space-y-2 pl-6 marker:text-bleu-500">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-5 list-decimal space-y-2 pl-6 marker:text-muted-foreground">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-7 border-l-2 border-bleu-500 pl-5 text-muted-foreground italic">
              {children}
            </blockquote>
          ),
          code: ({ children, className: langage }) =>
            langage ? (
              <code className={cn("font-mono text-sm", langage)}>{children}</code>
            ) : (
              <code className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[0.9em] text-secondary-foreground">
                {children}
              </code>
            ),
          pre: ({ children }) => (
            <pre className="my-6 overflow-x-auto rounded-xl border border-border bg-secondary/60 p-4 text-sm leading-relaxed">
              {children}
            </pre>
          ),
          hr: () => <hr className="my-10 border-border" />,
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-[15px]">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-secondary/50 px-4 py-2.5 font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="border-b border-border px-4 py-2.5">{children}</td>,
        }}
      >
        {contenu}
      </ReactMarkdown>
    </div>
  );
}
