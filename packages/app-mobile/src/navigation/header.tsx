import { useNavigation } from '@react-navigation/native';
import { useVersion } from '@shared-react/api/version/use-version';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import ScreenHeader, {
  ScreenHeaderProps,
} from '../library/screen-header/screen-header';
import styles from './header.styles';

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

  const { data: version } = useVersion();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const resolvedAction = action ?? (
    <Text style={styles.versionText}>{t('version', { version })}</Text>
  );

  return (
    <ScreenHeader
      {...rest}
      onBackPress={back ? handleBackPress : undefined}
      action={resolvedAction}
    />
  );
};

export default Header;
