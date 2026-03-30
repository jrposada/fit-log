import { StyleSheet } from 'react-native';

import { colors } from '../../../../library/theme';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hold: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    borderWidth: 2,
    borderColor: colors.cardBackground,
    marginLeft: -12,
    marginTop: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  holdEditable: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
  },
  holdRemoveIndicator: {
    color: colors.cardBackground,
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 12,
  },
});
