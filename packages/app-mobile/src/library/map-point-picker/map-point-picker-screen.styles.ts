import { StyleSheet } from 'react-native';

import { borders, ink, radii, spacing, surfaces, typography } from '../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: surfaces.base,
  },
  searchContainer: {
    padding: spacing.lg,
    backgroundColor: surfaces.page,
  },
  searchInput: {
    backgroundColor: surfaces.base,
    borderRadius: radii.md,
    padding: spacing.md,
    ...typography.body,
    borderWidth: 1,
    borderColor: borders.subtle,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  myLocationButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: surfaces.base,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  myLocationIcon: {
    fontSize: 24,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: borders.subtle,
    backgroundColor: surfaces.base,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: surfaces.page,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  addressIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  addressText: {
    flex: 1,
    ...typography.callout,
    color: ink.secondary,
  },
});
