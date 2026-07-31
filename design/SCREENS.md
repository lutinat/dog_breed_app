# Handoff: ToutouDex — Scan & Collect (31 screens)

## Overview

ToutouDex is a mobile app that turns dog-breed identification into a collection game: point the camera at a dog, get a breed ID with a confidence score, and add it to a trading-card-style collection. This handoff covers the complete v1 flow — 31 screens spanning the scan chain, all six scan outcomes (including failures), the album/collection, account creation and sign-in, and the system/permission screens.

The design's organising idea is **two rooms**, and it drives nearly every visual decision:

- **Field** — the camera and framing screens. Deep pine-black canvas (`#0F211B`), almost no chrome, one glowing marigold shutter. This is functional darkness for glare reduction outdoors, *not* a dark-mode theme. Motion here is quick and mechanical, like a rangefinder snapping focus.
- **Album** — collection, results, breed detail, profile, settings. Warm paper cream canvas (`#FBF7EF`), warm-tinted shadows, a serif for breed names so they read hand-labeled rather than corporate. Motion here is springier — a card settling with a little bounce.

Marigold (`#F2A93B`) does exactly one job in the entire app: signalling a reward or a new discovery. It is never a default button, link, or nav-highlight colour. Getting this wrong is the fastest way to make the build feel off-brand.

## About the Design Files

**The files in this bundle are design references created in HTML.** They are prototypes that demonstrate intended look, copy, and behaviour — they are not production code to copy into your app.

Your task is to **recreate these designs in the target codebase's existing environment**, using its established patterns, component library, navigation, and state management. If the project is React Native, build them as React Native screens; if SwiftUI, as SwiftUI views; and so on. If no environment exists yet, choose the framework most appropriate for a camera-centric mobile app and implement there.

Specifically, do not carry over these prototype-only mechanics:

- Everything is a single `window`-scoped Babel-in-browser bundle with components assigned via `Object.assign(window, {...})`. That is a constraint of the preview environment, not an architectural suggestion.
- The left-hand control panel in `Prototype.html` is a **review harness**, not part of the product. It exists so a reviewer can force conditions (offline, camera blocked, which result the next scan returns, how many sightings the repeat card has). It must not ship.
- `Photo` renders a grey placeholder box. Every one of those is real breed photography in the shipped app — see **Assets**.
- Screen routing is a flat `route` string with a manual history array. Use your platform's real navigator.

## Fidelity

**High-fidelity.** Colours, typography, spacing, radii, shadows, copy, and interaction behaviour are all final and drawn from a real design system (see **Design Tokens**). Recreate the UI to match. Two deliberate exceptions, both flagged:

1. **Breed photography is placeholder.** Layout, aspect ratios, and crop shapes are final; the images are not.
2. **Icons are Lucide** as a documented substitution — the source spec described "simple line icons" without supplying a set. Swap in the real icon set if one exists, keeping the single-weight line style.

## Screens / Views

The prototype groups screens the way the flow does. IDs match the labels in the review harness.

### Scan chain (Field room — dark canvas)

| ID | Name | Purpose |
|---|---|---|
| S01 | Welcome | First launch. Centered Fraunces wordmark, two cards (scan / browse), then buttons. Card-deal entry animation. |
| S03 | Camera | The home screen. Live viewfinder, marigold shutter, `?` pill opening framing tips, album pill, bottom nav. |
| S03b | Camera — how to scan | Same screen with the framing-tips sheet open. Also the destination for "None of these" from S13. |
| S04 | Frame the dog | Confirm/retake the captured frame before analysis. |
| S05 | Analyzing | 1.5s indeterminate state. Paw-print loading motif. Cancellable. |
| S02 | Camera blocked | Permission permanently denied. **Must not be a dead end** — offers Settings *and* "Browse the breeds instead". |

**S03 layout notes:** the scan invitation sits **16px from the bottom nav**, matching the Map and Play teasers so the three tab destinations share a rhythm. The shutter is a true pill/circle carrying `--shadow-field-glow` — the Field room gets its depth from that marigold bloom rather than drop shadows.

