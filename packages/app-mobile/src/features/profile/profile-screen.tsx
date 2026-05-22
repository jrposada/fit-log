import { useMe } from '@jrposada/fit-log-shared-react/api/me/use-me';
import { useVersion } from '@jrposada/fit-log-shared-react/api/version/use-version';
import { useAuth } from '@jrposada/fit-log-shared-react/contexts/auth/use-auth';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import Button from '../../library/button';
import Screen from '../../library/screen';
import { spacing } from '../../library/theme';
import { Typography } from '../../library/typography';

const ProfileScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { data: me } = useMe();
  const { data: version } = useVersion();

  return (
    <Screen presentation="modal" padding="xl">
      <View style={{ marginBottom: spacing.xl }}>
        <Typography size="heading">{me?.name ?? me?.email}</Typography>
        {me?.name && (
          <Typography size="caption" color="secondary">
            {me.email}
          </Typography>
        )}
      </View>

      <Typography
        size="overline"
        color="secondary"
        style={{ marginBottom: spacing.xl }}
      >
        {t('version', { version })}
      </Typography>

      <Button title={t('auth.logout')} onPress={logout} variant="outline" />
    </Screen>
  );
};

export default ProfileScreen;
