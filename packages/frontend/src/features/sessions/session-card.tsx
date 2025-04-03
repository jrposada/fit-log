import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { Session } from '@shared/models/session';
import { useNavigate } from '@tanstack/react-router';
import { FunctionComponent } from 'react';

type WorkoutCardProps = {
  data: Session;
};

const WorkoutCard: FunctionComponent<WorkoutCardProps> = ({ data }) => {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate({
      to: '/workouts/$workout-id',
      params: {
        'workout-id': data.id,
      },
    });
  };

  return (
    <Card>
      <CardActionArea onClick={goToDetails}>
        <CardHeader title={data.id} />

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {data.completedAt}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default WorkoutCard;
export type { WorkoutCardProps };
