# Dog Breed Classifier - Mobile App

Ce README concerne uniquement le dossier `mobile/` (l'application React Native + Expo).
Pour le contexte global du projet, voir `CLAUDE.md` et `docs/plan.md` à la racine.

## Overview

The mobile application is built with React Native + Expo using TypeScript.
Expo provides a cross-platform development environment with a single codebase for the mobile application.

## Project Structure

```
mobile/
├── app/
│   ├── _layout.tsx      # Navigation and app structure
│   └── index.tsx        # Main screen
├── assets/              # Images, icons, fonts
├── package.json         # Dependencies and scripts
├── app.json             # Expo configuration
└── README.md
```

The `app/` directory contains the application screens. Each file inside this folder represents a route/screen managed by Expo Router.

Example:

```
app/
├── index.tsx        # Home screen
├── collection.tsx   # Dog breed collection
└── profile.tsx       # User profile
```

## Getting Started

Install dependencies:

```bash
cd mobile
npm install
```

Start the application:

```bash
npx expo start
```

The app can then be launched with:

- Expo Go on a physical device
- Web browser
- iOS simulator
- Android emulator

## Development

The application is written in TypeScript and uses React components to build the user interface.

Main files:

- `app/index.tsx` → Main screen
- `app/_layout.tsx` → Navigation configuration

### Fast Refresh

Expo Fast Refresh automatically updates the application when source files are modified during development.

## Dependencies

Dependencies are managed through `package.json`.

To add a new Expo-compatible package:

```bash
npx expo install package-name
```

## Backend Communication

The mobile app communicates with the FastAPI backend through standard HTTP requests.

Backend location: `/backend`

The backend handles API requests, model inference, and database interactions.

For the complete project architecture, see:

- `CLAUDE.md`
- `docs/plan.md`