/**
 * ToutouDex — Companion design tokens.
 *
 * Transcribed from the design system's token CSS (design/prototype/_ds/…/tokens/).
 * This is the ONE file that carries design values into the app — every screen
 * imports from here. Do not hardcode a hex, size, or radius anywhere else.
 *
 * Two rules worth knowing before you use these:
 *  - `accent` (marigold) signals reward/discovery ONLY. Never a default button,
 *    link, or nav highlight. Use `accentDeep` for small text — flat accent fails
 *    contrast below ~15px.
 *  - `rarity` and `status` are deliberately separate sets. Never alias them, or a
 *    legendary card starts reading as a success toast.
 */

export const color = {
  primary: '#2C5F4F',
  primaryPressed: '#1E453A',
  primarySoft: '#DCEBE3',
  onPrimary: '#FFFFFF',

  secondary: '#3E7CA6',
  secondarySoft: '#DCEAF3',
  onSecondary: '#FFFFFF',

  accent: '#F2A93B',
  accentDeep: '#D6871B',
  accentSoft: '#FDECC8',
  onAccent: '#22302A',

  /** Album room — warm paper, deliberately not pure white. */
  canvas: '#FBF7EF',
  surface: '#FFFFFF',
  surfaceSunken: '#F1EBDF',
  hairline: '#E4DDCC',
  hairlineSoft: '#EEE8DA',

  /** Field room — functional darkness for outdoor glare, not a dark theme. */
  canvasField: '#0F211B',
  surfaceField: '#17332A',
  surfaceFieldElevated: '#1E4335',
  onField: '#FFFFFF',
  onFieldMuted: '#A9C4B7',

  ink: '#22302A',
  body: '#3C4A43',
  muted: '#71807A',
  mutedSoft: '#9CA9A2',

  success: '#3F9155',
  warning: '#C97A2B',
  error: '#C23B34',

  rarityCommon: '#9CA9A2',
  rarityRare: '#3E7CA6',
  rarityLegendary: '#E0A930',
  rarityLegendaryGlow: '#FBE3A0',

  /** Celebration scrim only. No frosted-glass panels anywhere in this product. */
  scrim: 'rgba(15,33,27,0.55)',
} as const;

/**
 * Three families, one job each. Mixing them outside these jobs is a system violation.
 *  - display → breed names and celebration headlines only
 *  - ui      → all chrome and body text
 *  - mono    → any number the user tracks over time (counts, confidence %, streaks)
 *
 * Load via expo-font: Fraunces_600SemiBold, Inter_400Regular/500Medium/600SemiBold,
 * IBMPlexMono_500Medium.
 */
export const font = {
  display: 'Fraunces_600SemiBold',
  ui: 'Inter_400Regular',
  uiMedium: 'Inter_500Medium',
  uiSemibold: 'Inter_600SemiBold',
  mono: 'IBMPlexMono_500Medium',
} as const;

/**
 * React Native has no line-height multiplier — `lineHeight` is absolute px, so each
 * entry below is pre-multiplied from the CSS ratio and rounded.
 * Weight lives in the fontFamily on RN, so these carry the resolved family.
 */
export const type = {
  displayXl: { fontFamily: font.display, fontSize: 34, lineHeight: 39, letterSpacing: -0.3 },
  displayLg: { fontFamily: font.display, fontSize: 28, lineHeight: 34, letterSpacing: -0.2 },
  displayMd: { fontFamily: font.display, fontSize: 22, lineHeight: 28, letterSpacing: 0 },

  headingSm: { fontFamily: font.uiSemibold, fontSize: 17, lineHeight: 22 },
  bodyMd: { fontFamily: font.ui, fontSize: 15, lineHeight: 23 },
  bodyMdMedium: { fontFamily: font.uiMedium, fontSize: 15, lineHeight: 23 },
  bodySm: { fontFamily: font.ui, fontSize: 13, lineHeight: 19 },
  caption: { fontFamily: font.uiMedium, fontSize: 12, lineHeight: 17, letterSpacing: 0.2 },
  labelUppercase: {
    fontFamily: font.uiSemibold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  button: { fontFamily: font.uiSemibold, fontSize: 15, lineHeight: 15 },

  dataLg: { fontFamily: font.mono, fontSize: 24, lineHeight: 26 },
  dataSm: { fontFamily: font.mono, fontSize: 13, lineHeight: 16, letterSpacing: 0.2 },
} as const;

/** 4px base unit. `md` (16) is the standard screen margin. */
export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 64,
} as const;

/**
 * Buttons/inputs 16, cards/modals 24 — cards are noticeably rounder so they read as
 * objects you could pick up. Chips, tabs and the camera shutter are true pills.
 */
export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  pill: 9999,
  full: '50%',
} as const;

/**
 * Warm-tinted, never pure gray. RN shadow props (iOS) + elevation (Android).
 * `fieldGlow` and `legendaryGlow` are radial blooms — CSS box-shadow with no offset
 * has no RN equivalent, so render them with a radial-gradient view behind the element
 * (expo-linear-gradient won't do radial; use a soft PNG or react-native-svg).
 */
export const shadow = {
  /** Resting collection cards. */
  card: {
    shadowColor: 'rgba(44,32,14,1)',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  /** Modals, breed detail, the Undo toast. */
  elevated: {
    shadowColor: 'rgba(34,48,42,1)',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 32,
    elevation: 12,
  },
  /** Camera shutter bloom — the Field room's only source of depth. */
  fieldGlow: { color: 'rgba(242,169,59,0.35)', radius: 24 },
  /** Permanent, even at rest, on legendary cards. */
  legendaryGlow: { color: 'rgba(224,169,48,0.45)', radius: 24 },
} as const;

/**
 * Field motion is quick and mechanical (a rangefinder snapping focus).
 * Album motion springs (a card settling with a little bounce).
 * Reduced motion substitutes fades for every spring/scale — de-flourish, never skip
 * a state change.
 */
export const motion = {
  duration: {
    instant: 100,
    fast: 180,
    base: 280,
    slow: 450,
    celebration: 800,
  },
  /** Reanimated Easing.bezier(...) args. */
  easing: {
    standard: [0.4, 0, 0.2, 1],
    decelerate: [0, 0, 0.2, 1],
    spring: [0.34, 1.56, 0.64, 1],
  },
  /** Uniform press feedback app-wide: scale to 0.96 over 100ms, release on spring. */
  pressScale: 0.96,
} as const;

/** 1px warm hairline on inputs, nav top edge, locked-card dashes. 1.5px on secondary buttons. */
export const border = {
  hairline: 1,
  emphasis: 1.5,
} as const;

/** Minimum tap target. Never go below this. */
export const hitSlop = 44;

export const tokens = { color, font, type, space, radius, shadow, motion, border, hitSlop } as const;

export default tokens;
