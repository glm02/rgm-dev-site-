-- ===========================================================================
-- 0008 — Les trois premiers articles du blog
-- ===========================================================================
--
-- Le blog était vide : une page « Blog » sans article ne rapporte rien en
-- référencement et fait mauvais effet. Ces trois articles visent les
-- recherches du §2 d'AGENTS.md (prix d'un site à Lyon, automatisation IA,
-- référencement local) et renvoient vers les pages qui convertissent.
--
-- Les prix cités sont ceux de la table `offres` au 2026-10-09. S'ils changent
-- dans l'admin, mettre à jour l'article 1 aussi.
--
-- Rejouable : `on conflict (slug) do nothing`. Les textes se modifient
-- ensuite depuis /admin/articles.

insert into articles (slug, titre, chapo, contenu, tags, temps_lecture, publie, publie_le, seo_titre, seo_description)
values

-- ---------------------------------------------------------------------------
(
  'prix-site-internet-lyon',
  'Combien coûte un site internet à Lyon en 2026 ?',
  'De 1 500 € à plus de 9 000 € : ce qui fait vraiment varier le prix d''un site, et comment savoir de quoi vous avez besoin avant de demander un devis.',
  $md$
« Combien coûte un site ? » est la première question qu'on me pose, et la réponse honnête est : ça dépend de ce que le site doit **faire**, pas du nombre de pages. Voici comment je chiffre, avec les vrais prix que j'affiche sur la [page tarifs](/tarifs).

## Les trois grandes familles de sites

### Le site vitrine : 1 500 à 3 000 €

C'est le site d'un artisan, d'un commerce, d'un cabinet. Il présente l'activité, rassure, et fait venir des demandes. Chez moi, il comprend jusqu'à huit pages, un design fait pour vous (pas un thème acheté), le référencement local, un formulaire de contact ou de devis, et un petit back-office pour modifier vos textes vous-même. Comptez deux à trois semaines.

C'est ce que j'ai livré à [Atout Travaux](/realisations/atout-travaux), un chauffagiste-ramoneur de La Ciotat : une page par métier, un formulaire de devis, et un site qui se charge quasi instantanément.

### La refonte : 2 000 à 5 000 €

Vous avez déjà un site, mais il est lent, daté, ou introuvable sur Google. Une refonte coûte un peu plus cher qu'un site neuf, parce qu'il faut **ne rien casser** : reprendre le contenu, rediriger chaque ancienne adresse vers la nouvelle, et garder le référencement acquis. Une refonte mal faite peut faire perdre en quelques jours des années de positionnement.

### Le site sur mesure : 3 500 à 9 000 €

Dès que le site doit gérer quelque chose — des réservations, des comptes clients, un catalogue, un espace d'administration complet — on parle d'application. C'est le cas de [Campagne Vallauris](/realisations/campagne-vallauris), des chambres d'hôtes qui prennent désormais leurs réservations en direct, sans commission de plateforme.

## Ce qui fait monter (ou baisser) la facture

- **Les fonctionnalités, pas les pages.** Ajouter une page « Équipe » ne coûte presque rien. Ajouter un calendrier de réservation synchronisé, si.
- **Le contenu.** Si vous fournissez textes et photos, c'est plus rapide. Si je dois les écrire ou les reprendre d'un ancien site, je le compte.
- **Les connexions à vos outils.** Envoyer les demandes dans votre CRM, votre tableur ou votre logiciel de facturation demande du travail en plus — mais c'est souvent là que le site commence à vous faire gagner du temps.
- **Le référencement.** Un site rapide et bien structuré est inclus. Une stratégie de contenu sur plusieurs mois, c'est un autre budget.

## Les coûts qu'on oublie

Un site, ce n'est pas qu'un développement. Il y a le nom de domaine (une dizaine d'euros par an), l'hébergement (inclus la première année chez moi), et surtout **l'entretien** : mises à jour de sécurité, sauvegardes, surveillance. Je le propose à partir de 90 € par mois, sans engagement, avec une alerte immédiate si le site tombe. Vous n'êtes pas obligé de le prendre — mais un site que personne ne surveille finit toujours par tomber un vendredi soir.

## Méfiez-vous des prix trop bas

Un site à 300 € existe. C'est généralement un thème générique, rempli à la hâte, lent, et invisible sur Google. Le vrai coût apparaît plus tard : aucun client ne vous trouve, et il faut tout refaire. À l'inverse, une agence facturera souvent 10 000 € pour un site vitrine, parce qu'elle paie des commerciaux, des chefs de projet et des locaux. En freelance, vous payez le travail, et vous parlez directement à la personne qui le fait.

## Comment obtenir un prix juste

Décrivez ce que le site doit **produire** pour vous : des appels, des demandes de devis, des réservations, des ventes. À partir de là, je vous envoie un devis ferme sous 48 heures, gratuit et sans engagement. Si votre besoin ne justifie pas un site sur mesure, je vous le dis.

[Demander un devis](/contact)
$md$,
  array['prix', 'site vitrine', 'Lyon'],
  6,
  true,
  now() - interval '14 days',
  'Prix d''un site internet à Lyon en 2026 : les vrais tarifs',
  'Site vitrine, refonte ou sur mesure : combien coûte un site internet à Lyon en 2026, ce qui fait varier le prix, et les coûts qu''on oublie.'
),

-- ---------------------------------------------------------------------------
(
  'automatiser-taches-repetitives-ia',
  'Automatiser les tâches répétitives de votre entreprise avec l''IA : par où commencer',
  'Avant de parler d''agents IA, il faut savoir quelles tâches vous coûtent vraiment du temps. La méthode que j''applique, étape par étape.',
  $md$
Tout le monde parle d'intelligence artificielle, et beaucoup d'entreprises ont l'impression de « passer à côté ». Pourtant, le plus gros gain ne vient presque jamais de l'IA la plus impressionnante : il vient de la tâche la plus **ennuyeuse**, celle que quelqu'un refait chaque jour depuis des années.

## Commencer par les tâches, pas par l'outil

La mauvaise question : « Quel outil d'IA devrions-nous utiliser ? »
La bonne question : « Qu'est-ce qui nous prend du temps chaque semaine, et qui suit toujours les mêmes règles ? »

Quelques exemples typiques :

- recopier les demandes reçues par mail dans un tableur ou un CRM ;
- relancer les devis restés sans réponse ;
- trier les mails entrants et répondre aux questions qui reviennent ;
- préparer chaque mois le même rapport à partir de trois sources différentes ;
- saisir des factures fournisseurs dans le logiciel comptable.

Chacune de ces tâches semble petite. Additionnées sur une année et sur plusieurs personnes, elles représentent souvent des semaines de travail.

## La méthode en quatre étapes

### 1. Cartographier

On liste les tâches répétitives avec les personnes qui les font. Pour chacune : combien de fois par semaine, combien de temps à chaque fois, quels outils sont touchés, et ce qui se passe quand elle est mal faite.

### 2. Estimer le temps récupérable

On multiplie, simplement. Une tâche de 10 minutes faite 15 fois par semaine, c'est plus de 120 heures par an. Le [calculateur de la page d'accueil](/) fait ce calcul pour vous.

### 3. Prioriser

On commence par ce qui rapporte le plus pour le moins de risque : beaucoup de temps gagné, des règles claires, et une erreur sans gravité. On garde pour plus tard ce qui touche directement les clients ou l'argent.

### 4. Automatiser, puis mesurer

C'est seulement maintenant qu'on choisit l'outil.

## n8n, agent IA : quel outil pour quoi ?

**Un workflow n8n** convient quand les règles sont fixes : « quand un formulaire arrive, crée une fiche dans le CRM, envoie un mail de confirmation et préviens le commercial sur Telegram ». C'est fiable, peu coûteux, et facile à faire évoluer.

**Un agent IA** devient utile quand il faut **comprendre** du texte : lire un mail et deviner ce que veut le client, résumer un document, rédiger un premier jet de réponse. L'IA est très bonne pour ça — à condition de garder une validation humaine là où une erreur coûterait cher. C'est ce que je mets en place : l'agent prépare, vous validez en un clic.

Dans la plupart des projets, on combine les deux : n8n orchestre, l'IA intervient sur les étapes qui demandent de la lecture ou de la rédaction.

## Ce que ça coûte

Je propose d'abord un **audit d'automatisation** (600 à 900 €, une semaine) : entretiens avec vos équipes, cartographie, estimation du temps récupérable et plan chiffré. Il est déduit du projet si vous le lancez. Une automatisation d'un processus coûte ensuite de 1 200 à 4 000 €, un agent IA sur mesure de 2 500 à 8 000 €. Tous les détails sont sur la [page du service](/services/automatisation-ia).

## Les pièges à éviter

- **Automatiser un processus confus.** Si personne ne sait exactement comment la tâche doit être faite, un robot le saura encore moins. On clarifie d'abord.
- **Tout automatiser d'un coup.** Une première automatisation qui marche vaut mieux que dix à moitié finies.
- **Oublier le suivi.** Un outil change son API, un mot de passe expire : une automatisation doit être surveillée, comme un site.

Vous avez une tâche en tête ? [Décrivez-la-moi](/contact) : je vous dis franchement si elle vaut la peine d'être automatisée.
$md$,
  array['automatisation', 'IA', 'n8n'],
  6,
  true,
  now() - interval '7 days',
  'Automatiser les tâches répétitives avec l''IA : par où commencer',
  'Workflows n8n, agents IA : la méthode pour repérer les tâches qui vous coûtent du temps, les automatiser sans risque, et ce que ça coûte.'
),

