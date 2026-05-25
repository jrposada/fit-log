export const INTENSITY_UNITS = ['time', 'weight', 'body-weight'] as const;
export type IntensityUnit = (typeof INTENSITY_UNITS)[number];
