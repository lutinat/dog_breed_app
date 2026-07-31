# Claude Code — design implementation brief

Paste the **Kickoff prompt** at the bottom into Claude Code. Everything above it is
context for why the task is scoped the way it is.

## The scope decision

`design/SCREENS.md` describes **31 screens**. The app has **7**. Do not build 31.

The design covers the full product vision, including post-MVP surfaces (map, mini-game,
mix results, offline queue, account merge, rarity tiers). `docs/plan.md` is the authority
on *what ships*; `design/SCREENS.md` is the authority on *what it looks like*. Where they
disagree, the plan wins and the design waits.

The MVP job is therefore: **restyle the 7 existing screens to match the design system,
without adding features.** The routing, API calls, and auth already work — this is a
visual pass over working code, not a rebuild.

## Screen mapping

| Existing file | Design reference | Notes |
|---|---|---|
| `mobile/src/app/index.tsx` | **S03 Camera** | Field room: `canvasField` bg, marigold shutter. Gallery picker becomes a secondary affordance, not a peer button. |
| `mobile/src/app/crop.tsx` | **S04 Frame the dog** | Full design exists. Also carries a behaviour change — see below. |
| `mobile/src/app/result.tsx` | **S06** confident · **S13** low confidence · **S07** celebration | One screen, three states — already driven by `predictions[]` and `is_new_discovery`. |
| `mobile/src/app/collection.tsx` | **S21 Album home** + **S23 Locked breed** | 3:4 cells, `radius.xl`, breed-shaped silhouettes for locked. |
| `mobile/src/app/login.tsx` | **S32 Sign in** | Error variant is S32b. |
| `mobile/src/app/register.tsx` | **S31 Create account** | |
| `mobile/src/app/profile.tsx` | **S29 Profile** | Signed-in variant only. |
| `mobile/src/app/_layout.tsx` | **BottomNav** | The design has a real bottom nav; the app currently has text links in a row on the scan screen. |

Screens in `SCREENS.md` with **no MVP equivalent** — read for tokens and patterns, build
nothing: S01, S02, S04, S05, S09, S11, S15, S17, S18, S20, S22, S08, S25, S26, S30, S33,
S34, S36, S37, S38, S39, S40.

## S04 is the crop screen

`crop.tsx` is the largest screen in the app (11.5 kB) and implements the manual
bounding-box selection that `docs/plan.md` requires — the ResNet50 classifier does no
detection, so the user places the box themselves.

**S04 "Frame the dog" is designed for exactly this.** It is not a confirm/retake step. Its
spec:

- Field room — `canvasField` background, photo inset 16px with `radius.md`.
- The photo is overlaid with `rgba(15,33,27,.5)`; the selection box punches through as the
  only undimmed region.
- Box border: **1.5px `color.accent`**, `borderRadius: 4` — note the small radius, this is
  a measuring tool, not a card.
- **Four corner handles**: 16×16, `radius: 4`, solid `accent`, offset `-7px` so they
  straddle the border. These are the drag targets.
- Box carries `shadow.fieldGlow` so it reads as lit against the dimmed photo.
- Header row: `rotate-ccw` **Retake** ghost link left, `labelUppercase` "Frame the dog"
  centered, spacer right.
- Below: first-time-only hint in `bodySm` / `onFieldMuted`, centered — "Drag the corners so
  the dog fills the box" — then a full-width pine **Identify this dog** button.

**Keep the gesture and box-state code as-is** — `resizeFromCorner`, the four `Gesture.Pan`
handlers, the mask rects, and the `confirm()` scale math already produce exactly this
interaction. Replace only the chrome: white 2px box → 1.5px `accent` at `radius: 4`;
round white handles → 16×16 marigold squares at `radius: 4`; `#111` stage → Field canvas;
`rgba(0,0,0,0.5)` masks → `rgba(15,33,27,.5)`; "Confirm Crop" → "Identify this dog".

`HANDLE_SIZE` is currently 28 and doubles as both the visual and the touch target. Split
them: render 16×16 per the design, keep a 44px touch area via `hitSlop`.

## Behaviour change: stop writing a cropped file

The screen currently does two jobs. Only the first is wanted:

1. Let the user place and resize a box — **keep**.
2. On confirm, run `ImageManipulator.manipulateAsync` to write a new cropped JPEG and
   route to `/result` with that file's uri — **remove**.

`confirm()` already computes the box in natural image coordinates. Pass the **original
uri plus that rect** to `/result` instead of a derived file. Three consequences:

**The result screen still needs to show the framed dog.** Not cropping a *file* does not
mean showing the whole photo — S06 shows the dog, not the scene. Render a display-only
crop: a container sized to the box aspect ratio with the full `Image` inside, offset and
scaled so the box region fills it. No file written, same visual result.

**The `/predict` contract changes.** It takes `file` today. It now needs the full image
plus `origin_x` / `origin_y` / `width` / `height`, and the backend crops before inference.
`docs/plan.md` lists this as an open decision — *"upload format (cropped image + crop
metadata?)"* — so this closes it. Update the plan when it lands.

