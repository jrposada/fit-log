import { useAuth } from '@shared-react/contexts/auth/use-auth';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';

import Button from '../../library/button';
import { Icon } from '../../library/icon';
import Screen from '../../library/screen';
import Separator from '../../library/separator';
import { spacing } from '../../library/theme';
import { Typography } from '../../library/typography';
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
        <Icon icon="&#x1F4AA;" size="xl" style={{ marginBottom: spacing.lg }} />
        <Typography
          size="jumbo"
          color="accent"
          style={{ marginBottom: spacing.sm }}
        >
          {t('auth.appName')}
        </Typography>
        <Typography color="secondary">{t('auth.tagline')}</Typography>
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
