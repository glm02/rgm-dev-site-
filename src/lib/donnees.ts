import { clientServeur } from "./supabase/serveur";
import {
  AVIS_DEFAUT,
  OFFRES_DEFAUT,
  PROJETS_DEFAUT,
  SERVICES_DEFAUT,
} from "./contenu-defaut";
import type { Article, Avis, Offre, Projet, Service } from "./types";

/**
 * La seule porte d'entrée vers les données du site public.
 *
 * Chaque fonction suit la même règle : si Supabase répond, on prend Supabase ;
 * sinon on sert le contenu de `contenu-defaut.ts`. Le reste de l'application
 * n'a donc jamais à savoir si la base est branchée — et le site build, se
 * déploie et se relit avant même que le projet Supabase existe.
 *
 * Une erreur Supabase est traitée comme une absence : on retombe sur le repli
 * et on trace en console plutôt que de montrer une page blanche au visiteur.
 */

function signaler(quoi: string, erreur: unknown) {
  console.error(`[donnees] ${quoi} — repli sur le contenu par défaut.`, erreur);
}

// ---------------------------------------------------------------------------
// Services et tarifs
// ---------------------------------------------------------------------------

export async function listerServices(): Promise<Service[]> {
  const supabase = await clientServeur();
  if (!supabase) return SERVICES_DEFAUT;

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("actif", true)
    .order("ordre");

  if (error) {
    signaler("listerServices", error);
    return SERVICES_DEFAUT;
  }

  return data?.length ? (data as Service[]) : SERVICES_DEFAUT;
}

export async function serviceParSlug(slug: string): Promise<Service | null> {
  const services = await listerServices();
  return services.find((service) => service.slug === slug) ?? null;
}

export async function listerOffres(): Promise<Offre[]> {
  const supabase = await clientServeur();
  if (!supabase) return OFFRES_DEFAUT;

  const { data, error } = await supabase
    .from("offres")
    .select("*")
    .eq("actif", true)
    .order("ordre");

  if (error) {
    signaler("listerOffres", error);
    return OFFRES_DEFAUT;
  }

  return data?.length ? (data as Offre[]) : OFFRES_DEFAUT;
}

/** Les offres rangées sous leur service, dans l'ordre d'affichage. */
export async function offresParService(): Promise<
  { service: Service; offres: Offre[] }[]
> {
  const [services, offres] = await Promise.all([listerServices(), listerOffres()]);

  return services.map((service) => ({
    service,
    offres: offres.filter((offre) => offre.service_id === service.id),
  }));
}

// ---------------------------------------------------------------------------
// Réalisations
// ---------------------------------------------------------------------------

export async function listerProjets(options?: {
  enVedette?: boolean;
  limite?: number;
}): Promise<Projet[]> {
  const supabase = await clientServeur();

  let projets: Projet[];

  if (!supabase) {
    projets = PROJETS_DEFAUT;
  } else {
    const { data, error } = await supabase
      .from("projets")
      .select("*")
      .eq("publie", true)
      .order("ordre");

    if (error) {
      signaler("listerProjets", error);
      projets = PROJETS_DEFAUT;
    } else {
      projets = data?.length ? (data as Projet[]) : PROJETS_DEFAUT;
    }
  }

  if (options?.enVedette) {
    projets = projets.filter((projet) => projet.en_vedette);
  }

  return options?.limite ? projets.slice(0, options.limite) : projets;
}

export async function projetParSlug(slug: string): Promise<Projet | null> {
  const supabase = await clientServeur();

  if (supabase) {
    const { data, error } = await supabase
      .from("projets")
      .select("*")
      .eq("slug", slug)
      .eq("publie", true)
      .maybeSingle();

    if (!error && data) return data as Projet;
    if (error) signaler("projetParSlug", error);
  }

  return PROJETS_DEFAUT.find((projet) => projet.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Avis
// ---------------------------------------------------------------------------

export async function listerAvis(options?: {
  projetId?: string;
  enVedette?: boolean;
  limite?: number;
}): Promise<Avis[]> {
  const supabase = await clientServeur();
  if (!supabase) return AVIS_DEFAUT;

  let requete = supabase
    .from("avis")
    .select("*")
    .eq("publie", true)
    .order("cree_le", { ascending: false });

  if (options?.projetId) requete = requete.eq("projet_id", options.projetId);
  if (options?.enVedette) requete = requete.eq("en_vedette", true);
  if (options?.limite) requete = requete.limit(options.limite);

  const { data, error } = await requete;

  if (error) {
    signaler("listerAvis", error);
    return AVIS_DEFAUT;
  }

  return (data as Avis[]) ?? AVIS_DEFAUT;
}

/**
 * Note moyenne et nombre d'avis, pour l'`AggregateRating` du balisage JSON-LD.
 *
 * Renvoie `null` s'il n'y a aucun avis : Google refuse — à juste titre — un
 * `AggregateRating` sans avis derrière, et l'inventer ferait sauter le
 * balisage de tout le site.
 */
export async function noteGlobale(): Promise<{
  moyenne: number;
  nombre: number;
} | null> {
  const avis = await listerAvis();
  if (avis.length === 0) return null;

  const somme = avis.reduce((total, un) => total + un.note, 0);
  return {
    moyenne: Math.round((somme / avis.length) * 10) / 10,
    nombre: avis.length,
  };
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export async function listerArticles(limite?: number): Promise<Article[]> {
  const supabase = await clientServeur();
  if (!supabase) return [];

  let requete = supabase
    .from("articles")
    .select("*")
    .eq("publie", true)
    .order("publie_le", { ascending: false });

  if (limite) requete = requete.limit(limite);

  const { data, error } = await requete;

  if (error) {
    signaler("listerArticles", error);
    return [];
  }

  return (data as Article[]) ?? [];
}

export async function articleParSlug(slug: string): Promise<Article | null> {
  const supabase = await clientServeur();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("publie", true)
    .maybeSingle();

  if (error) {
    signaler("articleParSlug", error);
    return null;
  }

  return (data as Article | null) ?? null;
}
