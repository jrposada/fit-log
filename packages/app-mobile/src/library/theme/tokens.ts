import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Surfaces – Kinetic Dark tonal hierarchy (dark-mode-first slate/navy)
// ---------------------------------------------------------------------------
export const surfaces = {
  /** Base cards, modals, sheets. */
  base: '#171f33',
  /** Elevated cards, selected states, input fields. */
  raised: '#222a3d',
  /** The page itself. Screen/scroll backgrounds. */
  page: '#0b1326',
  /** Subtle recessed areas. Collapsible headers, chips, subdued cards. */
  sunken: '#131b2e',
  /** Strongest contrast from base. Nav bars, footer bars, overlays. */
  overlay: '#060e20',
  /** Brightest surface. Floating cards (session flyover) that must pop off the page. */
  bright: '#31394d',
  /** Modal/sheet backdrop scrim. */
  scrim: 'rgba(6, 14, 32, 0.8)',
} as const;

// ---------------------------------------------------------------------------
// Ink – text color hierarchy
// ---------------------------------------------------------------------------
export const ink = {
  /** Primary text. Headings, body copy, input values. */
  primary: '#dae2fd',
  /** Secondary text. Subtitles, descriptions, meta. */
  secondary: '#c6c9ab',
  /** Tertiary text. Placeholders, timestamps, disabled hints. */
  tertiary: '#909378',
  /** Disabled text. Truly non-interactive. */
  disabled: '#5c6270',
  /** Inverse text. On lime/light-accent backgrounds. */
  inverse: '#2c3400',
} as const;

// ---------------------------------------------------------------------------
// Accent – electric lime primary, cyan secondary
// ---------------------------------------------------------------------------
export const accent = {
  /** Primary accent. CTAs, active tab, focused/active states. */
  primary: '#d2f000',
  /** Hover/press state or slight emphasis. */
  emphasis: '#b8d300',
  /** Very light tint for selected backgrounds, chips, badges. */
  subtle: 'rgba(210, 240, 0, 0.08)',
  /** Medium tint for icon backgrounds, progress fills. */
  muted: 'rgba(210, 240, 0, 0.15)',
  /** Text on lime-colored backgrounds. */
  onAccent: '#2c3400',
  /** Secondary accent (cyan). Links, secondary data viz, focus rings. */
  secondary: '#00eefc',
  /** Text on cyan-colored backgrounds. */
  onSecondary: '#00363a',
} as const;

// ---------------------------------------------------------------------------
// Semantic – status colors
// ---------------------------------------------------------------------------
export const semantic = {
  success: '#d2f000',
  destructive: '#ffb4ab',
  warning: '#f59e0b',
  error: '#ffb4ab',

  successSubtle: 'rgba(210, 240, 0, 0.08)',
  successMuted: 'rgba(210, 240, 0, 0.15)',
  destructiveSubtle: 'rgba(255, 180, 171, 0.08)',
  destructiveMuted: 'rgba(147, 0, 10, 0.35)',
  warningSubtle: 'rgba(245, 158, 11, 0.08)',
  warningMuted: 'rgba(245, 158, 11, 0.18)',
} as const;

// ---------------------------------------------------------------------------
// Palette – named colors for feature card icons / illustrations
// ---------------------------------------------------------------------------
export const palette = {
  green: '#d2f000',
  blue: '#00eefc',
  amber: '#f59e0b',
  plum: '#d4e4fa',
  coral: '#ffb4ab',
  gold: '#b8d300',
} as const;

// ---------------------------------------------------------------------------
// Borders – 3 levels
// ---------------------------------------------------------------------------
export const borders = {
  /** For input fields and interactive boundaries. */
  subtle: '#454932',
  /** Default separator when a line IS needed. */
  default: '#454932',
  /** Strong borders for focused inputs or key affordances. */
  strong: '#909378',
} as const;

// ---------------------------------------------------------------------------
// Typography – 7-rung semantic scale, Inter (UI) + JetBrains Mono (data)
// ---------------------------------------------------------------------------
const FONT_INTER = 'Inter_400Regular';
const FONT_INTER_SEMIBOLD = 'Inter_600SemiBold';
const FONT_INTER_BOLD = 'Inter_700Bold';
const FONT_INTER_EXTRABOLD = 'Inter_800ExtraBold';
const FONT_MONO_MEDIUM = 'JetBrainsMono_500Medium';
const FONT_MONO_SEMIBOLD = 'JetBrainsMono_600SemiBold';

export const typography = {
  /** Large brand text. App name, splash text. */
  jumbo: {
    fontFamily: FONT_INTER_EXTRABOLD,
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '800' as const,
    letterSpacing: -0.96,
  },
  /** Large screen titles. */
  display: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.32,
  },
  /** Section-level headings inside a screen. */
  heading: {
    fontFamily: FONT_INTER_SEMIBOLD,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  /** Card titles, modal titles, screen-header title. */
  title: {
    fontFamily: FONT_INTER_SEMIBOLD,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  /** Default body text. Descriptions, paragraphs, input values. */
  body: {
    fontFamily: FONT_INTER,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  /** Secondary body. Subtitles, context lines, helper text. */
  callout: {
    fontFamily: FONT_INTER,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  /** Small meta text, badges, timestamps, tab labels. Uppercase label-caps. */
  caption: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700' as const,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
  /** Tiny labels, version text, fine print. */
  overline: {
    fontFamily: FONT_INTER_SEMIBOLD,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
} as const;

/**
 * Monospaced "data" rungs (JetBrains Mono) for numeric readouts: stat values,
 * timers, counts, distances. Kept separate from the semantic 7-rung scale
 * since data text is a font-family swap layered on top of a size choice, not
 * another semantic rung.
 */
export const dataTypography = {
  lg: {
    fontFamily: FONT_MONO_SEMIBOLD,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  sm: {
    fontFamily: FONT_MONO_MEDIUM,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
    letterSpacing: 0,
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing – expanded scale (2xs through 5xl)
// ---------------------------------------------------------------------------
export const spacing = {
  '2xs': 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 56,
  screenPadding: 20,
} as const;

// ---------------------------------------------------------------------------
// Radii – soft/technical scale per Kinetic Dark shape language
// ---------------------------------------------------------------------------
export const radii = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 9999,

  // Semantic aliases
  card: 8,
  button: 4,
  input: 4,
  badge: 4,
  chip: 9999,
} as const;

// ---------------------------------------------------------------------------
// Shadows / glow – flat surfaces with borders, glow replaces elevation
// ---------------------------------------------------------------------------
export const shadows = {
  card: {
    ...Platform.select({ android: { elevation: 0 } }),
  },
  cardElevated: {
    ...Platform.select({ android: { elevation: 0 } }),
  },
  cardSubtle: {
    ...Platform.select({ android: { elevation: 0 } }),
  },
  /** "Active Elevation" glow for live/selected states — replaces shadow-based elevation. */
  glow: {
    shadowColor: accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    ...Platform.select({ android: { elevation: 4 } }),
  },
  glowStrong: {
    shadowColor: accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    ...Platform.select({ android: { elevation: 6 } }),
  },
} as const;
