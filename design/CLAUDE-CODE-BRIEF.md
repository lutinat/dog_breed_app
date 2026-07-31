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
| `mobile/src/app/crop.tsx` | **no design exists** | See gap below. |
| `mobile/src/app/result.tsx` | **S06** confident · **S13** low confidence · **S07** celebration | One screen, three states — already driven by `predictions[]` and `is_new_discovery`. |
| `mobile/src/app/collection.tsx` | **S21 Album home** + **S23 Locked breed** | 3:4 cells, `radius.xl`, breed-shaped silhouettes for locked. |
| `mobile/src/app/login.tsx` | **S32 Sign in** | Error variant is S32b. |
| `mobile/src/app/register.tsx` | **S31 Create account** | |
| `mobile/src/app/profile.tsx` | **S29 Profile** | Signed-in variant only. |
| `mobile/src/app/_layout.tsx` | **BottomNav** | The design has a real bottom nav; the app currently has text links in a row on the scan screen. |

Screens in `SCREENS.md` with **no MVP equivalent** — read for tokens and patterns, build
nothing: S01, S02, S04, S05, S09, S11, S15, S17, S18, S20, S22, S08, S25, S26, S30, S33,
S34, S36, S37, S38, S39, S40.

## Gap to resolve before starting

**The crop screen has no design.** `crop.tsx` is the largest screen in the app (11.5 kB)
and implements the manual bounding-box crop that `docs/plan.md` makes an MVP requirement —
because the ResNet50 classifier does no detection.

The prototype's closest screen, **S04 Frame the dog**, is only a confirm/retake step. It
assumes the dog area is already known. So the design silently assumes auto-detection,
which is explicitly Next-version in `roadmap.md`.

Options, in order of preference:

1. **Style `crop.tsx` from S04's vocabulary** — Field room canvas, same header/action
   layout, same button treatment — and keep the existing bbox interaction untouched.
   Cheapest, and consistent. Recommended.
2. Leave `crop.tsx` unstyled this pass and flag it.
3. Design a proper crop screen first (comes back to the design tool, not Claude Code).

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
6. `crop.tsx`, per the gap decision above.

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
> - `crop.tsx` → no design exists; style it using S04 "Frame the dog"'s visual vocabulary
>   and leave the bounding-box interaction exactly as it is
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
