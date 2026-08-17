import { StyleSheet, TextStyle } from 'react-native';

import { accent, dataTypography, ink, semantic, typography } from '../theme';

export type TypographySize = keyof typeof typography | 'dataLg' | 'dataSm';

export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'inverse'
  | 'accent'
  | 'secondaryAccent'
  | 'error'
  | 'warning';

export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export const sizeStyles = StyleSheet.create<Record<TypographySize, TextStyle>>({
  jumbo: { ...typography.jumbo },
  display: { ...typography.display },
  heading: { ...typography.heading },
  title: { ...typography.title },
  body: { ...typography.body },
  callout: { ...typography.callout },
  caption: { ...typography.caption },
  overline: { ...typography.overline },
  /** JetBrains Mono numeric readouts — stat values, timers, counts. */
  dataLg: { ...dataTypography.lg },
  dataSm: { ...dataTypography.sm },
});

export const colorMap: Record<TypographyColor, string> = {
  primary: ink.primary,
  secondary: ink.secondary,
  tertiary: ink.tertiary,
  disabled: ink.disabled,
  inverse: ink.inverse,
  accent: accent.primary,
  secondaryAccent: accent.secondary,
  error: semantic.error,
  warning: semantic.warning,
};

export const weightMap: Record<TypographyWeight, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};
