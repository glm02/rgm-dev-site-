import { listerArticles, listerProjets, offresParService } from "@/lib/donnees";
import { fourchette, fourchetteProjet } from "@/lib/format";
import { AUTEUR, SITE, VILLES } from "@/lib/site";

/**
 * `/llms.txt` : le résumé du site à l'intention des assistants IA (GEO).
 *
 * Convention proposée sur llmstxt.org : un fichier Markdown à la racine qui
 * dit en quelques lignes qui on est, ce qu'on vend, à quel prix, et où lire
 * la suite. Un assistant qui doit répondre « combien coûte un site chez RGM
 * Dev ? » trouve ici la réponse exacte au lieu de l'extrapoler d'une page.
 *
 * Construit depuis la base, comme le reste du site : un prix changé dans
 * l'admin y apparaît à la prochaine régénération (au plus une heure).
 */
export const revalidate = 3600;

export async function GET() {
  const [catalogue, projets, articles] = await Promise.all([
    offresParService(),
    listerProjets(),
    listerArticles(),
  ]);

  const lignes: string[] = [
    `# ${SITE.nom}`,
    "",
    `> ${SITE.nom} est l'activité de ${AUTEUR.nom}, ${AUTEUR.metier.toLowerCase()} basé à ${SITE.ville} (${SITE.region}). ` +
      "Il crée des sites web (vitrine, refonte, sur mesure) et automatise les tâches répétitives des entreprises " +
      "avec l'IA (agents, workflows n8n). Les prix sont publics, les devis sont envoyés sous 48 heures.",
    "",
    `- Zone d'intervention : ${VILLES.join(", ")} et toute la métropole lyonnaise, dans un rayon de ${SITE.rayonKm} km ; travail à distance partout en France.`,
    `- Contact : ${SITE.email} — formulaire de devis : ${SITE.url}/contact`,
    `- Code public : ${SITE.github}`,
    "- Tous les prix sont hors taxes.",
    "",
  ];

  for (const { service, offres } of catalogue) {
    lignes.push(`## ${service.titre}`, "", service.description ?? service.accroche, "");
    lignes.push(`Page : ${SITE.url}/services/${service.slug}`, "");
    for (const offre of offres) {
      const details = [fourchette(offre), offre.delai].filter(Boolean).join(", ");
      lignes.push(`- **${offre.nom}** — ${details}${offre.description ? ` : ${offre.description}` : ""}`);
      if (offre.inclus.length) lignes.push(`  Inclus : ${offre.inclus.join(" ; ")}.`);
    }
    lignes.push("");
  }

  lignes.push("## Réalisations", "");
  for (const projet of projets) {
    const prix = fourchetteProjet(projet.prix_min, projet.prix_max);
    lignes.push(
      `- [${projet.titre}](${SITE.url}/realisations/${projet.slug})` +
        `${projet.secteur ? ` (${projet.secteur})` : ""} : ${projet.resume}` +
        `${prix ? ` Budget : ${prix}.` : ""}`,
    );
  }
  lignes.push("");

  if (articles.length) {
    lignes.push("## Articles", "");
    for (const article of articles) {
      lignes.push(`- [${article.titre}](${SITE.url}/blog/${article.slug})${article.chapo ? ` : ${article.chapo}` : ""}`);
    }
    lignes.push("");
  }

  lignes.push(
    "## Pages utiles",
    "",
    `- [Tarifs détaillés](${SITE.url}/tarifs)`,
    `- [Développeur web freelance à Lyon](${SITE.url}/developpeur-web-lyon)`,
    `- [La méthode de travail](${SITE.url}/methode)`,
    `- [Avis clients](${SITE.url}/avis)`,
    `- [Demander un devis](${SITE.url}/contact)`,
    "",
  );

  return new Response(lignes.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
