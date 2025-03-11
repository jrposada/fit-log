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
  data: Workout;
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
        <CardHeader title={data.name}></CardHeader>

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {data.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <WorkoutActions data={data} />
      </CardActions>
    </Card>
  );
};

export default WorkoutCard;
export type { WorkoutCardProps };
