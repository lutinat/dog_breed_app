# Roadmap — fonctionnalités futures

Ce fichier liste les fonctionnalités envisagées après le MVP (scan + identification de race).
Ne pas intégrer ces éléments dans `CLAUDE.md` tant qu'ils ne sont pas en cours de dev active,
pour garder le contexte de session court.

## 1. Collection façon Pokédex

- Grille des races, silhouettes verrouillées pour celles non découvertes
- Fiche détail par race : description, stats, tempérament, besoins (déjà prévu en base)
- Progression globale (X / Y races découvertes)
- Prérequis : système de comptes utilisateurs pour persister la progression

## 2. Guess the breed (mini-jeu)

- Deviner la race à partir d'une photo ou d'une silhouette, en choix multiples
- Réutilise les données de la table races existante
- À définir plus tard : système de score, difficulté progressive

## 3. Flash cards — apprentissage des races

- Objectif : mémorisation, pas un jeu
- Une carte par race : recto (photo ou nom), verso (infos/description)
- Interaction swipe gauche / droite façon Anki : "je connais" / "je ne connais pas"
- Réutilise les mêmes données que la collection (pas de nouvelle source de données)
- À définir plus tard : logique de répétition espacée (répéter les cartes "pas connues" plus souvent)

---
*À déplacer dans `CLAUDE.md` (section priorités) uniquement quand une de ces fonctionnalités
passe en développement actif.*
