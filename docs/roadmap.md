# Roadmap

Product vision and version breakdown. The detailed MVP scope lives in
[`plan.md`](./plan.md); this file exists to place each feature in time and avoid mixing
"MVP" with "future idea" inside `CLAUDE.md`.

Core experience the MVP is meant to validate:

```
See a dog → Take a picture → Get a breed prediction → Learn something
→ Add it to a personal collection → Feel motivated to scan another dog
```

## MVP (current version)

- Simple authentication (sign up, login, profile)
- Scan: camera photo or gallery image
- **Manual crop** of the dog area before classification (no automatic detection)
- Breed prediction via the existing ResNet50 model: main breed + confidence score,
  top 3 when confidence is low
- Probabilities displayed as a donut chart
- Pokédex-style collection: breed grid, locked silhouettes for undiscovered breeds,
  overall progress (X / Y)
- Simple "new breed discovered" animation
- Minimal breed sheet: 1-2 fun facts shown on first discovery

Full detail (screens, API contract, data model): see [`plan.md`](./plan.md).

## Next version (after MVP validation)

Features that depend on a working MVP (user accounts, breed reference table, scan
history) but aren't required to validate the core experience:

- **Automatic dog detection in the image** (replaces manual cropping) — requires a
  detection model in addition to the current classifier
- Enriched breed sheet: full description, temperament, needs (already planned in the DB)
- Scan history (not just the "discovered/not discovered" outcome)
- Guess the breed (mini-game): guess the breed from a photo or silhouette, multiple
  choice — reuses the existing breed reference data
- Learning flash cards (Anki-style): front = photo/name, back = info, swipe
  "I know it" / "I don't know it" — reuses the same data as the collection

## Future (ideas, not planned)

Require deeper model or architecture changes — only worth considering once earlier
versions are in real use:

- Automatic bounding boxes and handling multiple dogs in one image
- Segmentation
- Real-time recognition (live camera video)
- Social features (sharing, leaderboards between friends)
- Advanced gamification (scoring, progressive difficulty, spaced repetition for flash cards)

---
*Don't move an item into `CLAUDE.md` (priorities section) until it's in active
development — keep the session context short.*
