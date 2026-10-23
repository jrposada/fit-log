export const SPORTS = ['climbing', 'gym'] as const;
export type Sport = (typeof SPORTS)[number];
