---
version: alpha
name: Dogfolio (not fixed name)
description: "A field-guide-meets-game design system for a dog breed scanning & collection app. Two modes anchor the entire product — a deep-pine 'Field' mode for the camera/scan experience (focused, low-glare, premium) and a warm-paper 'Album' mode for the collection, home, and breed-detail experience (bright, tactile, proud). Marigold is reserved exclusively for discovery and reward moments, so it stays meaningful instead of decorative. Trading-card-shaped breed entries, a monospace tally counter, and a spring-eased 'unlock' animation are the signature elements that make scanning a real dog feel like pulling a card you've been chasing."
sourceUrl: "internal — generated for a dog breed scan & collect app"

colors:
  primary: "#2C5F4F"
  primary-pressed: "#1E453A"
  primary-soft: "#DCEBE3"
  on-primary: "#FFFFFF"
  secondary: "#3E7CA6"
  secondary-soft: "#DCEAF3"
  on-secondary: "#FFFFFF"
  accent: "#F2A93B"
  accent-deep: "#D6871B"
  accent-soft: "#FDECC8"
  on-accent: "#22302A"
  canvas: "#FBF7EF"
  surface: "#FFFFFF"
  surface-sunken: "#F1EBDF"
  hairline: "#E4DDCC"
  hairline-soft: "#EEE8DA"
  canvas-field: "#0F211B"
  surface-field: "#17332A"
  surface-field-elevated: "#1E4335"
  on-field: "#FFFFFF"
  on-field-muted: "#A9C4B7"
  ink: "#22302A"
  body: "#3C4A43"
  muted: "#71807A"
  muted-soft: "#9CA9A2"
  success: "#3F9155"
  warning: "#C97A2B"
  error: "#C23B34"
  rarity-common: "#9CA9A2"
  rarity-rare: "#3E7CA6"
  rarity-legendary: "#E0A930"
  rarity-legendary-glow: "#FBE3A0"

typography:
  display-xl:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.3px
  display-lg:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.2px
  display-md:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: 0
  heading-sm:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.3
  body-md:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
  body-md-medium:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.5
  body-sm:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
  caption:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.2px
  label-uppercase:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 1px
  button:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1
  data-lg:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.1
  data-sm:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.2px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px

radius:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  pill: 9999px
  full: 50%

shadows:
  card: "rgba(44, 32, 14, 0.08) 0px 4px 12px 0px"
  elevated: "rgba(34, 48, 42, 0.18) 0px 12px 32px -8px"
  field-glow: "rgba(242, 169, 59, 0.35) 0px 0px 24px 0px"
  legendary-glow: "rgba(224, 169, 48, 0.45) 0px 0px 24px 0px"

motion:
  duration-instant: 100ms
  duration-fast: 180ms
  duration-base: 280ms
  duration-slow: 450ms
  duration-celebration: 800ms
  easing-standard: "cubic-bezier(0.4, 0, 0.2, 1)"
  easing-decelerate: "cubic-bezier(0, 0, 0.2, 1)"
  easing-spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"