-- ---------------------------------------------------------------------------
(
  'referencement-local-artisan-commerce',
  'Référencement local : ce qui fait vraiment remonter une entreprise sur Google',
  'Artisan, commerce, cabinet : vos clients cherchent « votre métier + votre ville ». Les leviers qui comptent vraiment pour apparaître, et ceux qui ne servent à rien.',
  $md$
Quand quelqu'un cherche « plombier Villeurbanne » ou « réparation téléphone Croix-Rousse », Google affiche d'abord une carte avec trois entreprises, puis des sites. Être dans ces premiers résultats, c'est recevoir les appels. Ne pas y être, c'est dépendre du bouche-à-oreille. Voici ce qui fait vraiment la différence.

## 1. La fiche Google Business Profile

C'est le levier numéro un, et il est gratuit. Votre fiche (l'ancienne « Google My Business ») doit être complète : bonne catégorie principale, horaires à jour, photos réelles de votre local ou de vos chantiers, zone d'intervention, numéro de téléphone. Une fiche à moitié remplie perd face à un concurrent qui a tout renseigné.

## 2. Les avis clients

Le nombre d'avis, leur note et leur fraîcheur comptent beaucoup. La méthode qui marche : demander l'avis **au bon moment**, juste après un travail réussi, avec un lien direct. Et répondre à chaque avis, y compris aux négatifs, calmement.

