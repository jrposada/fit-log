import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayFullscreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '100%',
    maxHeight: '90%',
    display: 'flex',
    backgroundColor: '#fff',
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    overflow: 'hidden',
  },
  containerFullscreen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
});
