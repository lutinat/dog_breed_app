# MVP Plan

This document details the MVP scope. `CLAUDE.md` stays short and points here for detail.
For what comes after the MVP, see [`roadmap.md`](./roadmap.md).

## Target experience

```
See a dog → Take a picture → Crop → Get a breed prediction → Learn something
→ Add it to a personal collection → Feel motivated to scan another dog
```

The MVP combines three hooks: playful discovery, Pokédex-style collection, and learning
about breeds. The goal isn't maximum model accuracy — it's validating that this loop
makes users want to come back.

## What the ML model can (and can't) do

Model: ResNet50, already trained (`ml/resnet50_first_run.pth`), trained/evaluated in the
separate `dog_breed/model` repo. This project does **not** train the model, only
integrates it.

The model does classification only: image (already cropped to the dog) → probability
distribution over known breeds.

It does **not** do:
- dog detection in the image
- automatic bounding boxes
- segmentation
- handling multiple dogs in one image

Direct consequence for the product flow: until a detection model exists, cropping must
be done manually by the user before sending the image to the model (see Feature 3
below). Don't build anything in the MVP that assumes automatic detection.

## MVP Features

### 1. Authentication

- Sign up / login / user profile
- Each user has their own collection of discovered breeds
- Keep it simple: no social login, no OAuth for the MVP (revisit later)

### 2. Breed classification

- Take a photo (camera) or pick one from the gallery
- Full image plus crop coordinates sent to the backend, which crops before inference
  (see Feature 3)
- Expected result:
  - main breed + confidence score
  - top 3 breeds when confidence is low
- A breed isn't always uniquely identifiable: never show a single label without context.
  Display probabilities visually (donut chart) and the top 3 when uncertainty is high.
- The confidence threshold for "low" needs to be defined empirically once the model is
  wired up (open decision, see below).

### 3. Image preparation before classification

No automatic detection in the MVP. Flow:

1. User takes a photo
2. User manually selects the dog area (interactive bounding box)
3. The full photo (downscaled client-side to ~1600px on the long edge) plus the box
   coordinates are sent to the backend
4. The backend crops the image to that box before running the model

Cropping happens server-side rather than on-device: `POST /predict` takes the full
(downscaled) image as `file` plus `origin_x` / `origin_y` / `width` / `height` form
fields describing the box, in that image's pixel coordinates. The response shape is
unchanged — `{ predictions: [{ breed, score }] }`.

Automatic detection is a Next-version improvement (see `roadmap.md`), not an MVP
requirement.

### 4. Collection / Pokédex

- Grid of breeds
- Discovered breeds shown normally, undiscovered breeds shown as locked silhouettes
- Overall progress, e.g. `35 / 120 breeds discovered` (exact breed count = number of
  model classes, to confirm from the checkpoint)
- Simple "new breed discovered" animation on add

### 5. Breed knowledge

- On first discovery of a breed: 1-2 fun facts, short and engaging content
- Goal: make users curious to scan more breeds, not build a full encyclopedia
  (enriched breed sheet = Next version)

## MVP Screens

- **First launch**: 2-screen onboarding (concept + collection system)
- **Auth**: Login / Register / Profile
- **Scan**: camera access, scan button, gallery picker, "how it works" explanation
- **Crop**: display image, manual dog area selection, confirm crop
- **Scan result**: dog image, predicted breed, confidence score, donut chart of
  probabilities, top 3 if uncertain, "Add to collection" button
- **Collection**: breed grid, locked silhouettes, overall progress

## Out of scope for MVP

Do not implement now (see `roadmap.md` for when it comes back):

- Automatic dog detection / automatic bounding boxes
- Multiple dogs in one image
- Segmentation
- Real-time recognition (video)
- Social features
- Advanced gamification (scoring, mini-games, spaced repetition)

## Architecture

- Mobile: React Native + Expo, TypeScript
- Backend: FastAPI, in `/backend` (auth, `/predict`, `/breeds`, `/collection`)
- Database: PostgreSQL, schema in `backend/app/models.py` — `users`, `breeds`
  (reference table, 130 rows), `collection` (user × discovered breed). No scan
  history table yet.
- ML: existing ResNet50, loaded and served by the backend (exact serving mode = open
  decision, see below)

## Open decisions

- Model serving mode: loaded in the FastAPI process vs. a separate service
- Where fun-fact content comes from long-term (hand-written vs. importing an existing
  dataset) — the 130 seeded breeds currently carry hand-written EN/FR facts
- Confidence threshold that triggers showing the top 3 instead of a single result —
  currently a `0.6` placeholder in `mobile/src/app/result.tsx`, to be set empirically

## MVP success metrics

- Users scan more than one dog
- Users return another day
- Their collection grows over time
- Users enjoy discovering new breeds
