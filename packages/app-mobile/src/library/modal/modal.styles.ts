import { StyleSheet } from 'react-native';

import { borders, radii, spacing, surfaces } from '../theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: surfaces.scrim,
  },
  overlayFullscreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: surfaces.scrim,
  },
  container: {
    width: '100%',
    maxHeight: '90%',
    display: 'flex',
    backgroundColor: surfaces.base,
    borderTopEndRadius: radii.xl,
    borderTopStartRadius: radii.xl,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: borders.default,
    overflow: 'hidden',
  },
  containerFullscreen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: surfaces.base,
    overflow: 'hidden',
  },
  handle: {
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  handleBar: {
    width: 48,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: surfaces.raised,
  },
});
