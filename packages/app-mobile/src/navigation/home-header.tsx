import { useAuth } from '@shared-react/contexts/auth/use-auth';
import { FunctionComponent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import AvatarButton from '../library/avatar-button/avatar-button';
import Header from '../navigation/header';

const HomeHeader: FunctionComponent = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const handleAvatarPress = useCallback(() => {
    Alert.alert(t('auth.logoutConfirmTitle'), t('auth.logoutConfirmMessage'), [
      {
        text: t('actions.cancel'),
        style: 'cancel',
      },
      {
        text: t('auth.logout'),
        style: 'destructive',
        onPress: logout,
      },
    ]);
  }, [t, logout]);

  return (
    <Header
      title={t('home.title')}
      action={
        <AvatarButton
          name={user?.name}
          email={user?.email}
          onPress={handleAvatarPress}
        />
      }
    />
  );
};

export default HomeHeader;
