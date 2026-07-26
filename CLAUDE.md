# CLAUDE.md

## Projet

Dog Breed App — application mobile permettant d'identifier la race d'un chien à partir
d'une photo, et d'afficher des informations associées (description, tempérament, besoins).

Double objectif du projet :
- construire une application complète et de qualité autour d'un modèle IA déjà entraîné ;
- servir de support d'apprentissage au développement full-stack assisté par Claude Code.

Ne pas perdre de vue le second objectif : privilégier des explications claires des choix
techniques plutôt que du code généré sans contexte.

## Stack technique

- Frontend mobile : React Native + Expo
- Backend API : FastAPI (Python)
- Base de données : PostgreSQL
- Modèle IA : déjà entraîné et fourni — ce projet ne vise pas l'entraînement d'un modèle,
  seulement son intégration.

## Flux principal

```
Utilisateur → app mobile → API backend → modèle IA → résultat de classification → affichage
```

## Structure du repo (à créer/confirmer au démarrage)

- `/mobile` — app React Native / Expo
- `/backend` — API FastAPI
- `/ml` — intégration du modèle IA existant (chargement, prétraitement, inférence)
- `/docs` — décisions d'architecture, spécifications, contrat d'API

## Environnement

- Linux, gestion d'environnement Python via Miniconda/Conda
- Dépôt git : `dog_breed`, branche principale `master`

## Priorités actuelles

- Ne pas entraîner ni modifier le modèle IA existant, seulement l'intégrer
- Flux MVP minimal : upload/prise de photo → prédiction → affichage race + niveau de confiance
- Garder l'architecture simple tant que le MVP n'est pas validé — éviter la sur-ingénierie

## À définir au fil des prochaines sessions

- Mode de service du modèle IA (chargé dans le process FastAPI vs service séparé)
- Contrat d'API entre mobile et backend (format d'upload, réponse JSON, gestion des erreurs)
- Schéma de base de données PostgreSQL
- Conventions de style et de commit (backend, frontend)
- Commandes de build / lint / test une fois le projet initialisé

---
*Fichier à tenir à jour au fil du projet — garder les entrées courtes, renvoyer vers `/docs`
pour le détail plutôt que de tout coller ici.*
