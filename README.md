# Dog Breed Classification

Mobile app for identifying dog breeds from a photo, built around an existing
machine learning model.

## Structure

```
dog_breed_classification/
├── mobile/     # React Native (Expo) mobile app
├── backend/    # FastAPI API — serves the ML model, handles data
├── ml/         # Existing ML model integration (no training in this repo)
└── docs/       # Architecture decisions, specs, roadmap
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
cd backend
conda activate dog_breed   # or your environment name
uvicorn main:app --reload
```

See [backend/README.md](backend/README.md) for details.

## Prerequisites

- **Node.js**: 20+ (for the mobile app)
- **Python**: 3.10+ (for the backend), managed via Miniconda/Conda
- **PostgreSQL**: 15+
- **Expo Go** app on your phone (for testing the mobile app without a build)

## Project context

This project has two goals: build a real, working app, and learn full-stack
development using Claude Code as a development assistant. See `CLAUDE.md` for
persistent project context, and `docs/plan.md` for the development plan.
