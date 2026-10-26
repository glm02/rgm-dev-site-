-- Atout Travaux a coûté plus cher que Campagne Vallauris : en plus du site, il
-- comprend des agents IA pour l'équipe. Les fourchettes de départ étaient
-- inversées. Déjà appliqué en production le 26/10/2026 ; ce fichier garde la
-- trace pour une base recréée à partir des migrations.

update projets
set prix_min = 2000,
    prix_max = 4000,
    resume = 'Site, moteur de demandes de devis et agents IA pour un artisan chauffagiste-ramoneur installé à La Ciotat depuis 1984.',
    solution = case
      when solution like '%agents IA%' then solution
      else solution || ' Puis des agents IA pour l’équipe, joignables sur Telegram : préparer un devis, planifier une intervention, relancer un client.'
    end,
    stack = case
      when 'Hermes Agent' = any(stack) then stack
      else array_append(stack, 'Hermes Agent')
    end,
    modifie_le = now()
where slug = 'atout-travaux';

update projets
set prix_min = 1500,
    prix_max = 3000,
    modifie_le = now()
where slug = 'campagne-vallauris';
