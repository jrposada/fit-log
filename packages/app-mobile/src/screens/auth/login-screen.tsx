import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/auth/use-auth';
import { styles } from './login-screen.styles';

const LoginScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { login, loginWithIdp, register } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>&#x1F4AA;</Text>
          <Text style={styles.appName}>Fit Log</Text>
          <Text style={styles.tagline}>{t('auth.tagline')}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={login}
          >
            <Text style={styles.buttonIcon}>&#x2709;</Text>
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              {t('auth.signInWithEmail')}
            </Text>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('auth.or')}</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={styles.button}
            onPress={() => loginWithIdp('google')}
          >
            <Text style={styles.buttonIcon}>G</Text>
            <Text style={styles.buttonText}>{t('auth.signInWithGoogle')}</Text>
          </Pressable>

          {Platform.OS === 'ios' && (
            <Pressable
              style={styles.button}
              onPress={() => loginWithIdp('apple')}
            >
              <Text style={styles.buttonIcon}>&#xF8FF;</Text>
              <Text style={styles.buttonText}>{t('auth.signInWithApple')}</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 32 }]}>
        <Pressable style={styles.createAccountButton} onPress={register}>
          <Text style={styles.createAccountText}>
            {t('auth.createAccount')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LoginScreen;
