# Design system · RGM Dev

Mémoire des décisions de design du site. Une règle par ligne : la règle, la
raison, la date. Lu au début de chaque session de maquette ou de code
d'interface ; complété à chaque correction (skill `maquette-figma`).

Fichier Figma : « RGM DEV WEBSITE » (fileKey `NxdL8U6ZFbZVV8bbKDltME`).
Plan de toutes les pages et de leurs états : page `03 · Architecture`.
Charte commune : skill `charte-rgm`. Kit de code : skill `ui-rgm`.

## Jetons
- Couleurs, tailles, espacements, rayons : variables des collections Couleurs, Primitives, Typographie, Espacements, Rayons ; jamais de hex. Un hex tapé ne suit pas les changements de thème. (2026-11-22)
- Une couleur liée garde une couleur de repli égale à la valeur de son jeton. Un repli noir ne se voit pas en capture mais casse le fichier. (2026-11-23)
- Les conteneurs de mise en page n'ont pas de fond (`fills: []`). Un fond blanc posé par défaut compte comme couleur non liée. (2026-11-23)

## Couleurs
- Texte toujours `texte/principal` (#1A1A1A), y compris le secondaire. Le gris ne se lit pas sur le blanc. (2026-11-22)
- Un seul accent : `accent/principal` (#405CE5). Une deuxième couleur dilue la marque. (2026-11-22)
- Mot manuscrit (Permanent Marker) blanc sur fond sombre. Le jaune a été refusé. (2026-11-22)

## Typographie
- Le fichier n'a pas de styles de texte : la taille et la famille se lient aux variables `taille/*` et `famille/*`. (2026-11-23)
- Grands titres de héros en SF Pro Display, repli Inter. C'est la police de la maquette ; hors Apple, le repli s'affiche. (2026-11-22)

## Icônes et logos
- Icônes Iconly : Two-tone 22 px en tuile premium pour la mise en avant, Light 16 px en ligne. Les icônes Lucide de base faisaient pauvre. (2026-11-22)
- Le trait d'une icône suit sa taille : 1,5 px à 24 px, 1 px à 16 px. En code, le SVG est mis à l'échelle et le trait avec ; la maquette doit faire pareil. (2026-11-23)
- Chaque marque citée a son logo, jamais deux fois le même logo dans un bloc. Une bande de logos répétés fait remplissage. (2026-11-22)

## Blocs
- Navigation : trois colonnes égales (logo, pilule de menu, actions), la pilule centrée sur la page. Avec un simple « espace entre », elle se décalait vers la gauche car les actions sont plus larges que le logo. (2026-11-23)
- Bandeau photo : carte arrondie 24, marge 12, paysage bleu tramé + voile, navigation en verre dessus ; hauteur 282 (légal) à 470 px (Automatisation). (2026-11-22)
- Page intérieure : colonne 1200 px, 52 px entre blocs, cartes rayon 16 bordure 1 px, padding 28. (2026-11-22)
- Fin de page : un appel à l'action (« Échangeons sur votre besoin » ou « Un projet ? »). Aucune page sans suite. (2026-11-22)
- Fiche réalisation : bloc « Suite » service lié + projet suivant. Pas de page orpheline. (2026-11-22)

## Contenu
- Le moins de texte possible : un titre court, une phrase d'appui. Trop de texte rendait les pages lourdes. (2026-11-22)
- Articles de blog et pages légales : le Figma résume, le code garde le texte complet de la base. SEO et obligations légales. (2026-11-23)

## Mobile
- Les titres de héros sont centrés et passent à la ligne en restant centrés. Un titre aligné à gauche a été vu sur Contact. (2026-11-23)
- Texte blanc sur photo de nuages : ombre `0 2px 14px rgba(4,14,64,.5)`. Le blanc disparaissait sur un nuage blanc. (2026-11-23)
- Tout titre `h1` blanc d'un bandeau photo porte une ombre `0 2px 24px rgba(4,14,64,.55)` (posée par `Bandeau` et `BandeauPaysage`, et en effet sur le texte dans Figma). Le « et » du héros d'accueil disparaissait sur un nuage. (2026-11-24)

## Interaction (grille taste-skill, appliquée le 2026-11-23)
- En mobile, tout lien ou bouton hors texte courant fait au moins 44 px de haut (`max-md:min-h-11`), champs de formulaire compris. 16 à 28 cibles par page étaient trop petites. (2026-11-23)
- Le contenu du héros entre une fois au chargement (`rgm-entree`, 300 ms, en CSS pour démarrer avant le JavaScript et ne pas clignoter). (2026-11-23)
- Transitions GSAP (`components/rgm/transitions.tsx`, monté par `app/(site)/template.tsx`) : fondu de 250 ms à chaque navigation interne, rien au premier chargement ; titres et cartes situés sous l'écran apparaissent en cascade une seule fois (0,5 s, décalage 70 ms, 24 px). Ce qui est visible à l'arrivée ne bouge pas, le contenu reste dans le HTML pour le référencement, tout est coupé avec « réduire les animations ». Demande de Rafaël, qui remplace la règle « rien n'apparaît au défilement » de la veille. (2026-11-24)
- Boutons : léger enfoncement au clic (`active:scale-[0.97]`). Cartes cliquables : soulevées de 2 px au survol, photo agrandie à 1,02. Lien fléché : la flèche avance de 2 px. Tout s'arrête avec « réduire les animations ». (2026-11-23)

## En attente de décision (taste-skill)
- « Une section par écran » : nos héros font 0,33 à 0,54 écran et beaucoup de sections moins d'un écran. L'appliquer refait la mise en page validée ; à trancher par Rafaël, maquette Figma d'abord. (2026-11-23)
- « Un seul couple de boutons » : 4 à 5 styles de bouton par page (pilule noire, pilule blanche, dégradé, contour, lien). À trancher par Rafaël. (2026-11-23)

## Contrôlé par l'audit (`audit-figma.js`)
- hauteurs de bouton : 28, 32, 36, 40, 44 ; rayons : 8, 9, 10, 999
- trait d'icône : 1,5 × taille / 24, tolérance 0,3
- cadres qui coupent du contenu : interdits hors cadres photo