breakpoints: [360px, 393px, 430px, 768px]

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{radius.md}"
    padding: "14px 24px"
    height: 52px
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button}"
    rounded: "{radius.md}"
    padding: "14px 24px"
    height: 52px
    shadow: "{shadows.field-glow}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{radius.md}"
    padding: "13px 24px"
    border: "1.5px solid {colors.primary}"
    height: 52px
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.body}"
    typography: "{typography.button}"
    padding: "10px 16px"
  camera-shutter:
    backgroundColor: "{colors.on-field}"
    rounded: "{radius.pill}"
    diameter: 76px
    border: "4px solid rgba(255,255,255,0.4)"
  chip-rarity-common:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.muted}"
    typography: "{typography.label-uppercase}"
    rounded: "{radius.pill}"
    padding: "4px 10px"
  chip-rarity-rare:
    backgroundColor: "{colors.secondary-soft}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-uppercase}"
    rounded: "{radius.pill}"
    padding: "4px 10px"
  chip-rarity-legendary:
    backgroundColor: "{colors.rarity-legendary}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-uppercase}"
    rounded: "{radius.pill}"
    padding: "4px 10px"
    shadow: "{shadows.legendary-glow}"
  card-collection-unlocked:
    backgroundColor: "{colors.surface}"
    rounded: "{radius.xl}"
    padding: "{spacing.sm}"
    aspectRatio: "3:4"
    shadow: "{shadows.card}"
  card-collection-locked:
    backgroundColor: "{colors.surface-sunken}"
    rounded: "{radius.xl}"
    padding: "{spacing.sm}"
    aspectRatio: "3:4"
    border: "1px dashed {colors.hairline}"
  card-breed-detail:
    backgroundColor: "{colors.surface}"
    rounded: "{radius.xl}"
    padding: "{spacing.lg}"
    shadow: "{shadows.elevated}"
  progress-bar-track:
    backgroundColor: "{colors.surface-sunken}"
    rounded: "{radius.pill}"
    height: 10px
  progress-bar-fill:
    backgroundColor: "{colors.primary}"
    rounded: "{radius.pill}"
  confidence-meter:
    backgroundColor: "{colors.surface-field-elevated}"
    textColor: "{colors.on-field}"
    typography: "{typography.data-sm}"
    rounded: "{radius.pill}"
    padding: "6px 12px"
  bottom-nav:
    backgroundColor: "{colors.surface}"
    height: 64px
    border-top: "1px solid {colors.hairline}"
  modal-celebration:
    backgroundColor: "{colors.surface}"
    rounded: "{radius.xl}"
    padding: "{spacing.xl}"
    shadow: "{shadows.elevated}"
  text-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{radius.md}"
    padding: "14px 16px"
    height: 52px
    border: "1px solid {colors.hairline}"
---

## Rationale

This system is built around one structural idea: the product has two rooms, and each should feel like a different place. The **Field** is where discovery happens — the camera is open, a real dog is in front of the user, and the interface needs to get out of the way: near-black pine background, minimal chrome, one glowing action. The **Album** is where pride happens — the collection, breed details, progress, and rewards live on a warm paper canvas that invites lingering, browsing, and showing off. Every other decision in this document — color, type, motion, shadow — exists to serve that split, because the emotional arc of the app (curiosity in the field, pride in the album) is the actual product, not a theme.

Marigold (`{colors.accent}`) is spent on exactly one job across the whole app: signaling a reward or a new discovery. It never appears as a default button color, a nav highlight, or decoration. That restraint is what makes the "New Breed!" moment land — the color has never shown up for anything smaller, so the user's eye already knows what it means before they read a word. Deep pine green carries everything else that needs to feel trustworthy, calm, and outdoorsy without being clinical (a vet-app blue-and-white palette was deliberately avoided — this is not a medical product).

Breed entries are shaped and treated like trading cards on purpose. A collection app succeeds or fails on whether the "object" being collected feels covetable, so the collection grid, the locked silhouettes, and the breed-detail screen all share one card geometry (3:4 portrait, 24px radius, a rarity-colored edge) so that flipping through a Field Guide feels the same in the hand as flipping through a card binder.

## 1. Design Philosophy

Every screen should answer one of five feelings: **I found something new. I'm building something. I'm making progress. I earned this. I want to go find another one.** Before shipping any screen, check it against that list — if a screen does none of the five (e.g., a settings page), keep it quiet and get out of the way; don't force gamification onto utility screens. Gamification concentrated where it matters (the scan result, the unlock, the collection) reads as rewarding. Gamification smeared across every screen reads as childish, which is explicitly the thing this product wants to avoid.

Three things this app is **not**, and what that rules out:
- **Not a vet app.** No clinical blue/white, no cross/plus iconography, no sterile grid layouts.
- **Not a social network.** No avatars-and-like-counts as primary UI, no infinite feed as a home screen, no follower-count framing on collections. Social features (if built later) sit behind the collection, never in front of it.
- **Not an encyclopedia.** No dense reference-book typesetting, no walls of text on the breed card. Facts are served in small, celebratory doses (1–2 facts, delivered like a prize, not a Wikipedia stub).

## 2. Visual Theme & Atmosphere

The Album mode reads as a warm, sun-bleached field journal — cream paper, soft card shadows, a serif for breed names that feels hand-labeled rather than corporate. The Field mode reads as a premium night-vision instrument — deep pine-black, a single glowing shutter button, a thin bounding box that snaps onto the dog like a rangefinder. The contrast between the two modes is the atmosphere: calm pride at rest, focused anticipation in motion.

