import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
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
    color: '#666',
    textAlign: 'center',
  },
  sectorSection: {
    marginBottom: 16,
  },
  sectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  sectorTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  expandIcon: {
    fontSize: 12,
    color: '#666',
  },
  climbCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  climbInfo: {
    flex: 1,
    marginRight: 12,
  },
  climbTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  climbTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  climbMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
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
    color: '#ff9800',
    fontWeight: '600',
  },
  quickViewButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  quickViewButtonText: {
    fontSize: 12,
    color: '#666',
  },
  modalHeader: {
    paddingVertical: 4,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 16,
    lineHeight: 20,
  },
  statusSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  logSendButton: {
    backgroundColor: '#1b5e20',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logSendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  projectButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  projectButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
