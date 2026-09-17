-- RGM Dev — stockage des fichiers (Supabase Storage)
--
-- Deux espaces, deux règles :
--
--   images     public   captures de réalisations, illustrations, images
--                       d'articles. Lisibles par tous, déposées par l'admin.
--
--   documents  privé    devis, factures, contrats, livrables. Rangés par
--                       projet : `documents/<mission_id>/<fichier>`. L'admin
--                       gère tout ; un client ne lit que les fichiers des
--                       projets qui lui appartiennent, via des liens signés
--                       à durée limitée générés côté serveur.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'images', 'images', true, 10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml']
  ),
  ('documents', 'documents', false, 52428800, null)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- --- images ------------------------------------------------------------------

create policy "images lisibles par tous"
  on storage.objects for select
  using (bucket_id = 'images');

create policy "images deposees par l'admin"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'images' and public.est_admin());

create policy "images modifiees par l'admin"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'images' and public.est_admin())
  with check (bucket_id = 'images' and public.est_admin());

create policy "images supprimees par l'admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'images' and public.est_admin());

-- --- documents ---------------------------------------------------------------

create policy "documents geres par l'admin"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'documents' and public.est_admin())
  with check (bucket_id = 'documents' and public.est_admin());

-- Le premier segment du chemin est l'identifiant du projet. Le client lit un
-- fichier seulement si ce projet est le sien.
create policy "client lit les documents de ses projets"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'documents'
    and exists (
      select 1 from public.missions m
      where m.id::text = (storage.foldername(name))[1]
        and m.profil_id = auth.uid()
    )
  );
