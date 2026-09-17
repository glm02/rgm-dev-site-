<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# RGM Dev — site vitrine, portfolio et espace client

Brief permanent du projet. Tout agent (Claude Code, Codex, Hermes) le lit avant
de toucher au code. Il dit **ce qu'on construit, pour qui, avec quoi, et ce
qu'on ne fait pas**.

---

## 1. Le projet en une phrase

Le site de **RGM Dev** — Rafael, développeur full-stack freelance basé à Lyon —
qui montre les réalisations **avec leurs prix**, récolte des demandes de devis,
et donne à chaque client un espace où suivre son projet.

- Dépôt : `https://github.com/glm02/rgm-dev-site-.git`
- Hébergement : **Vercel**
- Base de données + auth : **Supabase** (projet à créer, voir §7)

## 2. Pourquoi le site existe

Trois objectifs, dans cet ordre :

1. **Être trouvé.** Référencement local sur Lyon et sa région ("développeur
   freelance Lyon", "création site web Lyon", "automatisation IA Lyon"). C'est
   la raison n°1 d'existence du site — toute décision technique qui dégrade le
   SEO est une mauvaise décision.
2. **Convertir.** Les prix sont affichés publiquement. Un visiteur doit pouvoir
   comprendre ce que ça coûte et demander un devis en moins de deux minutes.
3. **Servir de support à Google Ads.** Des landing pages par service, propres,
   rapides, avec un formulaire de conversion mesurable.

## 3. Ce que RGM Dev vend

Deux métiers, à présenter à égalité :

**Sites web** — vitrine, e-commerce, applications métier, refontes.

**Automatisation IA** — agents Hermes, workflows n8n, intégrations sur mesure.
L'argument : identifier les tâches les plus longues et répétitives d'une
entreprise et les faire disparaître. C'est le service à plus forte marge, il
doit être aussi visible que les sites web, pas relégué en bas de page.

## 4. Réalisations à mettre en portfolio

Les fiches projet vivent en base (table `projets`), pas en dur dans le code.
Contenu de départ, tiré des dépôts existants de Rafael :

| Projet | Ce que c'est | Stack | Note |
|---|---|---|---|
| **Atout Travaux** | Site + demandes de devis pour un artisan (ramonage, chauffage, clim, plomberie, tubage) à La Ciotat | HTML statique, fonctions Vercel, Upstash, Resend | SEO local, c'est l'essentiel de sa valeur |
| **Campagne Vallauris** | Site + réservation en direct pour des chambres d'hôtes à Vaumeilh (campagne-vallauris.fr) | HTML/JS, Vercel KV + Blob, Resend | Réservations, galerie photo, emails |
| **Socle** | Cartographie du foncier raccordable en France pour data centers | Next.js, Supabase, visx | Projet data, montre le niveau technique |
| **Boréal** | Site événementiel | — | à compléter |

Chaque fiche porte : titre, slug, client, secteur, résumé, problème, solution,
résultat chiffré si possible, stack, captures, lien live, **fourchette de prix**,
durée de réalisation, et un drapeau `en_vedette`.

## 5. Fonctionnalités attendues

### Public
- Accueil, pages services (sites web / automatisation IA), portfolio + fiche
  projet, **page tarifs**, blog, contact, mentions légales et confidentialité.
- **Avis clients à fond** : témoignages en base, notes sur 5, affichés en
  accueil, en fiche projet et sur une page dédiée, avec balisage JSON-LD
  `Review` / `AggregateRating` pour obtenir les étoiles dans Google.
- Formulaire de devis → enregistre en base + notifie.

### Espace client (`/compte`)
- Connexion, puis : suivi de ses projets, jalons, devis et factures, fichiers
  livrables, messagerie simple avec RGM Dev, dépôt d'un avis une fois le projet
  livré.

### Espace admin (`/admin`)
- CRUD complet : projets, services, tarifs, articles, avis (modération),
  clients, devis, factures.
- Tableau de bord : demandes de devis, trafic, conversions.
- **Supervision et notifications** : surveiller les sites livrés (Atout Travaux,
  Vallauris, etc.) — disponibilité, erreurs, expiration du certificat TLS — et
  alerter Rafael immédiatement en cas de problème. Canal d'alerte : Telegram
  (bot déjà en place) et/ou email via Resend. Demande explicite, pas un bonus.

## 6. Stack — décisions prises

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | **Next.js 16 (App Router), React 19, TypeScript** | Rendu serveur = SEO. C'est du React, et c'est déjà la stack de `socle`. |
| Style | **Tailwind CSS v4** | Cohérent avec `socle`. |
| Composants | **shadcn/ui** (base `neutral`) | Une base qu'on possède, pas une dépendance opaque. |
| Animations | **Motion** + recettes `transitions.dev` | Voir §8. |
| Base + auth | **Supabase** (Postgres, RLS, Auth) | Demandé. |
| Déploiement | **Vercel** | Demandé. |
| Emails | **Resend** | Déjà utilisé sur les autres projets. |
| Validation | **Zod** | Formulaires et Server Actions. |

### Pièges Next.js 16 (vérifiés dans `node_modules/next/dist/docs/`)

- `middleware.ts` **n'existe plus** : la convention s'appelle `proxy.ts`, à la
  racine de `src/`, exportant une fonction `proxy`.
- `cookies()`, `headers()`, `params` et `searchParams` sont **asynchrones**.
- `fetch` **n'est plus caché par défaut**. Pour cacher, directive `use cache`
  plus `cacheLife` ; sinon envelopper dans `<Suspense>`.
- Les types `PageProps<"/route">` et `LayoutProps<"/route">` sont générés et
  globaux. Ne pas écrire ses propres interfaces de props de page.
- Un Server Action est joignable par POST direct : **vérifier l'autorisation
  dans chaque action**, jamais seulement dans l'UI.

### Bibliothèques fournies par Rafael
- **Spell UI** — registry shadcn : `https://spell.sh/r/{name}.json`, déclaré
  sous l'alias `@spell` dans `components.json`. Composants notables :
  `blur-reveal`, `words-stagger`, `shimmer-text`, `marquee`, `tilt-card`,
  `pop-button`, `flow-button`, `spotify-card`, `light-rays`.
- **transitions.dev** — recettes CSS (timings, easings, ouverture/fermeture).
  Disponible aussi comme skill `transitions-dev`.
- **shadcn-ui/lint**, **inspo-mcp**.
- Skills installés dans `.agents/skills/` : `better-ui`, `emil-design-eng`.

**Règle** : on emprunte les *recettes* (timings, easings, structure d'un
composant) et on les intègre dans notre propre design system. On n'empile pas
cinq librairies UI qui se marchent dessus.

**Bklit UI** : réservé aux **graphiques** du tableau de bord admin. Pas pour le
site public, qui n'a pas de dataviz.

## 7. Supabase — état actuel

⚠️ **Le projet Supabase n'existe pas encore.** Rafael crée un nouveau compte et
un nouveau projet. En attendant :

- Écrire les migrations SQL dans `supabase/migrations/`, prêtes à appliquer.
- Le code doit **démarrer et builder sans les clés** : si les variables sont
  absentes, les clients Supabase renvoient `null` et les pages affichent un
  message honnête plutôt que de planter au build. (Même approche que `socle`.)
- Ne jamais committer de clé. `.env.local` reste hors de git, `.env.example`
  documente les variables attendues.
- Variables : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY` (serveur uniquement, jamais exposée au client).

**Auth** : OAuth (Google, GitHub) + lien magique par email. Deux rôles,
`admin` et `client`, portés par une table `profils` et appliqués par des
politiques **RLS** — pas par une simple vérification côté client.

> Ce projet a son **propre** projet Supabase hébergé chez Supabase. Il ne
> partage pas l'instance auto-hébergée du VPS Contabo. Si on l'y déplaçait un
> jour, il faudrait le cloisonner dans un schéma dédié, pas dans `public`.

## 8. Direction artistique

**Bleu et blanc. Et ça doit être parfait.**

- Fond blanc dominant, bleu comme unique couleur d'accent, **texte en noir** —
  y compris le texte secondaire : pas de gris, il ne se lit pas sur le blanc
  (demande explicite de Rafael). La hiérarchie passe par la taille et la
  graisse. Pas de seconde couleur d'accent, pas de dégradé arc-en-ciel.
- Beaucoup d'air. Grandes typographies. Hiérarchie lisible d'un coup d'œil.
- Mode sombre prévu dès le départ (variables CSS sur `:root`).
- Animations **au service de la lecture**, jamais décoratives. Durées courtes
  (150–300 ms), easing naturel, asymétrie ouverture/fermeture,
  `prefers-reduced-motion` respecté. Pas de carrousel automatique, pas de
  parallaxe gratuite.
- Accessibilité : contrastes AA minimum, navigation clavier complète, focus
  visibles.

Le site doit donner envie d'embaucher celui qui l'a fait. C'est le portfolio
qui se démontre lui-même.

## 9. Conventions de code

- TypeScript strict. Pas de `any` sans commentaire qui le justifie.
- Server Components par défaut ; `"use client"` seulement s'il y a de
  l'interactivité.
- **Le domaine s'écrit en français** (`projets`, `avis`, `clientServeur`,
  `utilisateurCourant`), comme dans `socle`. L'anglais reste là où la
  bibliothèque l'impose (`children`, `params`, composants shadcn).
- Commentaires et textes du site en français.
- Un composant = un fichier, nommé comme ce qu'il affiche.
- Commits en français, à l'impératif ("Ajoute la page tarifs").

## 10. Ce qu'on ne fait pas

- Pas de CMS externe (Strapi, Sanity) : le CRUD admin *est* le CMS.
- Pas de paiement en ligne au lancement. Devis et factures se suivent dans
  l'espace client, l'encaissement reste hors site pour l'instant.
- Pas de copie du design d'Atout Travaux ou de Vallauris — ce sont des clients,
  leur identité leur appartient.
- Pas de contenu bidon en production : un témoignage affiché est un vrai
  témoignage.

## 11. Contacts et comptes

- GitHub : `glm02`
- Email : `glm07rafael@gmail.com`
- Zone d'activité affichée : **Lyon et région Auvergne-Rhône-Alpes**
