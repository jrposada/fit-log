import { StyleSheet } from 'react-native';

import { ink } from './tokens';

export const commonStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: ink.secondary,
    textAlign: 'center',
  },
});
