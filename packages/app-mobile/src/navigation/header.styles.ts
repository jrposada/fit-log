import { StyleSheet } from 'react-native';

import { ink, typography } from '../library/theme';

const styles = StyleSheet.create({
  versionText: {
    ...typography.overline,
    color: ink.secondary,
    opacity: 0.8,
  },
});

export default styles;