**Uploads get bigger.** A full-res photo instead of a crop. Downscale the long edge
client-side (~1600px) before upload, before the crop rect is applied — and scale the rect
by the same factor.

Do this as its own commit, separate from the restyle. Behaviour and appearance changing in
one diff makes a visual regression hard to spot.

## Two `CLAUDE.md` edits needed first

Both will actively mislead Claude Code otherwise:

1. The priorities section says *"Engineering comes first, design comes after: build the
   MVP flow with plain UI, don't implement `DESIGN.md` yet."* That is now false. Replace
   with: *"MVP flow works. Current phase: apply the design system to the 7 existing
   screens per `design/SCREENS.md` — restyle only, no new features."*
2. The link `[DESIGN.md](DESIGN.md)` points at the repo root; the file is now at
   `design/DESIGN.md`.

## Ground rules for the restyle

- **Every value comes from `mobile/src/theme/tokens.ts`.** No hex, font size, radius, or
  spacing literal anywhere else. The current screens have `#2C5F4F` hardcoded in five
  files — those are the first thing to replace.
- **Marigold (`color.accent`) signals reward/discovery only.** Never a default button. In
  the MVP it appears in exactly two places: the camera shutter and the "New breed"
  celebration. The primary button colour is pine.
- **Fonts must be loaded** via `expo-font` before `type.*` does anything: Fraunces
  SemiBold, Inter Regular/Medium/SemiBold, IBM Plex Mono Medium. Do this in `_layout.tsx`
  with a splash hold, or every text style silently falls back to system.
- **Numbers the user tracks are mono** — confidence %, collection counts, progress.
- **Copy rules are acceptance criteria**, not suggestions. `SCREENS.md` has them: no
  apologies in errors, no emoji, buttons say what happens. `result.tsx`'s "Couldn't save
  to your collection. Try again." already complies; keep that standard.
- **Press feedback is uniform**: scale to `motion.pressScale` (0.96) over 100 ms,
  spring release. Applies to every tappable element.
- `design/prototype/` is a **browser reference**. Open it to see intent. Never port its
  code — it is Babel-in-browser with `window`-scoped components and a review harness that
  must not ship.

## Suggested order

1. Fonts + `_layout.tsx` + bottom nav — nothing else looks right until type loads.
2. `index.tsx` (S03) — establishes the Field room.
3. `result.tsx` (S06/S13/S07) — the payoff screen, and the most design-dense.
4. `collection.tsx` (S21/S23).
5. `login.tsx` / `register.tsx` / `profile.tsx`.
6. `crop.tsx` (S04) — last, because it is the only one where restyling touches gesture code.

One screen per commit. Review each before moving on — a token misread on screen 1 that
propagates through 7 is much worse than a slow start.

---

## Kickoff prompt

> Read `design/SCREENS.md`, `docs/plan.md`, and `mobile/src/theme/tokens.ts`.
>
> The MVP flow works — 7 screens in `mobile/src/app/`, plain UI. This task applies the
> ToutouDex design system to them. **Restyle only: no new screens, no new features, no
> routing or API changes.**
>
> `SCREENS.md` documents 31 screens because it covers the full product vision. Most are
> post-MVP. Build only these mappings:
>
> - `index.tsx` → S03 Camera
> - `result.tsx` → S06 (confident) / S13 (low confidence, top 3) / S07 (new discovery)
> - `collection.tsx` → S21 Album home + S23 Locked breed
> - `login.tsx` → S32, `register.tsx` → S31, `profile.tsx` → S29
> - `_layout.tsx` → the design's bottom nav
> - `crop.tsx` → S04 "Frame the dog" — marigold 1.5px box at radius 4, four 16×16 marigold
>   corner handles, `rgba(15,33,27,.5)` masks, "Drag the corners so the dog fills the box"
>   hint, "Identify this dog" button. Keep the gesture/box-state code; replace the chrome.
>   Render handles at 16×16 with a 44px `hitSlop` rather than a 28px visual.
>
> `crop.tsx` also needs a behaviour change, **as a separate commit before the restyle**:
> stop calling `ImageManipulator.manipulateAsync`. Pass the original uri plus the box rect
> (already computed in `confirm()`) to `/result`; show the framed region there as a
> display-only crop; send the full image plus crop metadata to `/predict` and crop
> server-side. Downscale the long edge to ~1600px before upload and scale the rect to
> match.
>
> Rules:
> - Every colour, size, radius, and spacing value comes from `theme/tokens.ts`. Remove all
>   hardcoded hexes from the existing screens.
> - Load the five font faces with `expo-font` in `_layout.tsx` first — nothing else works
>   until that lands.
> - Marigold `accent` is reward-only: the camera shutter and the new-breed celebration.
>   Primary buttons are pine.
> - Follow the copy rules in `SCREENS.md` verbatim.
> - `design/prototype/` is a browser-only visual reference. Read it; never port it.
>
> Start with fonts and `_layout.tsx`, then `index.tsx`. Show me each screen before moving
> to the next. Explain the token choices as you go — I'm using this project to learn.
