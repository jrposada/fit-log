import { StyleSheet, TextStyle } from 'react-native';

import { accent, ink, semantic, typography } from '../theme';

export type TypographySize = keyof typeof typography;

export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'inverse'
  | 'accent'
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
});

export const colorMap: Record<TypographyColor, string> = {
  primary: ink.primary,
  secondary: ink.secondary,
  tertiary: ink.tertiary,
  disabled: ink.disabled,
  inverse: ink.inverse,
  accent: accent.primary,
  error: semantic.error,
  warning: semantic.warning,
};

export const weightMap: Record<TypographyWeight, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};
