# Jeux de Mémoire Cognitifs (Devoir 3)

Ce projet est un prototype interactif haute-fidélité développé en React, dans le cadre du Devoir 3 du cours de conception centrée sur l'utilisateur à l'Université d'Ottawa. Il vise à explorer la cognition humaine à travers des jeux de mémoire, en appliquant les principes d'attention, de perception et de Gestalt dans la conception de l'interface.

## Description du projet

Un jeux sont inclus :

- **Flag Guesser** : Un jeu où l'utilisateur doit reconnaître le drapeau d'un pays parmi 4 options. L'objectif est d'enchaîner 20 bonnes réponses pour gagner. Ce jeu teste la mémoire visuelle et la reconnaissance rapide.

Chaque jeu propose plusieurs niveaux de difficulté et des options de configuration (thème, mode sombre, etc.).

## Technologies utilisées
- React (Vite)
- JavaScript (ES6+)
- CSS (avec classes utilitaires pour la mise en page et les couleurs)

## Fonctionnalités principales
- Interface utilisateur moderne, colorée et responsive
- Sélection du niveau de difficulté et du thème
- Feedback immédiat et animations (ex : confettis, transitions)
- Sauvegarde des meilleurs scores/localStorage
- Accessibilité (contrastes, typographie, navigation claire)
- Application des principes de Gestalt (similarité, continuité, hiérarchie visuelle)

## Lancer le projet en local

```bash
npm install
npm run dev
```

## Structure du code
- `src/flaggame.jsx` : Jeu de reconnaissance de drapeaux
- `src/App.jsx` : Point d'entrée principal (actuellement FlagGame par défaut)
- `src/main.jsx` : Initialisation React

## Rapport et exigences
Ce projet répond aux exigences du Devoir 3 :
- Prototypage haute-fidélité d'un jeu de mémoire
- Deux storyboards/personnages (voir rapport séparé)
- Application des principes de conception visuelle et de cognition
- Hébergement possible sur Netlify/Vercel/GitHub Pages
