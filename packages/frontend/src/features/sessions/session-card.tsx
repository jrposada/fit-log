import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { Session } from '@shared/models/session';
import { FunctionComponent } from 'react';
import { useModals } from '../../core/hooks/modals/use-modals';
import SessionFormDialog from './session-form-dialog';

type SessionCardProps = {
  session: Session;
};

const SessionCard: FunctionComponent<SessionCardProps> = ({ session }) => {
  const { push } = useModals();

  // FIXME: do we go to workout or session details?
  const goToDetails = () => {
    push({
      node: <SessionFormDialog session={session} />,
    });
  };

  return (
    <Card>
      <CardActionArea onClick={goToDetails}>
        <CardHeader
          title={session.workoutName}
          subheader={session.completedAt}
        />

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {session.workoutDescription}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SessionCard;
export type { SessionCardProps };
