import { StyleSheet } from 'react-native';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 48,
};

export const styles = StyleSheet.create({
  base: {
    fontWeight: '600',
  },
});
