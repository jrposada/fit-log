export const SPORTS = ['climbing'] as const;
export type Sport = (typeof SPORTS)[number];
