import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Surfaces – 5-level tonal hierarchy (light mode, warm-gray progression)
// ---------------------------------------------------------------------------
export const surfaces = {
  /** Pure white. Primary content cards, modals, sheets. */
  base: '#FFFFFF',
  /** Very faint warm gray. Elevated cards, selected states, input fields. */
  raised: '#FAFAF9',
  /** The page itself. Screen/scroll backgrounds. */
  page: '#F4F3F1',
  /** Subtle recessed areas. Collapsible headers, chips, subdued cards. */
  sunken: '#ECEAE7',
  /** Strongest contrast from base. Nav bars, footer bars, overlays. */
  overlay: '#E4E2DE',
} as const;

// ---------------------------------------------------------------------------
// Ink – text color hierarchy
// ---------------------------------------------------------------------------
export const ink = {
  /** Primary text. Headings, body copy, input values. */
  primary: '#1A1A19',
  /** Secondary text. Subtitles, descriptions, meta. */
  secondary: '#6B6966',
  /** Tertiary text. Placeholders, timestamps, disabled hints. */
  tertiary: '#9C9891',
  /** Disabled text. Truly non-interactive. */
  disabled: '#C5C1BB',
  /** Inverse text. On dark/accent backgrounds. */
  inverse: '#FFFFFF',
} as const;

// ---------------------------------------------------------------------------
// Accent – single primary accent (deep forest green)
// ---------------------------------------------------------------------------
export const accent = {
  /** Primary accent. CTAs, active tab, focused inputs, links. */
  primary: '#2D6A4F',
  /** Hover/press state or slight emphasis. */
  emphasis: '#1B4332',
  /** Very light tint for selected backgrounds, chips, badges. */
  subtle: 'rgba(45, 106, 79, 0.08)',
  /** Medium tint for icon backgrounds, progress fills. */
  muted: 'rgba(45, 106, 79, 0.15)',
  /** Text on accent-colored backgrounds. */
  onAccent: '#FFFFFF',
} as const;

// ---------------------------------------------------------------------------
// Semantic – status colors
// ---------------------------------------------------------------------------
export const semantic = {
  success: '#2D6A4F',
  destructive: '#C1292E',
  warning: '#D4870E',
  error: '#C1292E',

  successSubtle: 'rgba(45, 106, 79, 0.08)',
  successMuted: '#EAF4EF',
  destructiveSubtle: 'rgba(193, 41, 46, 0.08)',
  destructiveMuted: '#FCEAEA',
  warningSubtle: 'rgba(212, 135, 14, 0.08)',
  warningMuted: '#FDF3E4',
} as const;

// ---------------------------------------------------------------------------
// Palette – named colors for feature card icons / illustrations
// ---------------------------------------------------------------------------
export const palette = {
  green: '#2D6A4F',
  blue: '#1A659E',
  amber: '#D4870E',
  plum: '#7B2D8B',
  coral: '#C1292E',
  gold: '#B8860B',
} as const;

// ---------------------------------------------------------------------------
// Borders – 3 levels
// ---------------------------------------------------------------------------
export const borders = {
  /** For input fields and interactive boundaries. */
  subtle: '#E0DDD8',
  /** Default separator when a line IS needed. */
  default: '#D5D2CC',
  /** Strong borders for focused inputs or key affordances. */
  strong: '#B8B4AD',
} as const;

// ---------------------------------------------------------------------------
// Typography – 7-rung semantic scale (system fonts only)
// ---------------------------------------------------------------------------
export const typography = {
  /** Large brand text. App name, splash text. */
  jumbo: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  /** Large screen titles. */
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  /** Section-level headings inside a screen. */
  heading: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  /** Card titles, modal titles, screen-header title. */
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
  },
  /** Default body text. Descriptions, paragraphs, input values. */
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  /** Secondary body. Subtitles, context lines, helper text. */
  callout: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  /** Small meta text, badges, timestamps, tab labels. */
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
  /** Tiny labels, version text, fine print. */
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
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
// Radii – expanded with semantic aliases
// ---------------------------------------------------------------------------
export const radii = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,

  // Semantic aliases
  card: 12,
  button: 8,
  input: 8,
  badge: 6,
  chip: 9999,
} as const;

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------
export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    ...Platform.select({ android: { elevation: 2 } }),
  },
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    ...Platform.select({ android: { elevation: 3 } }),
  },
  cardSubtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    ...Platform.select({ android: { elevation: 1 } }),
  },
} as const;
