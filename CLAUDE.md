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
- `/backend` — FastAPI API (`/predict` endpoint wraps the model in `/ml`; no auth/DB yet)
- `/ml` — existing ML model integration (loading, preprocessing, inference)
- `/docs` — architecture decisions, specs, API contract, [`plan.md`](docs/plan.md) (MVP
  detail), [`roadmap.md`](docs/roadmap.md) (post-MVP versions)
- [`DESIGN.md`](design/DESIGN.md) — early design-system exploration, not scheduled yet (see
  "Current priorities" below); some of it goes beyond MVP scope

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
- MVP flow works and the design system is applied to all 7 existing screens. Next up:
  first-launch onboarding (the one MVP screen in [`docs/plan.md`](docs/plan.md) not yet
  built — 2 screens, concept + collection system; designed as S01 in the prototype).

## To define in upcoming sessions

- ML model serving mode (loaded in the FastAPI process vs. a separate service)
- API contract doc: only `POST /predict` is written up (in `docs/plan.md`). The auth,
  `/breeds` and `/collection` endpoints are still undocumented outside the code.
- Confidence threshold for showing the top 3 — currently a `0.6` placeholder in
  `mobile/src/app/result.tsx`, still to be set empirically
- Where fun-fact content comes from long-term (hand-written vs. imported dataset)
- Style and commit conventions (backend, frontend)
- **No tests exist yet** (backend or mobile). The riskiest untested paths are the
  server-side crop in `/predict` and the crop-rect math in `mobile/src/app/crop.tsx`.
  Lint is `npx expo lint`; typecheck is `npx tsc --noEmit` (both from `mobile/`).

---
*Keep this file up to date as the project evolves — keep entries short, point to `/docs`
for detail instead of pasting everything here.*

## Design
UI is specified in `design/SCREENS.md` (31 screens, tokens, interaction rules).
`design/prototype/` is a browser-only visual reference — read it, never port it.
Design tokens live in `mobile/src/theme/tokens.ts`.
