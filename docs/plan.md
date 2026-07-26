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
- Image sent to the backend after manual cropping (see Feature 3)
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
3. Image is cropped client-side
4. Cropped image is sent to the model

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
- Backend: FastAPI (not scaffolded yet — `/backend` still needs to be created)
- Database: PostgreSQL
- ML: existing ResNet50, loaded and served by the backend (exact serving mode = open
  decision, see below)

## Open decisions

- Model serving mode: loaded in the FastAPI process vs. a separate service
- Mobile ↔ backend API contract: upload format (cropped image + crop metadata?),
  JSON response format (breeds + probabilities), error handling
- PostgreSQL schema: users, breeds (reference table), collection (user × discovered
  breed), possibly scan history
- Exact number of breeds supported by the model, and where fun facts come from
  (content source to define — manual writing vs. importing an existing dataset)
- Confidence threshold that triggers showing the top 3 instead of a single result

## MVP success metrics

- Users scan more than one dog
- Users return another day
- Their collection grows over time
- Users enjoy discovering new breeds
