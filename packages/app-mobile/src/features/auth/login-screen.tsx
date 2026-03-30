import { useAuth } from '@shared-react/contexts/auth/use-auth';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';

import Button from '../../library/button';
import Screen from '../../library/screen';
import Separator from '../../library/separator';
import { styles } from './login-screen.styles';

const LoginScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const { login, loginWithIdp, register } = useAuth();

  const footer = (
    <Button
      title={t('auth.createAccount')}
      onPress={register}
      variant="ghost"
    />
  );

  return (
    <Screen
      footer={footer}
      footerStyle={styles.footer}
      scrollViewProps={{
        scrollEnabled: false,
        contentContainerStyle: styles.content,
      }}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>&#x1F4AA;</Text>
        <Text style={styles.appName}>{t('auth.appName')}</Text>
        <Text style={styles.tagline}>{t('auth.tagline')}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title={t('auth.signInWithEmail')}
          onPress={login}
          variant="primary"
        />

        <Separator label={t('auth.or')} marginVertical={24} />

        <Button
          title={t('auth.signInWithGoogle')}
          onPress={() => loginWithIdp('google')}
          variant="outline"
          icon="G"
        />

        {Platform.OS === 'ios' && (
          <Button
            title={t('auth.signInWithApple')}
            onPress={() => loginWithIdp('apple')}
            variant="outline"
            icon="&#xF8FF;"
          />
        )}
      </View>
    </Screen>
  );
};

export default LoginScreen;
