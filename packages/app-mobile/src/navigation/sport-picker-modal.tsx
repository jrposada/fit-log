import { Sport, SPORTS } from '@jrposada/fit-log-shared/common/sports/sports';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

import { SPORT_ICONS } from '../features/feed/sport-icons';
import Modal from '../library/modal';
import Stack from '../library/stack';
import { useToast } from '../library/toast';
import { Typography } from '../library/typography';

interface SportPickerModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Lists the sports a session can be logged for. Selecting one is a no-op
 * placeholder for now — wiring each sport's real logging flow is the
 * climbing-port ticket's job; this shell just needs to exist and be additive.
 */
const SportPickerModal: FunctionComponent<SportPickerModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  const handleSelect = (sport: Sport) => {
    onClose();
    toast.show(
      t('nav.sport_flow_coming_soon', { sport: t(`${sport}.title`) }),
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
