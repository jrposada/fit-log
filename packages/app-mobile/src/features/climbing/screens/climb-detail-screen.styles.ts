import { StyleSheet } from 'react-native';

import { colors, spacing } from '../../../library/theme';

export const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  holdsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hold: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    borderWidth: 2,
    borderColor: colors.cardBackground,
    marginLeft: -12,
    marginTop: -12,
  },
  descriptionContainer: {
    padding: spacing.lg,
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});
