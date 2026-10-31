# Les Chasseurs de Brume-Haute

Chasse aux monstres au tour par tour, inspirée de Monster Hunter. Traque tes proies, forge ton équipement avec leurs restes et monte en rang. Un jeu de **Keismey Studio**, jouable dans le navigateur et installable sur téléphone.

Jouer : https://keismey.github.io/Les-Chasseurs-de-Brume-Haute/ (aussi dans le hub : https://keismey.github.io/)
Play in English: https://keismey.github.io/Les-Chasseurs-de-Brume-Haute/?lang=en

Le jeu est en français et en anglais : `?lang=fr` ou `?lang=en` dans l'adresse fixe la langue (le choix est retenu), sinon c'est celle de l'appareil.
Installable sur l'écran d'accueil (PWA), jouable hors ligne une fois chargé, sauf la musique.

## Fichiers

- `index.html` — la page : écran de démarrage, styles, choix de la langue, identifiant de version `BUILD_ID`
- `game.fr.js`, `game.en.js` — le jeu, une version par langue (`index.html` charge celle qui convient)
- `sw.js` — mode hors ligne ; le nom du cache (`cbh-…`) suit l'identifiant de version
- `version.json` — l'identifiant de la dernière version publiée
- `manifest.webmanifest` — installation sur téléphone
- `icons/`, `img/` — icônes de l'appli, bannières, illustrations
- `audio/` — les musiques (lues en flux, jamais mises en cache)
- `fonts/` — Almendra et Signika, hébergées avec le jeu (licence SIL OFL, voir `fonts/OFL-*.txt`)
- `outils/verif_langues.py` — contrôle que `game.fr.js` et `game.en.js` ont le même code (voir plus bas)

## Contrôle français / anglais

Le jeu existe en deux fichiers, un par langue, qui doivent garder exactement le même code : seuls les textes changent. Après toute modification de l'un des deux, lancer depuis la racine du dépôt :

    python3 outils/verif_langues.py

Le script (Python 3, sans dépendance) retire les textes, les commentaires et les regex, puis compare le code qui reste. « OK » : les deux fichiers sont alignés. Sinon, il affiche chaque écart avec ses numéros de ligne : soit la correction n'a été faite que dans une langue (à reporter dans l'autre), soit l'écart est voulu (pluriel, accord, ordre des mots) et on copie la ligne proposée dans `outils/verif_langues_ok.txt`.

## Mise à jour automatique

Le même identifiant de version doit se retrouver à quatre endroits : `BUILD_ID` dans `index.html`, `v` dans `version.json`, le `?v=` des scripts du jeu dans `sw.js`, et le nom du cache `cbh-…` dans `sw.js`.

À l'ouverture du jeu, puis chaque fois que l'appli revient au premier plan, il compare `version.json` (lu sans cache) à son propre `BUILD_ID`.
Si une version plus récente est publiée, il se recharge tout seul. Il ne le fait jamais en pleine chasse, pendant l'écran de démarrage ou avec une fenêtre ouverte : dans ces cas il affiche à la place le bandeau « Nouvelle version disponible ».

La page elle-même passe toujours par le réseau d'abord (le cache ne sert que hors connexion), donc une modification de `index.html` arrive dès l'ouverture suivante.

## Sauvegarde

Dans le navigateur (`localStorage`, clé `grande-traque-v1`). Le hub Keismey Studio la lit pour afficher la progression, sans jamais l'écrire.
