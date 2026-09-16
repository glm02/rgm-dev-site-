# RGM Dev — site, portfolio et espace client

Le site de **RGM Dev**, développeur full-stack freelance à Lyon : sites web et
automatisation par agents IA. Il montre les réalisations **avec leurs prix**,
récolte les demandes de devis, et donne à chaque client un espace où suivre son
projet.

Production : https://rgm-dev.site

> Le brief complet du projet — ce qu'on construit, pour qui, et ce qu'on ne fait
> pas — est dans [`AGENTS.md`](AGENTS.md). Le lire avant de toucher au code.

---

## Démarrer

```bash
npm install
cp .env.example .env.local   # facultatif, voir plus bas
npm run dev
```

Le site tourne sur http://localhost:3000.

**Il démarre sans aucune variable d'environnement.** Tant que Supabase n'est pas
branché, les clients renvoient `null` et le contenu de
`src/lib/contenu-defaut.ts` prend le relais. C'est délibéré : on peut concevoir,
relire et déployer le site avant que tous les comptes existent.

| Commande | Ce qu'elle fait |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run typecheck` | `tsc --noEmit`, sans émettre de fichiers |
| `npm run lint` | ESLint, avec le plugin `@shadcn/lint` |

## La stack

| Couche | Choix |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript strict |
| Style | Tailwind CSS v4, variables CSS en OKLCH |
| Composants | shadcn/ui sur Base UI (`base-nova`), registry Spell UI |
| Animation | Motion, timelines de défilement CSS, Three.js |
| Données + auth | Supabase (Postgres, RLS, Auth) |
| Emails | Resend · Alertes : Telegram |
| Hébergement | Vercel |

### Trois pièges de Next.js 16

Cette version s'écarte de ce que connaissent la plupart des agents et des
tutoriels. La doc de référence est embarquée dans
`node_modules/next/dist/docs/`.

1. **`middleware.ts` n'existe plus** — la convention s'appelle `proxy.ts`
   (ici : [`src/proxy.ts`](src/proxy.ts)) et exporte une fonction `proxy`.
2. **`cookies()`, `headers()`, `params` et `searchParams` sont asynchrones.**
3. **`fetch` n'est plus caché par défaut.** Pour cacher : directive
   `use cache` + `cacheLife`. Sinon, envelopper dans `<Suspense>`.

## Organisation

```
src/
  app/
    (site)/            Le site public — entête, pied de page, JSON-LD d'entreprise
    layout.tsx         Racine : polices, métadonnées, fournisseurs
    fournisseurs.tsx   Contextes client (thème)
  components/
    commun/            Briques réutilisables (cartes, fil d'Ariane, formulaire)
    sections/          Les grands blocs de page
    site/              Entête, pied de page, logo, bascule de thème
    ui/                shadcn/ui — ne pas modifier à la main sans raison
    *.tsx              Composants Spell UI, installés par le registry
  lib/
    donnees.ts         LA porte d'entrée vers les données du site public
    contenu-defaut.ts  Le contenu servi tant que Supabase n'est pas branché
    supabase/          Clients navigateur / serveur / service role
    actions/           Server Actions
    seo.ts             Métadonnées et données structurées
    notifications.ts   Telegram et Resend
  proxy.ts             Rafraîchissement de session (ex-middleware)

supabase/migrations/   Le schéma, la RLS et les données de départ
```

## Supabase

Le projet Supabase **n'est pas encore créé**. Quand il le sera :

1. Appliquer les migrations dans l'ordre :
   `0001_schema.sql`, `0002_rls.sql`, `0003_donnees_initiales.sql`.
2. Remplir `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Passer son propre compte en `admin` :
   ```sql
   update profils set role = 'admin' where email = 'glm07rafael@gmail.com';
   ```
4. Regénérer les types et supprimer `src/lib/contenu-defaut.ts`, devenu inutile.

**La RLS est le contrôle d'accès**, pas les vérifications faites dans les pages.
Un Server Action est joignable par POST direct et la clé anon est publique par
construction : tout ce qui protège vraiment les données est dans
`0002_rls.sql`.

⚠️ Les prix de `0003_donnees_initiales.sql` sont des **fourchettes plausibles,
pas les tarifs de Rafael**. À relire avant la mise en ligne.

## Déploiement

Chaque `push` sur `main` déclenche un déploiement Vercel. Les variables
d'environnement sont à renseigner dans *Settings → Environment Variables*, en
reprenant [`.env.example`](.env.example).

`SUPABASE_SERVICE_ROLE_KEY` contourne la RLS : elle ne doit exister que côté
serveur, jamais préfixée par `NEXT_PUBLIC_`.
