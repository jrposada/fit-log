import { Platform } from 'react-native';

export const colors = {
  screenBackground: '#f5f5f5',
  cardBackground: '#fff',

  textPrimary: '#222',
  textSecondary: '#666',
  textHeading: '#333',
  textDisabled: '#999',
  textOnAction: '#fff',

  border: '#e0e0e0',
  borderLight: '#ddd',

  actionPrimary: '#007AFF',
  actionSuccess: '#1b5e20',
  actionDestructive: '#dc3545',
  actionWarning: '#ff9800',
  actionInfo: '#2196F3',

  disabled: '#ccc',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  screenPadding: 16,
} as const;

export const radii = {
  sm: 6,
  md: 8,
  lg: 10,
  card: 12,
  button: 8,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    ...Platform.select({ android: { elevation: 2 } }),
  },
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    ...Platform.select({ android: { elevation: 3 } }),
  },
  cardSubtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    ...Platform.select({ android: { elevation: 1 } }),
  },
} as const;