### Outcomes (Album room — cream canvas)

All six results share a `ResultHeader`: a 44×44 close button top-left, an optional status element top-right (rarity chip, "Mix" pill, Undo link, or the source thumbnail).

| ID | Name | Purpose |
|---|---|---|
| S06 | Breed found | Confident ID. Confidence ring, breed name in Fraunces, one fact, "Add to collection". |
| S07 | New breed | The celebration beat — flip-and-glow modal over S06, under 1 second. |
| S09 | Met again | A breed already collected. Sighting count, photo grid, tier progress, **Undo**. |
| S11 | Looks like a mix | Two-parent split. Per-parent cards with percentages. |
| S13 | Not sure | Three candidates to disambiguate by eye. |
| S15 | No dog found | Three concrete fixes, then "Take another photo". |
| S17 | Offline queued | Scan saved, will resolve on reconnect. |
| S18 | Server error | "Our side, not yours." Photo is preserved. |

#### S06 — Breed found (detail)

- **Confidence ring**: 196px, segments drawn from the model's top-two probabilities (`84%` primary pine, `9%` secondary sky). A pill overlaps the ring's bottom edge (`bottom: -6px`, centered) reading `84% sure` in **IBM Plex Mono** — any number the user tracks over time is mono, always.
- **Breed name**: `display-lg` (Fraunces 28/1.2, -0.2px). Above it, an uppercase `New breed` label in `--accent-deep` (#D6871B — the deep variant, so small text stays legible where flat marigold would not). Below, `caption`: `Working group · 41st breed in your guide`.
- **Fact card**: `tone="fact"` — sky-tinted surface, sparkles icon, `Did you know` label in `--secondary`. Exactly one fact. The spec is explicit that facts are served in small doses, framed as a prize, never a Wikipedia stub.
- **Primary action**: `Button variant="accent"`, full width — this is the reward moment, the one place marigold is a button.
- **Secondary**: ghost link, "Not this breed? See other guesses" → S13.

#### S09 — Met again, and how Undo works

This screen is where the **duplicate-count logic** lives, and it was the subject of a specific audit. The behaviour:

The sighting is written **on arrival** — the user does not confirm it. That means Undo has to reverse a real write, not cancel a pending one. On this screen, for a card at sighting count *n*:

- `×n` in `data-lg` mono, pine when the sighting stands, muted when undone.
- A 4-column photo grid showing up to 4 tiles. The **newest tile carries a 2px pine outline** (`outlineOffset: 2`); older ones sit at 75% opacity.
- `ProgressBar value={n} max={10}` and the line `{10 - n} more Goldens and this card turns silver.` At n=4 that reads "6 more" — the count, the grid, the bar, and the sentence must always agree. Derive all four from one number; do not hardcode them independently.
- Tier chip reads `bronze` below 10.

**Undo** (`undo-2` ghost link, top-right):

- Reverses immediately — no confirmation dialog. The action is cheap to reverse, so a modal would be pure friction.
- On undo: count drops to *n−1*, the newest photo tile is replaced by a **dashed-hairline empty slot** (so the removal is visible, not just absent), the progress bar and sentence recompute, and the Undo link itself disappears.
- A toast appears: dark `--ink` surface, 16px side insets, 24px from the bottom, `--radius-md`, `--shadow-elevated`. Copy: `Sighting removed — back to ×3.` with a **Redo** action in marigold. Auto-dismiss after 4 seconds; Redo restores the sighting and the outlined tile.
- **The reversal stays two-way after the toast expires.** The header slot does not empty out — it swaps to a pine `rotate-ccw` / **Add it back** link for as long as the sighting is undone. The toast is a convenience, not the only recovery affordance; without this the screen becomes a dead end, violating the terminal-state rule below.
- Undo state is **transient**. It is deliberately excluded from any persisted session slice: restoring a reversal whose 4-second toast has already fired would strand the user on a reduced count with no visible way back.

#### S11 → S13 — the mix-split logic

Also audited, and it contained a real bug worth calling out so it isn't reintroduced.

S11 presents a two-parent split: `Labrador × Husky`, 44% / 31%. The ring's two segments sum to 75, deliberately — the remaining 25% is unattributed and is *not* drawn, because claiming certainty the model doesn't have would be dishonest. The copy states the data rule plainly: *"Mixes get their own shelf. This photo also joins both parent cards as a sighting — neither counts as discovered."* Implement exactly that: adding a mix creates one new mix entry, and appends a sighting to both parent cards without marking either as discovered.

**The bug:** S13 originally hardcoded its three candidates (Beagle / English Foxhound / Harrier). But S13 is reached from three different places — the Bernese result's "See other guesses", the mix screen's "Actually it's a purebred", and a genuinely low-confidence scan. A Bernese result offering hound guesses is incoherent.

**The fix, which the build must preserve:** S13 takes its candidates as a parameter, and each caller passes the set matching the confidence that produced it.

| Caller | Candidate set | Percentages |
|---|---|---|
| Low-confidence scan (default) | Beagle / English Foxhound / Harrier | 38 / 29 / 18 |
| S06 "See other guesses" | Bernese Mountain Dog / Greater Swiss Mountain Dog / Appenzeller Sennenhund | 84 / 9 / 4 — matches S06's ring exactly |
| S11 "Actually it's a purebred" | Labrador Retriever / Siberian Husky / Alaskan Malamute | 44 / 31 / 12 — the two parents plus the next plausible purebred |

Each candidate row carries a **distinguishing hint**, not a description — "Otter tail, no mask", "Blue or parti eyes, facial mask", "Shorter legs, white tail tip". The user is looking at a live dog; the hint has to be something checkable in three seconds. Rows are 78px-thumbnail buttons, `--radius-xl`, `--shadow-card`, with the top candidate outlined in pine. Percentages in mono, right-aligned.

Escape hatches at the bottom: **None of these** → S03b (camera with framing tips showing) and **Re-frame photo** → S04.

### Album (cream canvas)

| ID | Name | Purpose |
|---|---|---|
| S21 | Album home | The collection. Group shelves, search entry, bottom nav. |
| S22 | Group shelf | One breed group; collected and locked cells together. |
| S08 | Breed card | Single breed detail — sightings, places, facts. |
| S23 | Locked breed | Not yet met. Dashed hairline, sunken fill, **breed-shaped** silhouette — never a generic "?". |
| S25 | Search — results | Across all 130 breeds, collected or not. Uncollected hits show `??` and a lock. |
| S25b | Search — no match | `No breed called "shiba" here` + the honest reason: the model knows 130 breeds. |
| S26 | Map teaser | Where breeds were met. |
| S40 | Play teaser | Mini-game entry. |
| S29 | Profile | Anonymous or signed-in variants. |

Collection cells are **3:4 portrait**, `--radius-xl` (24px), `--shadow-card`, rarity chip pinned top-left, breed name in `body-md-medium` beneath. Cards are noticeably rounder than buttons so they read as objects you could pick up.

### Account

| ID | Name | Purpose |
|---|---|---|
| S30 | Keep it safe | The account nudge — a sheet, shown once, after the 5th discovery. Never at launch. |
| S31 | Create account | Sign-up. |
| S32 | Sign in | With an error variant. |
| S33 | Reset link sent | Terminal confirmation. |
| S37 | Two collections | The merge decision. |
| S39 | Choose one instead | The merge fallback. |

#### S37 / S39 — account merge data integrity

Audited; the arithmetic is correct and load-bearing. Signing in on a phone that already holds an anonymous collection produces two sets: **41 breeds on this phone**, **12 in the account**, with **6 overlapping**. Merging therefore yields **41 + 12 − 6 = 47**, and the copy says so explicitly — *"Six breeds appear in both; their photos are merged into one card."* If the build changes any of those numbers, all three must move together.

The framing rule for the whole screen: *"Nothing is deleted unless you choose it."*

**S39 (new)** exists because merging is the risky write — once two collections blend, there is no clean rollback. So the fallback is deliberately *not* "discard the other one":

- Two selectable account cards, each showing breed count (mono, 44px column), origin (`Collected here since March` / `Last synced 2 weeks ago`), and photo count. Selection is a 24px filled pine circle with a white check; unselected is a 1.5px hairline ring. Selected card gets a 1.5px pine border and `--shadow-card`.
- A sky-tinted consequence card updates live with the *other* collection: **"In your account gets set aside — 12 breeds and 19 photos stay in Settings until 27 August. After that they're gone for good."** The date is **30 days out**, and the discard is **recoverable** for that window. This is the whole reason the screen can exist without a scary confirmation.
- Primary button label reflects the choice: `Keep on this phone` / `Keep in your account`.
- Ghost link back to merging — the two options stay mutually reachable.

### System

| ID | Name | Purpose |
|---|---|---|
| S20 | Location | Permission, asked on the **first successful result** — never at launch. Blurred result behind. |
| S38 | Notifications | Permission, asked once after the **third discovery**. |
| S34 | Settings | Account, app, data sections. |
| S36 | Data & privacy | Export, delete photos, delete account. |
| S36b | Delete — confirm | Typed confirmation. |

Both permission sheets follow the same shape: 44px tinted icon tile, `display-md` headline, one explanatory line, a primary accept, and a low-friction decline (`Not this time` / `No thanks`). They are asked **in context, after value has been demonstrated** — this sequencing is a design decision, not an implementation detail.

**S36b delete gating:** the destructive button is inert until the user types `DELETE` (case-insensitive, trimmed). Disarmed it renders on `--surface-sunken` with `--muted-soft` text and `cursor: not-allowed`; armed it flips to `--error` with white text. The field resets whenever the dialog closes. Copy states the real scope — `41 breeds and 68 photos will be removed from every device. This cannot be undone.`

## Interactions & Behavior

### Navigation

Six scan outcomes are reachable from S05 depending on model result and connectivity. In the prototype these are forced from the harness; in the build they follow from the API response:

```
S03 → S04 → S05 → { S06→S07 | S09 | S11 | S13 | S15 | S18 }
S05 → S17 when offline (scan queued, counter increments)
```

**The post-discovery prompt queue** is the most easily-broken behaviour in the app. A discovery is filed first, then the permissions it has earned queue up *behind* it, in order, and finally the new breed card is shown:

1. Location — if not granted and never asked
2. Notifications — if the user is at 3+ discoveries and never asked
3. Account nudge — if at 5+ discoveries and signed out and not yet shown
4. The breed card

Each prompt's accept *and* decline both advance the queue, and every "asked" flag is sticky so no prompt reappears. Implement as an actual queue; a chain of conditionals will drift.

### Micro-interactions

- **Press state, uniform app-wide:** every tappable element scales to **0.96 over 100ms**, releasing on a spring. There is no hover system — this is a touch-first product.
- **S01 card deal:** wordmark springs in, then cards fan in left → right → hero, then buttons rise. Spacing to the cards is deliberately tight.
- **S07 celebration:** flip-and-glow, **under 1 second total**, over a `rgba(15,33,27,0.55)` scrim. This is the app's signature moment and its one permitted flourish.
- **S05 analyzing:** paw-print loading motif, mechanical timing, always cancellable.
- **Reduced motion:** substitute fades for every spring and scale. **Never skip a state change** — only de-flourish it. Legendary cards keep their resting glow.

### Terminal-state rule

No screen is a dead end. Every failure and permission-denial ends on at least one forward action — S02 offers browsing, S15 offers both a retake and a re-frame, S17 offers "Keep scanning" and "Try again now", S18 offers retry and "Save it for later".

### Copy rules

These are enforced across all 31 screens and should be treated as acceptance criteria:

- Button labels describe exactly what happens: "Add to collection", never "Confirm".
- Errors state what happened plus what to do, **with no apology**: "We couldn't spot a dog in that one", never "Oops! Something went wrong."
- Empty states are invitations: "Go find a dog to scan", not "No breeds collected".
- Celebration copy is one warm line — "New Breed!" — never a paragraph.
- **No emoji anywhere.** No exclamation marks outside the single reward beat.

## State Management

| State | Type | Notes |
|---|---|---|
| `loggedIn` | bool | Gates profile variant and the merge path |
| `offline` | bool | Diverts S05 to S17 and increments `queued` |
| `cameraBlocked` | bool | Diverts every scan entry point to S02 |
| `location` / `locationAsked` | bool | Grant state and sticky asked-flag, tracked separately |
| `notifications` / `notifAsked` | bool | Same pattern |
| `accountNudgeShown` | bool | Sticky; the nudge is once-only |
| `breeds` | int | Collection size. 41 baseline → 47 after merge, or 41/12 after S39 |
| `discoveries` | int | Session discoveries; drives the prompt queue thresholds |
| `dupCount` / `dupUndone` | int / bool | Sighting count on the repeat card, and whether Undo is active. `dupUndone` is transient — never persisted |
| `queued` | int | Offline scans awaiting upload |

The two flag pairs matter: **grant state and asked state are separate booleans**. Collapsing them into one re-prompts users who declined, which the design explicitly forbids.

Data-fetching the build will need: breed inference (returns ranked candidates with probabilities — S13 and S11 both need the *full* ranked list, not just the winner), collection sync, photo upload with offline queue, and reverse geocoding for the map.

## Design Tokens

Tokens are real and complete — pull them from the design system rather than transcribing where possible.

**Colour**

```
Pine     --primary #2C5F4F  --primary-pressed #1E453A  --primary-soft #DCEBE3  --on-primary #FFFFFF
Sky      --secondary #3E7CA6  --secondary-soft #DCEAF3  --on-secondary #FFFFFF
Marigold --accent #F2A93B  --accent-deep #D6871B  --accent-soft #FDECC8  --on-accent #22302A
Album    --canvas #FBF7EF  --surface #FFFFFF  --surface-sunken #F1EBDF
         --hairline #E4DDCC  --hairline-soft #EEE8DA
Field    --canvas-field #0F211B  --surface-field #17332A  --surface-field-elevated #1E4335
         --on-field #FFFFFF  --on-field-muted #A9C4B7
Text     --ink #22302A  --body #3C4A43  --muted #71807A  --muted-soft #9CA9A2
Status   --success #3F9155  --warning #C97A2B  --error #C23B34
Rarity   --rarity-common #9CA9A2  --rarity-rare #3E7CA6
         --rarity-legendary #E0A930  --rarity-legendary-glow #FBE3A0
```

The canvas is warm paper, **not pure white** — it reduces glare and feels tactile. Rarity and status are deliberately **separate token sets** so a legendary card never reads as a success toast; do not alias them.

**Type** — three families, one job each. Mixing them outside these jobs is a system violation.

| Family | Job |
|---|---|
| **Fraunces** (`--font-display`) | Breed names and celebration headlines only |
| **Inter** (`--font-ui`) | All UI chrome and body text |
| **IBM Plex Mono** (`--font-mono`) | Any number the user tracks over time — counters, confidence %, streaks |

```
display-xl       34px / 600 / 1.15 / -0.3px   Fraunces
display-lg       28px / 600 / 1.2  / -0.2px   Fraunces
display-md       22px / 600 / 1.25            Fraunces
heading-sm       17px / 600 / 1.3             Inter
body-md          15px / 400 / 1.5             Inter
body-md-medium   15px / 500 / 1.5             Inter
body-sm          13px / 400 / 1.45            Inter
caption          12px / 500 / 1.4  / 0.2px    Inter
label-uppercase  11px / 600 / 1.3  / 1px      Inter, uppercase
button           15px / 600 / 1                Inter
data-lg          24px / 500 / 1.1             IBM Plex Mono
data-sm          13px / 500 / 1.2  / 0.2px    IBM Plex Mono
```

**Spacing** — 4px base unit: `xxs` 4, `xs` 8, `sm` 12, `md` 16, `lg` 24, `xl` 32, `section` 64. **16px is the standard screen margin.**

**Radius** — buttons and inputs **16px**; cards and modals **24px** (`--radius-xl`); chips, tabs, and the camera shutter are **true pills**. Pill-everything was deliberately rejected as a default: this product wants "premium collectible", not "cute mascot app".

**Shadows** — warm-tinted, never pure grey. `--shadow-card` for resting collection cards, `--shadow-elevated` for modals and breed detail, `--shadow-field-glow` and `--shadow-legendary-glow` as soft radial blooms. The Field screens use almost no drop shadow at all. Legendary cards carry a permanent soft gold glow even at rest.

**Borders** — 1px warm hairline on inputs, the bottom-nav top edge, and locked-card dashed outlines. No borders on buttons except `secondary` (1.5px pine) and text inputs.

**Backgrounds** — flat colour fields. **No gradients** except the two named glows, and no repeating patterns or textures. Breed photography is the only imagery. Transparency and blur appear only in the celebration scrim and the rarity-glow alphas — there are no frosted-glass panels anywhere.

## Assets

**Breed photography — not yet supplied.** Every grey box in the prototype is a placeholder. Layout, aspect ratios (3:4 collection cells, 196px circular result rings, 78px candidate thumbnails, 64px sighting tiles), and crop shapes are final. Direction: warm and true-to-life. Never black-and-white, never heavily grain-filtered — the source spec's rule is "not a vet app".

**Icons — Lucide** (`unpkg.com/lucide-static`), a **flagged substitution**. The source spec described a single-weight line style, a lock icon, a paw-print loading motif, and a dog silhouette, but supplied no assets. Swap in the real set when one exists. No emoji, and no unicode glyphs used as icons.

**Logo — none exists.** The wordmark is set in plain Fraunces wherever a mark would go. Do not invent one.

## Screens deferred to build

Wired in the prototype but intentionally not designed, because each is either platform-standard or already solved elsewhere in the system:

- **Learn more / breed detail** — S08 already covers this surface; point the link there.
- **Export my collection** — a single file with every breed, date, and place. Platform share-sheet.
- **Open mail app** — OS handoff from S33.
- **Name this one** — free-text nickname on a sighting.
- **Notification settings detail** — the granular milestone/recap toggles behind S34's Notifications row.

## Files

Everything needed to run the prototype offline is in this bundle. Open `Prototype.html`.

| File | Contents |
|---|---|
| `Prototype.html` | Entry point — loads React, Babel, the design system, and all screen modules |
| `app/prototype.jsx` | Route table, session state, prompt queue, review harness |
| `app/kit.jsx` | Shared primitives — `Phone`, `Body`, `Card`, `Photo`, `AppBar`, `NavBar`, `GhostLink`, `Sheet`, `ConfidenceRing`, type scale |
| `app/screens-field.jsx` | S01, S03, S04, S05 |
| `app/screens-result.jsx` | S06, S07, S09, S11, S13, S15, `Toast` |
| `app/screens-album.jsx` | S21, S22, S08, S23, S26, S40, S29 |
| `app/screens-account.jsx` | S30–S33, S37, S39 |
| `app/screens-system.jsx` | S02, S20, S38, S25, S34, S36, S17, S18 |
| `_ds/…/tokens/*.css` | The design tokens above, as CSS custom properties |
| `_ds/…/styles.css` | Root stylesheet |
| `_ds/…/_ds_bundle.js` | Design system components — `Button`, `TextInput`, `RarityChip`, `ProgressBar`, `ConfidenceMeter`, `CelebrationModal`, `BottomNav`, `CollectionCard`, `BreedDetailCard`, `CameraShutter` |

Other design artifacts in the project, for context on how the flow was arrived at: `User Flows.html`, `Wireframes.html`, `Hi-Fi Screens.html`, `Hi-Fi Screens 2.html`.