This is deliberately not the "warm cream + terracotta" look common to AI-generated pastel apps. Pine green as the dominant brand color (rather than terracotta or blush) keeps the palette feeling outdoorsy and premium rather than generically sweet, and it gives marigold room to mean something when it finally shows up.

## 3. Color System

**Primary — Pine `{colors.primary}` #2C5F4F.** A deep, slightly desaturated forest green. Green reads as natural, calm, and trustworthy — appropriate for an app about real animals and real outdoor encounters — without borrowing the sterile blue of medical or delivery apps. Used for primary navigation, the default button, and the progress bar fill (a growing collection is, quite literally, growth).

**Accent — Marigold `{colors.accent}` #F2A93B.** Warm amber-gold, used **only** for reward and discovery moments: the "New Breed!" banner, the unlock animation glow, the primary CTA on the scan-result screen once a breed is confirmed. Gold reads universally as achievement (medals, trophies, star ratings) and triggers a small dopamine hit precisely because the app never wastes it elsewhere.

**Secondary — Sky `{colors.secondary}` #3E7CA6.** A muted, confident blue used for informational moments — fun facts, the map, the "rare" rarity tier. Blue is calm and curious rather than urgent, which fits its job of carrying knowledge rather than reward.

**Canvas (Album) `{colors.canvas}` #FBF7EF.** Warm paper cream rather than pure white — feels tactile and journal-like, reduces glare during long browsing sessions in the collection screen.

**Canvas (Field) `{colors.canvas-field}` #0F211B.** Near-black pine used only on the camera/scan screen. Dark UI here is functional, not stylistic: it minimizes screen glare when a user is holding the phone up outdoors or in low light to scan a dog, and it makes the marigold confidence meter and bounding box read instantly against the dark.

**Ink `{colors.ink}` #22302A / Body `{colors.body}` #3C4A43 / Muted `{colors.muted}` #71807A.** A warm, slightly green-tinted near-black rather than flat gray, so text feels part of the same material world as the brand green rather than a generic system default.

**Rarity colors** (`{colors.rarity-common}` sage gray, `{colors.rarity-rare}` sky blue, `{colors.rarity-legendary}` gold with a soft glow) are a **separate token set from semantic status colors** (`{colors.success}`, `{colors.warning}`, `{colors.error}`) even though rare and legendary borrow hues close to secondary and accent. Keeping them separate prevents "this breed is rare" from ever being confused with "this action succeeded" — a legendary breed card should never accidentally look like a green success toast.

**Semantic — Success `{colors.success}` #3F9155, Warning `{colors.warning}` #C97A2B, Error `{colors.error}` #C23B34.** Kept visually distinct from both primary pine and accent marigold so system feedback (saved, blocked scan, network error) never gets mistaken for a reward or a rarity signal.

## 4. Typography

Three families, each with one clear job — mixing them is a system violation:

- **Fraunces** (display) — a soft, slightly wonky serif with real character. Used exclusively for breed names, the "New Breed!" headline, and section heroes. This is the single typographic signature of the brand: a breed name set in Fraunces should feel like it's been hand-labeled in a field journal, not auto-generated in a corporate sans. Do not use Fraunces for buttons, body copy, or UI chrome — its personality is reserved for the moment of discovery.
- **Inter** (UI) — every button, nav label, body paragraph, fact, and form field. Chosen for maximum legibility at small mobile sizes and total neutrality, so it never competes with Fraunces for attention.
- **IBM Plex Mono** (data) — reserved for anything that is literally a number the user is tracking: the collection ratio ("42 / 120"), the AI confidence percentage, point totals, streak counts. Monospace digits give these numbers a "field-log tally" or camera-readout feel that reinforces the app's scanning-instrument identity, and tabular figures mean counters don't jitter in width as they animate up.

