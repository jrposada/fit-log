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
  data: Session;
};

const SessionCard: FunctionComponent<SessionCardProps> = ({ data }) => {
  const { push } = useModals();

  // FIXME: do we go to workout or session details?
  const goToDetails = () => {
    push({
      node: <SessionFormDialog session={data} />,
    });
  };

  return (
    <Card>
      <CardActionArea onClick={goToDetails}>
        <CardHeader title={data.workoutName} subheader={data.completedAt} />

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {data.workoutDescription}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SessionCard;
export type { SessionCardProps };
