# Dog Breed Classification

Mobile app that identifies a dog's breed from a photo, turns discoveries into a
Pokédex-style collection, and teaches the user about each breed found. Built around
an existing, already-trained ML model — see [docs/plan.md](docs/plan.md) for the full
MVP scope.

## Structure

```
dog_breed_app/
├── mobile/     # React Native (Expo) mobile app
├── backend/    # FastAPI API — serves the ML model, handles data
├── ml/         # Existing ML model integration (no training in this repo)
└── docs/       # Architecture decisions, specs, plan.md (MVP detail), roadmap.md
```

## Quick Start

### Mobile app

```bash
cd mobile
npm install
npx expo start
```

See [mobile/README.md](mobile/README.md) for details.

### Backend

```bash
conda activate dog_breed_app
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

See [backend/README.md](backend/README.md) for setup and API details.

## Prerequisites

- **Node.js**: 20+ (for the mobile app)
- **Python**: 3.10+ (for the backend), managed via Miniconda/Conda
- **PostgreSQL**: 15+
- **Expo Go** app on your phone (for testing the mobile app without a build)

## Project context

This project has two goals: build a real, working app, and learn full-stack
development using Claude Code as a development assistant. See `CLAUDE.md` for
persistent project context, and `docs/plan.md` for the development plan.