| Token | Size | Weight | Use |
|---|---|---|---|
| `{typography.display-xl}` | 34px | 600 | "New Breed!" celebration headline |
| `{typography.display-lg}` | 28px | 600 | Breed name on result / detail screen |
| `{typography.display-md}` | 22px | 600 | Screen titles ("Your Collection") |
| `{typography.heading-sm}` | 17px | 600 | Card titles, list section headers |
| `{typography.body-md}` | 15px | 400 | Default paragraph, fun facts |
| `{typography.body-md-medium}` | 15px | 500 | Emphasized body, list item titles |
| `{typography.body-sm}` | 13px | 400 | Secondary text, timestamps |
| `{typography.caption}` | 12px | 500 | Metadata, location tags |
| `{typography.label-uppercase}` | 11px | 600 | Rarity tags, eyebrows ("COMMON") |
| `{typography.button}` | 15px | 600 | All button labels |
| `{typography.data-lg}` | 24px | 500 | Big collection ratio counter |
| `{typography.data-sm}` | 13px | 500 | Confidence %, point chips |

## 5. Shapes

Rounded, but not pill-everything — full pill buttons were deliberately avoided as the default (both reference pet apps lean heavily on pill CTAs, which reads as cute-and-casual; this product wants "premium collectible" more than "cute mascot app"). Rounded rectangles at `{radius.md}` (16px) are the default button shape, reserving true pills (`{radius.pill}`) for rarity chips, tab selectors, and the camera shutter — places where a circular/pill shape is functionally meaningful (a shutter button should look pressable and round; a status chip should look like a tag).

- **Buttons:** `{radius.md}` (16px), rectangular with soft corners.
- **Cards (collection, breed detail, modals):** `{radius.xl}` (24px) — noticeably rounder than buttons, so cards read as objects you could pick up, echoing a physical trading card's rounded corners.
- **Chips / rarity tags / camera shutter:** `{radius.pill}`.
- **Inputs:** `{radius.md}` (16px), matching buttons so a form reads as one cohesive control group.
- **Dialogs / celebration modal:** `{radius.xl}` (24px), same as cards.

## 6. Motion & Interaction

Motion is where the Field/Album split becomes felt rather than seen. In the Field, motion is quick and mechanical (a rangefinder snapping focus). In the Album, motion is springier and rewarding (a card settling into place with a little bounce). Reduced-motion users get the same state changes with fades substituted for spring/scale — never skipped.

- **Page transitions:** `{motion.duration-base}` (280ms), `{motion.easing-decelerate}`. Standard screen-to-screen navigation slides in from the right; tab switches within the bottom nav simply cross-fade — no slide, since they're lateral, not hierarchical.
- **Button interactions:** On press, scale to 0.96 over `{motion.duration-instant}` (100ms), release with `{motion.easing-spring}`. Every tappable element gets this same press-scale so the whole app feels uniformly responsive.
- **Camera transitions:** Opening the camera is a quick iris-style scale-and-fade from the tab bar icon into full-screen, `{motion.duration-fast}` (180ms) — fast enough that the user never waits between "I saw a dog" and "camera is ready."
- **Scan / detection animation:** While the model is evaluating a frame, a thin marigold bounding box breathes (opacity 60%→100%, `{motion.duration-slow}`, looping, `{motion.easing-standard}`). The instant a dog is detected, the box snaps taut around it with `{motion.easing-spring}` over `{motion.duration-fast}` — the snap itself is the "got it" feedback, no separate confirmation needed.
- **Reward animation ("New Breed!"):** The signature moment. Breed silhouette card flips 180° on its vertical axis (`{motion.duration-celebration}`, `{motion.easing-spring}`) to reveal the full-color card, marigold glow (`{shadows.legendary-glow}` or `{shadows.field-glow}`) blooms outward and fades over 600ms, and the display-xl headline scales in from 0.8→1 with a slight overshoot. Keep this under one second total — celebratory, not a cutscene the user has to sit through every single scan.
- **Progress animations:** The collection ratio counter (`{typography.data-lg}`) counts up digit-by-digit over `{motion.duration-base}` rather than jumping instantly — small satisfaction on every increment. The progress bar fill animates width with `{motion.easing-decelerate}` over `{motion.duration-slow}`.
- **Collection unlock animation:** A locked silhouette card crossfades to its full-color counterpart while a soft horizontal light-sweep passes left-to-right over `{motion.duration-slow}` — same visual language as the reward animation but quieter, since this plays when browsing the grid after the initial discovery, not during the first "wow" moment.
- **Loading states:** No generic spinners. Use a pulsing paw-print or bounding-box outline that matches whatever screen it's on (marigold pulse in the Field, pine pulse in the Album) so loading still feels branded rather than like a system default.
- **Micro-interactions:** Rarity chips get a tiny 1.05x scale pop on first appearance; the bottom nav icon for the active tab lifts 2px with a pine underline dot; pull-to-refresh on the collection grid uses a small bouncing paw rather than a stock spinner.

