import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoText: {
    fontSize: 48,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
  },
  buttonsContainer: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  primaryButtonText: {
    color: '#fff',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  createAccountButton: {
    paddingVertical: 12,
  },
  createAccountText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
});
