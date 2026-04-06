import { StyleSheet } from 'react-native';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg';

export const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
};

export const styles = StyleSheet.create({
  base: {
    fontWeight: '600',
  },
});
