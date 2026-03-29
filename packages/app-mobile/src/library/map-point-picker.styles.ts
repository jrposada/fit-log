import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelButton: {
    fontSize: 16,
    color: colors.actionPrimary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerPlaceholder: {
    width: 60,
  },
  searchContainer: {
    padding: spacing.lg,
    backgroundColor: colors.screenBackground,
  },
  searchInput: {
    backgroundColor: colors.cardBackground,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.cardBackground,
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
    borderTopColor: colors.border,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.screenBackground,
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
    fontSize: 14,
    color: colors.textSecondary,
  },
  confirmButton: {
    backgroundColor: colors.actionPrimary,
    borderRadius: radii.card,
    padding: spacing.lg,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6,
  },
  confirmButtonText: {
    color: colors.textOnAction,
    fontSize: 18,
    fontWeight: '600',
  },
});
