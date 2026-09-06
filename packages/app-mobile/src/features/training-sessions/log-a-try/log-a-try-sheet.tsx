import { useClimbsById } from '@jrposada/fit-log-shared-react/api/climbs/use-climbs-by-id';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native';

import { Badge } from '../../../library/badge';
import Button from '../../../library/button';
import IconButton from '../../../library/icon-button';
import Modal from '../../../library/modal';
import Stack from '../../../library/stack';
import Stepper from '../../../library/stepper';
import { ink } from '../../../library/theme';
import { Typography } from '../../../library/typography';
import GradeBadge from '../../climbing/components/common/grade-badge';
import { ActiveTrainingSession } from '../active-training-session/active-training-session';
import LogATryClimbPicker from './log-a-try-climb-picker';
import { styles } from './log-a-try-sheet.styles';
import OutcomePicker from './outcome-picker';
import { useLogATry } from './use-log-a-try';

export interface LogATrySheetProps {
  session: ActiveTrainingSession;
  visible: boolean;
  onClose: () => void;
}

const LogATrySheet: FunctionComponent<LogATrySheetProps> = ({
  session,
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const {
    selection,
    setSelection,
    status,
    setStatus,
    attempts,
    setAttempts,
    notes,
    setNotes,
    isProject,
    handleToggleProject,
    handleSave,
    isSaving,
  } = useLogATry({ session, visible, onSaved: onClose });

  const { data: selectedClimb } = useClimbsById({ id: selection?.climbId });

  return (
    <Modal.Root visible={visible} onClose={onClose}>
      <Modal.Header>
        <Stack direction="horizontal" align="center" justify="between">
          <Typography size="title">{t('climbing.log_a_try_title')}</Typography>
          <IconButton icon="close" variant="ghost" onPress={onClose} />
        </Stack>
      </Modal.Header>
      <Modal.Body>
        <Stack gap="lg">
          {selectedClimb ? (
            <Stack direction="horizontal" align="center" justify="between">
              <Stack direction="horizontal" align="center" gap="sm">
                <GradeBadge grade={selectedClimb.grade} />
                <Stack gap="2xs">
                  <Typography weight="semibold">
                    {selectedClimb.name}
                  </Typography>
                  <Typography size="callout" color="secondary">
                    {selectedClimb.sector.name}
                  </Typography>
                </Stack>
              </Stack>
              {selection?.climbId === session.currentClimbId && (
                <Badge
                  label={t('climbing.session_active_badge')}
                  variant="success"
                />
              )}
            </Stack>
          ) : (
            <Typography color="secondary">
              {t('climbing.log_a_try_select_climb_first')}
            </Typography>
          )}

          <LogATryClimbPicker
            session={session}
            selection={selection}
            onSelect={setSelection}
          />

          <OutcomePicker
            value={status}
            onChange={setStatus}
            disabled={!selection}
          />

          <Stack direction="horizontal" align="center" justify="between">
            <Typography weight="semibold">
              {t('climbing.log_a_try_attempts_label')}
            </Typography>
            <Stepper
              value={attempts}
              onChange={setAttempts}
              min={1}
              disabled={!selection}
            />
          </Stack>

          <Stack direction="horizontal" align="center" justify="between">
            <Typography weight="semibold">
              {t('climbing.log_a_try_mark_project_label')}
            </Typography>
            <Button
              title={
                isProject
                  ? t('climbing.unproject_action')
                  : t('climbing.project_action')
              }
              variant={isProject ? 'primary' : 'outline'}
              size="sm"
              disabled={!selection}
              onPress={handleToggleProject}
            />
          </Stack>

          <TextInput
            style={styles.notesInput}
            placeholder={t('climbing.log_a_try_notes_placeholder')}
            placeholderTextColor={ink.tertiary}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          title={t('climbing.log_a_try_save_button')}
          variant="primary"
          fullWidth
          disabled={!selection || isSaving}
          onPress={handleSave}
        />
      </Modal.Footer>
    </Modal.Root>
  );
};

export default LogATrySheet;
