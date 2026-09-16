/**
 * Insère un bloc de données structurées.
 *
 * `JSON.stringify` puis remplacement des `<` : sans ça, une chaîne contenant
 * `</script>` — par exemple dans un avis client — refermerait la balise et
 * casserait la page. C'est la seule raison de ce composant.
 */
export function JsonLd({ donnees }: { donnees: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(donnees).replace(/</g, "\\u003c"),
      }}
    />
  );
}
