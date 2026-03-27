import { StyleSheet } from 'react-native';

const ACTION_BUTTON_WIDTH = 72;

export const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    borderRadius: 12,
    overflow: 'hidden',
  },
  swipeableRow: {
    overflow: 'visible',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.7,
  },
  topRow: {
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sector: {
    fontSize: 13,
    color: '#666',
  },
  rightActions: {
    width: ACTION_BUTTON_WIDTH,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#1b5e20',
    justifyContent: 'center',
    alignItems: 'center',
    width: ACTION_BUTTON_WIDTH,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export const ACTION_WIDTH = ACTION_BUTTON_WIDTH;
