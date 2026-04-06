import { useAuth } from '@shared-react/contexts/auth/use-auth';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import Button from '../../library/button';
import { Icon } from '../../library/icon';
import Screen from '../../library/screen';
import Separator from '../../library/separator';
import Stack from '../../library/stack';
import { Typography } from '../../library/typography';

const LoginScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const { login, loginWithIdp, register } = useAuth();

  return (
    <Screen
      footer={
        <Button
          title={t('auth.createAccount')}
          onPress={register}
          variant="ghost"
        />
      }
      footerVariant="transparent"
      centered
      paddingHorizontal="2xl"
    >
      <Stack align="center" gap="sm" spacer="5xl">
        <Icon icon="💪" size="xl" spacer="md" />
        <Typography size="jumbo" color="accent">
          {t('auth.appName')}
        </Typography>
        <Typography color="secondary">{t('auth.tagline')}</Typography>
      </Stack>

      <Stack gap="md">
        <Button
          title={t('auth.signInWithEmail')}
          onPress={login}
          variant="primary"
        />

        <Separator label={t('auth.or')} inset="2xl" />

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
      </Stack>
    </Screen>
  );
};

export default LoginScreen;
