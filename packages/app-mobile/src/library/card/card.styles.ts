import { StyleSheet } from 'react-native';

import { colors, radii, shadows } from '../theme';

export const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.cardBackground,
    borderRadius: radii.card,
  },
  elevated: {
    ...shadows.card,
  },
  elevatedStrong: {
    ...shadows.cardElevated,
  },
  flat: {},
  pressed: {
    opacity: 0.7,
  },
});
