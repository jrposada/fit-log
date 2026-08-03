import { StyleSheet } from 'react-native';

import { surfaces } from '../../library/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: surfaces.page,
  },
  map: {
    flex: 1,
  },
  pin: {
    fontSize: 28,
  },
});
