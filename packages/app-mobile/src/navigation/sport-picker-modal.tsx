import { Sport, SPORTS } from '@jrposada/fit-log-shared/common/sports/sports';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

import { SPORT_ICONS } from '../features/feed/sport-icons';
import Modal from '../library/modal';
import Stack from '../library/stack';
import { useToast } from '../library/toast';
import { Typography } from '../library/typography';
import { RootStackParamList } from '../types/routes';

interface SportPickerModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Lists the sports a session can be logged for. Sports without a wired
 * logging flow yet fall back to a "coming soon" toast — additive as new
 * sport packages land their own FAB destination.
 */
const SportPickerModal: FunctionComponent<SportPickerModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSelect = (sport: Sport) => {
    onClose();
    if (sport === 'climbing') {
      navigation.navigate('ClimbLog');
      return;
    }
    // `Sport` narrows to `never` here today (only 'climbing' exists), which
    // breaks the i18next key check on the template literal below — cast back
    // to keep this branch typechecking as new sports are added.
    toast.show(
      t('nav.sport_flow_coming_soon', {
        sport: t(`${sport as Sport}.title`),
      }),
      'success'
    );
  };

  return (
    <Modal.Root visible={visible} onClose={onClose}>
      <Modal.Header>
        <Typography size="title" weight="semibold">
          {t('nav.fab_label')}
        </Typography>
      </Modal.Header>
      <Modal.Body>
        <Stack gap="sm">
          {SPORTS.map((sport) => (
            <TouchableOpacity key={sport} onPress={() => handleSelect(sport)}>
              <Stack
                direction="horizontal"
                align="center"
                gap="sm"
                paddingVertical="sm"
              >
                <Typography size="title">{SPORT_ICONS[sport]}</Typography>
                <Typography size="body">{t(`${sport}.title`)}</Typography>
              </Stack>
            </TouchableOpacity>
          ))}
        </Stack>
      </Modal.Body>
    </Modal.Root>
  );
};

export default SportPickerModal;
