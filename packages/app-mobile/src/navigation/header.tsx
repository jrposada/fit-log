import { useNavigation } from '@react-navigation/native';
import { useVersion } from '@shared-react/api/version/use-version';
import { useAuth } from '@shared-react/contexts/auth/use-auth';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AvatarButton from '../library/avatar-button/avatar-button';
import Button from '../library/button';
import Modal from '../library/modal';
import ScreenHeader, {
  ScreenHeaderProps,
} from '../library/screen-header/screen-header';
import { spacing } from '../library/theme';
import Typography from '../library/typography/typography';

type HeaderProps = Omit<ScreenHeaderProps, 'onBackPress'> & {
  back?: boolean;
  onBackPress?: () => void;
};

const Header: FunctionComponent<HeaderProps> = ({
  back = false,
  onBackPress,
  action,
  ...rest
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { data: version } = useVersion();

  const [menuVisible, setMenuVisible] = useState(false);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleLogout = async () => {
    setMenuVisible(false);
    await logout();
  };

  const resolvedAction = action ?? (
    <AvatarButton
      name={user?.name}
      email={user?.email}
      onPress={() => setMenuVisible(true)}
    />
  );

  return (
    <>
      <ScreenHeader
        {...rest}
        onBackPress={back ? handleBackPress : undefined}
        action={resolvedAction}
      />
      <Modal.Root visible={menuVisible} onClose={() => setMenuVisible(false)}>
        <Modal.Header>
          <Typography size="heading">{user?.name ?? user?.email}</Typography>
          {user?.name && (
            <Typography size="caption" color="secondary">
              {user.email}
            </Typography>
          )}
        </Modal.Header>
        <Modal.Body>
          <Typography
            size="overline"
            color="secondary"
            style={{ marginBottom: spacing.md }}
          >
            {t('version', { version })}
          </Typography>
          <Button
            title={t('auth.logout')}
            onPress={handleLogout}
            variant="outline"
          />
        </Modal.Body>
      </Modal.Root>
    </>
  );
};

export default Header;
