-- ===========================================================================
-- 0009 — Le portfolio montre les projets clients
-- ===========================================================================
--
-- Demande de Rafael (2026-10-09) : Socle sort du portfolio, place aux projets
-- clients. Liccia Immo est publiée, La Santon est ajoutée.
--
-- Socle n'est pas supprimé : seulement dépublié, il se republie en un clic
-- depuis /admin/realisations si besoin.
--
-- Rejouable sans doublon.

-- Socle : retiré du site public.
update projets
set publie = false, en_vedette = false, modifie_le = now()
where slug = 'socle';

-- Liccia Immo : publiée et mise en avant sur l'accueil.
update projets
set publie = true, en_vedette = true, ordre = 3, modifie_le = now(),
    resultat = 'La refonte est prête et consultable en ligne ; elle remplacera l''ancien WordPress sur liccia-immo.fr.'
where slug = 'liccia-immo';

update projets set ordre = 4, modifie_le = now() where slug = 'le-k-repare';

-- La Santon : ajoutée.
insert into projets (
  slug, titre, client_nom, secteur, resume, probleme, solution, resultat,
  stack, url_live, url_depot, image_couverture, en_vedette, publie, ordre
) values (
  'la-santon',
  'La Santon',
  'La Santon',
  'Hébergement touristique',
  'Site de réservation en direct pour une maison d''hôtes, des gîtes et un lodge à Vif, au pied du Vercors, à 15 minutes de Grenoble.',
  'Un domaine très bien noté sur Booking, mais dont presque toutes les réservations passaient par les plateformes et leurs commissions. Le site existant ne permettait ni de voir les disponibilités, ni de réserver, ni de payer.',
  'Un site pensé pour la réservation directe : calendrier de disponibilités synchronisé avec Airbnb et Booking (iCal) pour éviter les doubles réservations, paiement en ligne avec Stripe, emails de confirmation automatiques, espace « Mon compte » où le voyageur retrouve ses séjours, et un back-office pour les hôtes : réservations, photos, newsletter et statistiques de visite. Contact WhatsApp en un geste sur mobile.',
  null,
  array['HTML', 'JavaScript', 'Vercel Functions', 'Vercel KV', 'Vercel Blob', 'Stripe', 'Resend'],
  'https://santon-virid.vercel.app',
  null,
  '/realisations/la-santon.webp',
  false,
  true,
  5
)
on conflict (slug) do nothing;

-- La Santon rejoint aussi les clients du pipeline.
insert into prospects (entreprise, contact, ville, secteur, source, besoin, statut, probabilite, etiquettes)
select 'La Santon', 'Céline et David', 'Vif', 'Hébergement touristique', 'Client existant',
       'Site de réservation directe : calendrier synchronisé, paiement Stripe, espace voyageur.', 'gagne', 100,
       array['site', 'reservation']
where not exists (select 1 from prospects where entreprise = 'La Santon');
