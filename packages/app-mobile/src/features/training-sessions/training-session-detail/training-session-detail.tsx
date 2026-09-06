import { TrainingSession } from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import { FunctionComponent } from 'react';

import Stack from '../../../library/stack';
import { Typography } from '../../../library/typography';

interface ActiveTrainingSessionProps {
  session: TrainingSession;
  isActive?: boolean;
  isExpanded: boolean;
  onToggleIsExpanded: () => void;
}

const ActiveTrainingSession: FunctionComponent<ActiveTrainingSessionProps> = ({
  session,
  isExpanded,
}) => {
  return <Stack gap="md">{isExpanded && <Typography>TODO</Typography>}</Stack>;
};

export default ActiveTrainingSession;
