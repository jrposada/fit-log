import { StyleSheet } from 'react-native';

import { colors, radii, shadows, spacing } from '../../../library/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 48,
  },
  climbCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: 14,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.cardSubtle,
  },
  climbInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  climbTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  climbTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  climbMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: spacing.xs,
  },
  sentBadge: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  projectBadge: {
    fontSize: 14,
  },
  attemptBadge: {
    fontSize: 12,
    color: colors.actionWarning,
    fontWeight: '600',
  },
  quickViewButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: radii.sm,
  },
  quickViewButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  modalHeader: {
    paddingVertical: spacing.xs,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: radii.md,
    marginBottom: spacing.lg,
  },
  modalDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  statusSection: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: '#f8f8f8',
    borderRadius: radii.md,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textHeading,
    marginBottom: spacing.xs,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  logSendButton: {
    backgroundColor: colors.actionSuccess,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
  },
  logSendButtonText: {
    color: colors.textOnAction,
    fontSize: 15,
    fontWeight: '600',
  },
  projectButton: {
    backgroundColor: colors.actionWarning,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
  },
  projectButtonText: {
    color: colors.textOnAction,
    fontSize: 15,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: colors.actionInfo,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
  },
  detailsButtonText: {
    color: colors.textOnAction,
    fontSize: 15,
    fontWeight: '600',
  },
});
