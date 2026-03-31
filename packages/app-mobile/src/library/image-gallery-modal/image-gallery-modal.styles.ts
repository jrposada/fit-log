import { StyleSheet } from 'react-native';

import { spacing } from '../theme';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: spacing.md,
    zIndex: 10,
  },
  flatList: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  indicatorText: {
    color: '#fff',
    fontSize: 14,
  },
});
