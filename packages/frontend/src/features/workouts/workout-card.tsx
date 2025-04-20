import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { Workout } from '@shared/models/workout';
import { useNavigate } from '@tanstack/react-router';
import { FunctionComponent } from 'react';
import WorkoutActions from './workout-actions';

type WorkoutCardProps = {
  workout: Workout;
};

const WorkoutCard: FunctionComponent<WorkoutCardProps> = ({ workout }) => {
  const navigate = useNavigate();

  const goToDetails = () => {
    navigate({
      to: '/workouts/$workout-id',
      params: {
        'workout-id': workout.id,
      },
    });
  };

  return (
    <Card>
      <CardActionArea onClick={goToDetails}>
        <CardHeader title={workout.name} />

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {workout.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <WorkoutActions workout={workout} />
      </CardActions>
    </Card>
  );
};

export default WorkoutCard;
export type { WorkoutCardProps };
