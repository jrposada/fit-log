import { useAuth } from '@jrposada/fit-log-shared-react/contexts/auth/use-auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent } from 'react';

import AvatarButton from '../library/avatar-button/avatar-button';
import ScreenHeader, {
  ScreenHeaderProps,
} from '../library/screen-header/screen-header';
import { RootStackParamList } from '../types/routes';

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
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const resolvedAction = action ?? (
    <AvatarButton
      name={user?.name}
      email={user?.email}
      onPress={() => navigation.navigate('Profile')}
    />
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
