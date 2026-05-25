export const DEFAULT_HOLD_RADIUS = 0.03;

export const HOLD_TYPES = ['normal', 'start', 'end', 'feet-only'] as const;
export type HoldType = (typeof HOLD_TYPES)[number];
