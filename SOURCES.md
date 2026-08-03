# Sources — La vanne de service

Intégration au pack : 2 août 2026.

## Origine du module

Module produit **hors de ce dépôt** par F. Henninot (dossier
`Bureau\inerweb full ia\vanne-rotalock-pedagogique`), puis intégré ici : charte
du pack appliquée, réglage de lisibilité repris du moteur commun, adressage par
`?ecran=`, couverture déclarée code par code. Le parcours élève en dix planches
fixes du dossier d’origine n’a **pas** été repris : il fait double emploi avec
les quatre écrans de ce cours.

## Référentiel

- Règlement d’exécution (UE) 2024/2215, annexe I — compétences 4.01, 4.05 et
  5.01 (6.01 et 6.06 en appui seulement) :
  <https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R2215>

## Sources de construction du dessin

Documents fournis par F. Henninot, conservés dans le dossier d’origine et **non
versionnés ici** (documentation constructeur et photographies d’atelier) :

- `4655-serie-7-activite-3-vanne-de-service.pdf` — nomenclature, trois positions
  et communication permanente entre P1 et le compresseur ;
- `ID448462306916-0101.pdf` — implantation de la vanne, prises 1/4 SAE et carré
  de manœuvre ;
- `ID447759029458-0101.stp` et `ID360741599858-0101.png` — géométrie extérieure
  de référence ;
- photographie d’atelier du 2 août 2026 — position du pointeau, des deux sièges
  et des deux prises de pression.

## Sources locales du pack

- `packs/fluides/cartes.js`, fiches `p1`, `p5`, `g6b` et `g9b` — le paragraphe
  de `g6b` sur les trois positions de la vanne de service est ce que ce cours
  met en image ;
- `packs/fluides/referentiel-2025.json` — libellés officiels des codes déclarés ;
- `MATRICE-COMPETENCES.md` — où chaque code est enseigné et vérifié.

## La vue d’ensemble du sommaire (`vanne-3d.webp`)

Rendu en perspective de la vanne, **d’après la géométrie de la documentation
constructeur** (fichier `ID447759029458-0101.stp` cité ci-dessus), rendu et
mise au point par **F. Henninot**, qui en assume la diffusion à des fins
pédagogiques — décision du 3 août 2026. La géométrie représentée reste celle
du constructeur ; l’image est utilisée pour **reconnaître l’organe**, jamais
comme document d’intervention ni comme pièce commerciale.

Poids : 48 Ko en WebP (1024 px de large), recadré sur la zone utile — le PNG
d’origine faisait 669 Ko pour 1920 × 1080, à plus de la moitié vide.

C’est la **seule** image du cours ; tout le reste est dessiné par le code.
Les coupes sont des SVG construits par `valve-diagram.js`. Le cours fonctionne
hors ligne.

## Limites

Les dessins sont des **schémas de principe pédagogiques**, pas une notice
d’intervention : la forme, les filetages, le nombre de tours et le sens de
manœuvre varient selon le constructeur. Le cours ne prescrit aucune valeur de
pression, de couple ni de durée. La prise P1 peut rester sous pression dans
**toutes** les positions : son bouchon ne se défait jamais sur une installation
chargée. La validation pratique sur le plateau reste indispensable.
