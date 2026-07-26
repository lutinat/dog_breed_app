# CLAUDE.md

## Project

Dog Breed App — mobile app that identifies a dog's breed from a photo, turns it into a
Pokédex-style collection game, and teaches the user a bit about each breed discovered.

Dual purpose of this project:
- build a complete, good-quality app around an already-trained ML model;
- serve as a learning vehicle for full-stack development assisted by Claude Code.

Keep the second goal in mind: favor clear explanations of technical choices over code
generated without context.

## Tech stack

- Mobile frontend: React Native + Expo, TypeScript
- Backend API: FastAPI (Python) — not scaffolded yet
- Database: PostgreSQL
- ML model: already trained and provided — this project does not train or modify the
  model, only integrates it. It currently does breed **classification only**: no dog
  detection, no automatic bounding boxes, no segmentation, no multi-dog handling. Do not
  assume these capabilities exist.

## Main flow

```
User → mobile app → manual crop → backend API → ML model → classification result → display
```

## Repo structure

- `/mobile` — React Native / Expo app
- `/backend` — FastAPI API (to create)
- `/ml` — existing ML model integration (loading, preprocessing, inference)
- `/docs` — architecture decisions, specs, API contract, [`plan.md`](docs/plan.md) (MVP
  detail), [`roadmap.md`](docs/roadmap.md) (post-MVP versions)

## Environment

- Linux, Python environment managed via Miniconda/Conda
- Git repo: `dog_breed_app`, main branch `main`
- The ML training code lives in a separate repo (`dog_breed/model`) — not part of this
  repo. This project only consumes the trained weights (`ml/resnet50_first_run.pth`).

## Current priorities

- Do not train or modify the existing ML model, only integrate it
- MVP scope: auth, scan with manual crop, breed prediction (top-3 shown when confidence
  is low), Pokédex-style collection, 1-2 fun facts per breed on first discovery — full
  detail in [`docs/plan.md`](docs/plan.md)
- No automatic dog detection in the MVP — the user manually crops the dog area before
  the image is sent to the model
- Keep the architecture simple until the MVP is validated — avoid over-engineering
- Features beyond the MVP (auto-detection, mini-games, flash cards, social, etc.) belong
  in [`docs/roadmap.md`](docs/roadmap.md), not here, until they're in active development

## To define in upcoming sessions

- ML model serving mode (loaded in the FastAPI process vs. a separate service)
- API contract between mobile and backend (upload format, JSON response, error handling)
- PostgreSQL schema (users, breeds, collection, possibly scan history)
- Style and commit conventions (backend, frontend)
- Build / lint / test commands once the project is initialized

---
*Keep this file up to date as the project evolves — keep entries short, point to `/docs`
for detail instead of pasting everything here.*