## 7. Layout & Spacing

- **Base unit:** 4px, scaling through `{spacing.xxs}` (4px) → `{spacing.section}` (64px).
- **Screen padding:** `{spacing.md}` (16px) horizontal margin on all standard screens.
- **Card internal padding:** `{spacing.sm}` (12px) for compact collection-grid cards; `{spacing.lg}` (24px) for breed-detail and celebration modals.
- **Section spacing:** `{spacing.xl}` (32px) between major content blocks on a screen (e.g., between the confidence meter and the fun-fact card on a scan result).
- **Collection grid:** 3 columns on standard phone widths (360–430px), 2:3 or 3:4 card aspect ratio, `{spacing.sm}` gutter. 4 columns at tablet widths (≥768px).

## 8. Elevation & Depth

The Album uses soft, warm-tinted shadows (never pure gray, to avoid clashing with the cream canvas) — `{shadows.card}` for resting collection cards, `{shadows.elevated}` for modals and the breed-detail sheet. The Field mode uses almost no shadow at all (everything sits flat on the dark canvas); depth there comes from the marigold glow (`{shadows.field-glow}`) around the shutter button and bounding box instead of drop shadows, keeping the camera view uncluttered. Legendary-rarity cards get a permanent soft gold glow (`{shadows.legendary-glow}`) even at rest, so a legendary breed is recognizable in the collection grid before the user even reads the rarity chip.

## 9. Components

**`button-primary`** — Pine background, white text, `{radius.md}`, 52px height. Default action everywhere except reward moments (e.g., "Scan another dog," "View collection").

**`button-accent`** — Marigold background, ink text, `{shadows.field-glow}`. Reserved for reward-adjacent CTAs only: "Add to collection" on a fresh discovery, "Claim reward." Never used as a generic primary button — if every screen used it, the glow would stop meaning anything.

**`button-secondary`** — Transparent with a pine outline. Used for secondary actions ("Learn more," "Skip").

**`button-ghost`** — No background or border, body-colored text. Used for tertiary/dismissive actions ("Not now," "Cancel").

