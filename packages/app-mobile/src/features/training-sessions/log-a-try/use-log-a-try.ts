import { ClimbHistoryStatus } from '@jrposada/fit-log-shared/common/climb-histories/climb-history-statuses';
import { useClimbHistoriesPut } from '@jrposada/fit-log-shared-react/api/climb-histories/use-climb-histories-put';
import { useClimbHistoryProject } from '@jrposada/fit-log-shared-react/api/climb-histories/use-climb-history-project';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useToast } from '../../../library/toast';
import { ActiveTrainingSession } from '../active-training-session/active-training-session';
import { useSetCurrentClimb } from '../active-training-session/use-set-current-climb';
import { LogATryClimbSelection } from './log-a-try-climb-selection';

function initialSelection(
  session: ActiveTrainingSession
): LogATryClimbSelection | null {
  const history = session.currentClimbId
    ? session.climbHistories.find((h) => h.climb === session.currentClimbId)
    : undefined;

  return history
    ? {
        climbId: history.climb,
        locationId: history.location,
        sectorId: history.sector,
      }
    : null;
}

interface UseLogATryParams {
  session: ActiveTrainingSession;
  visible: boolean;
  onSaved: () => void;
}

export function useLogATry({ session, visible, onSaved }: UseLogATryParams) {
  const { t } = useTranslation();
  const toast = useToast();

  const [prevVisible, setPrevVisible] = useState(visible);
  const [selection, setSelection] = useState<LogATryClimbSelection | null>(() =>
    initialSelection(session)
  );
  const [status, setStatus] = useState<ClimbHistoryStatus>('attempt');
  const [attempts, setAttempts] = useState(1);
  const [notes, setNotes] = useState('');

  // Reset the form to a fresh state every time the sheet opens (the "adjust
  // state on prop change" pattern — not an effect, to avoid a redundant
  // render pass).
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setSelection(initialSelection(session));
      setStatus('attempt');
      setAttempts(1);
      setNotes('');
    }
  }

  const selectedHistory = selection
    ? session.climbHistories.find((h) => h.climb === selection.climbId)
    : undefined;
  const isProject = selectedHistory?.isProject ?? false;

  const climbHistoriesPut = useClimbHistoriesPut({
    onError: (error) =>
      toast.show(t('climbing.log_a_try_save_error', { error }), 'destructive'),
  });
  const climbHistoryProject = useClimbHistoryProject();
  const { handleSetCurrentClimb } = useSetCurrentClimb(session);

  const handleToggleProject = () => {
    if (!selection) {
      return;
    }

    climbHistoryProject.mutate({
      climb: selection.climbId,
      location: selection.locationId,
      sector: selection.sectorId,
      isProject: !isProject,
    });
  };

  const handleSave = () => {
    if (!selection) {
      return;
    }

    climbHistoriesPut.mutate(
      {
        climb: selection.climbId,
        location: selection.locationId,
        sector: selection.sectorId,
        status,
        attempts,
        notes: notes.trim() || undefined,
        trainingSession: session.id,
      },
      {
        onSuccess: () => {
          handleSetCurrentClimb(selection.climbId);
          onSaved();
        },
      }
    );
  };

  return {
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
    isSaving: climbHistoriesPut.isPending,
  };
}
