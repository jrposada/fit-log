import { StyleSheet } from 'react-native';

const HEADER_FIXED_HEIGHT = 52;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    minHeight: HEADER_FIXED_HEIGHT,
  },
  backButton: {
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    flexShrink: 1,
  },
  versionText: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.8,
  },
});

export default styles;
export { HEADER_FIXED_HEIGHT };