**Bottom Navigation (`bottom-nav`)** — White surface, 64px tall, hairline top border, 3–4 icon tabs (Scan, Collection, Map, Profile). Scan sits center as a slightly raised marigold-accented button (it's the core action of the app and deserves visual priority over the other tabs) while the rest use simple line icons in muted/ink states.

**Progress Bar (`progress-bar-track` / `progress-bar-fill`)** — 10px pill track in `{colors.surface-sunken}`, pine fill. Appears under the collection header ("42/120 breeds") and inside the breed-detail screen for duplicate-count or milestone progress.

**Collection Grid (`card-collection-unlocked`)** — 3:4 portrait cards, `{radius.xl}`, breed photo/illustration filling the card, a small rarity chip pinned to the top-left corner, breed name in `{typography.body-md-medium}` beneath.

**Locked Breed Cards (`card-collection-locked`)** — Same geometry as unlocked cards but filled with `{colors.surface-sunken}` and a dashed hairline border, showing a gray silhouette instead of the real photo and a small lock icon instead of the rarity chip. The silhouette shape is still breed-specific (not a generic "?" mark) so the collection map itself creates curiosity — users can see the shape of what they're missing.

**Breed Detail Card (`card-breed-detail`)** — Full-width sheet: breed name in `{typography.display-lg}` (Fraunces), rarity chip, 1–2 fun facts in `{typography.body-md}` delivered as short highlighted callouts rather than paragraphs, a small "first scanned" location/date stamp in `{typography.caption}`, and a duplicate-count row in `{typography.data-sm}` (Plex Mono) if scanned more than once.

**Camera Interface** — Full-bleed `{colors.canvas-field}` background, live camera feed, thin marigold bounding-box overlay, `{component.confidence-meter}` pill floating near the top once a dog is detected, `{component.camera-shutter}` centered at the bottom, and a small ghost-button "How it works" in the top corner for first-time users. No other chrome — the Field screen is the one place in the app where restraint is absolute.

**Confidence Indicator (`confidence-meter`)** — A pill badge on the dark canvas showing a percentage in `{typography.data-sm}`; fills with a thin radial ring in marigold as confidence rises during a scan. Below ~60% confidence, this same component switches to a 3-option picker (three thumbnail candidates the user taps to confirm) rather than guessing silently.

**Rarity Indicators (`chip-rarity-common` / `-rare` / `-legendary`)** — Small uppercase pill chips (`{typography.label-uppercase}`) in sage/blue/gold respectively; legendary carries the permanent soft glow described above so rarity is legible even to a glancing eye, not just a careful reader.

**Modals (`modal-celebration`)** — Used for "New Breed!" and milestone celebrations. White surface, `{radius.xl}`, centered over a scrim, contains the flip-card animation described in Motion, a display-xl headline, one fun fact, and a single `{component.button-accent}` ("Add to collection").

**Empty States** — The empty collection grid is not a blank page; it's a full grid of locked silhouettes from the very first launch, so "emptiness" always reads as "a map of what's ahead" rather than "nothing here yet." Any other empty state (no scans today, no friends yet) uses a short, direct invitation ("Nothing scanned yet today — go find a dog") rather than an apology.

**Loading States** — Branded pulse animations as described in Motion; never a generic native spinner.

## 10. UX Principles

- **Discovery first.** The Scan tab is the default landing screen and the visually loudest bottom-nav item. Everything else (collection, map, profile) is one tap away, never in front of the scan action.
- **Make scanning effortless.** Auto-detect and auto-fire the moment a single dog is confidently framed — don't make the user tap a shutter for the common case. The manual shutter exists for retries, multi-dog framing, and user control, not as the primary expected flow.
- **Reward meaningful actions, not every action.** Points, animations, and marigold only appear for the two things that actually matter — a new breed and a milestone. Duplicate scans get a small, calm acknowledgment (not a full celebration) so real rewards keep their weight.
- **Celebrate progress, not just discovery.** The X/Y counter, weekly challenge progress, and streaks are visible on the collection home screen even between scans, so progress is felt continuously, not just at the moment of a scan.
- **Encourage exploration.** Locked silhouettes and the personal discovery map exist specifically to make "what am I missing" a visible, browsable question rather than a hidden stat.
- **Minimize friction, especially around uncertainty.** Low-confidence scans get a fast 3-option picker instead of an error; invalid scans (no dog, a toy, a photo of a screen) get one clear sentence explaining what to do differently, never a dead end.
- **Reduce cognitive load.** One fact, one action, one color-with-meaning per screen. The breed-detail screen resists the urge to become an encyclopedia entry — depth is available on tap ("Learn more"), not forced by default.

## 11. Voice & Copy

Interface copy is plain, active, and specific — the label on a button describes exactly what happens ("Add to collection," not "Confirm"). Errors explain what went wrong and what to do next in one sentence, without apologizing ("We couldn't spot a dog in that photo — try moving closer or into better light," not "Oops! Something went wrong"). Empty states are framed as invitations, not absence ("Go find a dog to scan," not "No breeds collected"). Celebration copy is warm but brief — one line, not a paragraph — so it reads as a genuine beat, not a wall of hype.

## 12. Accessibility

**Contrast.** `{colors.ink}` (#22302A) on `{colors.canvas}` (#FBF7EF) is roughly 12:1 — comfortably exceeds WCAG AAA. White text on `{colors.primary}` (#2C5F4F) is roughly 7:1, passing AAA for normal text. `{colors.on-accent}` (dark ink) on `{colors.accent}` (#F2A93B) is used deliberately instead of white text, since white-on-marigold would fail AA — dark text on the accent keeps the highest-visibility color also the most legible. `{colors.muted}` (#71807A) on `{colors.canvas}` is roughly 3.4:1 — acceptable only for non-essential metadata/timestamps, never for body copy or button labels.

**Touch targets.** All buttons, chips, and nav icons meet a 44×44px minimum tap area regardless of visual size — the 52px button height and 64px nav bar already clear this comfortably; small elements like the rarity chip get invisible padding to reach the minimum.

**Typography scaling.** Respect the OS-level text-size setting; `{typography.data-lg}` and `{typography.display-xl}` should be allowed to reflow rather than truncate when scaled up, since collection counters and breed names are core content, not decoration.

**Motion accessibility.** Every animation described in Section 6 has a reduced-motion fallback: the card flip becomes a simple cross-fade, the bounding-box snap becomes an instant appearance, the light-sweep unlock becomes a plain fade. State changes must still be communicated (e.g., a completed unlock is never silent) — only the flourish is removed.

**Dark mode.** The Field (camera) screen is already permanently dark by design, regardless of system theme, since it's a functional choice about screen glare outdoors. A true system dark mode for the Album screens (collection, profile) should invert the paper canvas to a warm dark surface (`{colors.surface-field}` family) while keeping pine and marigold as the same accent colors — the brand identity should survive the theme switch even if the "paper" feeling doesn't.

## 13. Do's and Don'ts

### Do
- Reserve `{colors.accent}` (marigold) exclusively for reward and discovery moments.
- Use Fraunces only for breed names and celebration headlines — never for buttons or body text.
- Keep the Field (scan) screen close to chrome-free: bounding box, confidence meter, shutter, nothing else.
- Give every locked breed a distinct, recognizable silhouette shape, not a generic placeholder.
- Use `{typography.data-sm}`/`{typography.data-lg}` (monospace) for every number the user is meant to track over time.

### Don't
- Don't use marigold as a default button, link, or nav-highlight color.
- Don't apply full pill radius to standard buttons — that's reserved for chips, tabs, and the shutter.
- Don't let a breed-detail screen grow past 1–2 facts; depth belongs behind an explicit "Learn more," not the default view.
- Don't reuse rarity colors as semantic status colors or vice versa.
- Don't add heavy shadows inside the Field (camera) screen — depth there comes from the marigold glow, not drop shadows.

## 14. Responsive Behavior

| Name | Width | Key Changes |
|---|---|---|
| Small phone | 360–392px | Collection grid stays 3-up with tighter gutters; bottom nav labels may hide, icons only |
| Standard phone | 393–429px | Baseline layout — 3-up grid, full nav labels |
| Large phone | 430–767px | Extra breathing room in card padding; grid stays 3-up |
| Tablet | ≥768px | Collection grid moves to 4-up; breed-detail sheet becomes a centered modal (max-width 480px) instead of full-bleed |

**Safe areas & orientation:** The camera screen respects device notch/home-indicator safe areas on all sides; shutter button sits above the home-indicator safe zone with `{spacing.lg}` clearance. The app is designed portrait-first — scanning in landscape is supported but not optimized (camera fills the frame, controls reposition to the right edge rather than the bottom).

## 15. Iteration Guide

1. Work one component at a time, referencing its token key directly (e.g., `{component.card-collection-unlocked}`).
2. Before adding any new use of `{colors.accent}`, ask: is this a reward or discovery moment? If not, use `{colors.primary}` instead.
3. New rarity tiers (if added later) get their own `chip-rarity-*` and `rarity-*` color token — never repurpose a semantic status color.
4. Keep the Field/Album distinction intact in any new screen: decide which "room" it belongs to before choosing colors or shadow style.
5. Reference `{typography.*}` and `{spacing.*}` tokens everywhere — never inline a hex value or pixel size.
6. Any new celebratory moment should reuse the existing flip/glow motion language rather than inventing a new animation style, to keep the "reward feeling" consistent across the app.

## 16. Known Gaps

- Exact copy for all error/empty states is not fully scripted — Section 11 sets the voice, not the full copy deck.
- Social features (friend invites, shared challenges, photo feed) are intentionally out of scope for this system — should they be built, they need their own review to ensure they stay behind the collection experience rather than in front of it, per Section 1.
- Map screen (personal + global discovery map) visual treatment is not detailed component-by-component here; it should inherit Album-mode surface/shadow tokens but needs its own pass for pin/cluster styling.
- Mini-game / virtual-dog-care mechanics (listed as a later feature) are out of scope for this version of the system and will need their own component set if built.
- Precise numeric WCAG contrast ratios above are estimated, not lab-measured — verify with a contrast-checking tool before final ship.
