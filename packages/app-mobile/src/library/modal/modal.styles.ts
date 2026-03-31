import { StyleSheet } from 'react-native';

import { radii, surfaces } from '../theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayFullscreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '100%',
    maxHeight: '90%',
    display: 'flex',
    backgroundColor: surfaces.base,
    borderTopEndRadius: radii.md,
    borderTopStartRadius: radii.md,
    overflow: 'hidden',
  },
  containerFullscreen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: surfaces.base,
    overflow: 'hidden',
  },
});
