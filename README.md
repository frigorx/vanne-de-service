# La vanne de service — trois positions, deux prises

**Cours interactif pour la formation frigoriste.** La vanne de service à deux prises en
coupe animée : ce qu'un dessin fixe ne montre pas.

👉 **[Ouvrir le cours](https://frigorx.github.io/vanne-de-service/)**

Une page, aucune installation, aucun compte. Fonctionne sur téléphone, sur tablette et au
vidéoprojecteur — et **hors ligne** une fois la page chargée : une seule image (48 Ko), ni
son, ni police distante ; les coupes sont des dessins vectoriels construits par le code.

## Ce que le cours montre

Le carré de manœuvre, la tige et le pointeau se déplacent comme **un seul ensemble de
longueur constante** ; le presse-étoupe, lui, reste fixe. Chaque position ouvre ou ferme
des passages différents :

| Position | Passage tuyauterie ↔ compresseur | Voies de service |
|---|---|---|
| **Fermée sur l'arrière** | ouvert | **P isolée** · P1 reste reliée au compresseur |
| **Position intermédiaire** | ouvert | P et P1 communiquent — c'est la **position de lecture** |
| **Fermée sur l'avant** | **fermé** | P et P1 restent reliées au compresseur |

Sur les coupes, le bleu plein marque les volumes qui communiquent avec le compresseur, le
gris hachuré un volume isolé par le pointeau. **Un volume isolé n'est ni vide ni sans
pression.**

**L'adresse ouvre un sommaire** : quatre tuiles, on choisit par où entrer. Une seule adresse
à partager, donc — et on revient au sommaire par le bouton « ☰ Sommaire », par le bouton du
bas sur le premier écran, ou par la touche Échap.

Quatre écrans : les trois positions · le même organe côté BP et côté HP · le geste et la
sécurité (où brancher le flexible, où va le pressostat, les points de fuite) · deux
mini-jeux corrigés (repérage cliquable sur la coupe, puis cinq décisions de chantier).

## Pour la classe

- **Bouton « Aa »** — taille du texte de 70 à 160 %, et police **Lexend** pour les
  lecteurs DYS. Le réglage est mémorisé.
- **Bouton « 🖨 Livret »** (ou Ctrl+P) — sort les quatre écrans en un livret A4 d'environ
  quatre pages, **corrigé des neuf questions compris**. La couleur est gardée, et chaque
  état porte aussi un style de trait et un mot : photocopié, un vert et un rouge sont
  indiscernables.
- **Adresse directe de chaque écran** — `?ecran=positions`, `?ecran=bp-hp`,
  `?ecran=geste`, `?ecran=jeux` : ces adresses **sautent le sommaire** et ouvrent droit sur
  l'écran voulu. Le bouton « 🔗 Copier le lien » donne l'adresse exacte de l'écran affiché :
  de quoi envoyer un seul écran en réponse à la question d'un élève. Pour partager le cours
  entier, l'adresse nue suffit.

## ⚠ Avertissement métier

Ce sont des **schémas de principe pédagogiques**, pas une notice d'intervention. La forme,
les filetages, le nombre de tours et le sens de manœuvre varient selon le constructeur :
la documentation du fabricant fait foi.

**La prise P1 peut rester sous pression dans toutes les positions de la vanne. Ne jamais
défaire son bouchon sur une installation chargée.**

Le résultat des mini-jeux est un entraînement, jamais un examen officiel.

## Vie privée

Aucune donnée n'est collectée, aucun compte, aucun serveur : le seul réglage conservé sur
l'appareil est la taille du texte. Le cours ne charge aucune ressource extérieure.

## Où il vit aussi

Ce cours fait partie du pack de formation **habilitation fluides frigorigènes**
([`frigorx/pilote-fluides`](https://github.com/frigorx/pilote-fluides)), où il est relié
aux fiches sur le manifold, l'ordre des vannes et le compresseur. Ce dépôt-ci en est la
version **autonome**, à ouvrir d'un simple lien. Les deux copies sont identiques au
2 août 2026 ; en cas de divergence, celle du pack fait foi.

Détail de ce que le cours couvre du référentiel officiel : `couverture.json`.
Sources de construction et limites : `SOURCES.md`. Notice complète : `LIRE-MOI.txt`.

## Licence

© 2026 **Franck Henninot — inerWeb Édu**. Dépôt public ne veut pas dire libre de droits.

- **Contenu pédagogique** (textes, schémas, questions) : **CC BY-NC-SA 4.0** — utilisable
  et adaptable gratuitement pour l'enseignement, à condition de citer l'auteur et de
  repartager à l'identique. **Pas d'usage commercial** sans accord écrit.
- **La vue en perspective du sommaire** (`vanne-3d.webp`) : rendu réalisé par l'auteur
  **d'après la géométrie de la documentation constructeur**. Elle est publiée à des fins
  pédagogiques, pour reconnaître l'organe ; la géométrie représentée reste celle du
  constructeur et cette image n'est pas couverte par la licence ci-dessus. Détail dans
  `SOURCES.md`.
- **Code** (`app.js`, `valve-diagram.js`, `styles.css`, `impression.css`,
  `moteur/lisibilite.js`) : **MIT**.
- **Police Lexend** : SIL Open Font License — voir `moteur/polices/LICENCE-LEXEND.txt`.