Une règle absolue : jamais de faux avis. Google les détecte de mieux en mieux, et les sanctions touchent toute la fiche.

## 3. Une page par métier et par zone

Si vous faites du ramonage, du chauffage et de la climatisation, un seul paragraphe « nos services » ne suffit pas. Chaque métier mérite sa page, avec un vrai contenu : ce que vous faites, comment, à quel prix, dans quelles villes. C'est ce qui permet d'apparaître sur « ramonage La Ciotat » **et** sur « entretien chaudière Aubagne ».

C'est exactement la structure du site d'[Atout Travaux](/realisations/atout-travaux) : une page indexée par métier, plutôt qu'une seule page qui parle de tout.

## 4. La vitesse et le mobile

La majorité des recherches locales se font sur téléphone, souvent dans l'urgence. Un site qui met cinq secondes à s'afficher perd le visiteur — et Google le sait. Des images trop lourdes, un thème chargé de scripts et un hébergement bas de gamme suffisent à plomber un site. Un site bien construit s'affiche en moins d'une seconde.

## 5. Les données structurées

Ce sont des informations invisibles pour le visiteur mais lues par Google : nom de l'entreprise, adresse, zone d'intervention, horaires, avis. Elles l'aident à comprendre qui vous êtes et où vous travaillez. Tous les sites que je livre en contiennent.

## 6. La cohérence partout

Votre nom, votre adresse et votre téléphone doivent être écrits **exactement** de la même façon sur votre site, votre fiche Google, les annuaires et les réseaux sociaux. Des informations contradictoires sèment le doute, chez Google comme chez vos clients.

## Ce qui ne sert à rien

- **Répéter « plombier Lyon » vingt fois dans une page.** Google sait lire ; un texte écrit pour les humains fonctionne mieux.
- **Acheter des liens en masse.** Au mieux inutile, au pire pénalisant.
- **Créer cinquante pages de villes identiques** où seul le nom change. Google les repère et les ignore.

## Combien de temps avant les résultats ?

Une fiche Google bien remplie peut faire effet en quelques semaines. Un site neuf met en général deux à six mois à trouver sa place, selon la concurrence de votre métier dans votre ville. Il n'y a pas de raccourci honnête — mais les bases ci-dessus, bien faites, font déjà la différence face à la plupart des concurrents.

Le référencement local est inclus dans tous les [sites vitrines](/services/sites-web) que je livre. Vous voulez savoir où en est le vôtre ? [Écrivez-moi](/contact), je regarde gratuitement.
$md$,
  array['SEO', 'référencement local', 'artisan'],
  6,
  true,
  now() - interval '1 day',
  'Référencement local : remonter sur Google en tant qu''artisan',
  'Fiche Google, avis, une page par métier, vitesse : les leviers qui font vraiment remonter une entreprise locale sur Google, et ceux qui ne servent à rien.'
)

on conflict (slug) do nothing;
