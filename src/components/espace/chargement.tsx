import { Skeleton } from "@/components/ui/skeleton";

/**
 * L'écran de chargement des espaces client et admin.
 *
 * Il reprend la silhouette d'une page d'espace — titre, quatre tuiles, deux
 * panneaux — pour que le contenu arrive à sa place au lieu de faire sauter la
 * mise en page.
 */
export function ChargementEspace() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement…</span>
      <Skeleton className="h-8 w-56 rounded-lg" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl" />
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}
