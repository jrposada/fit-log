import { Delete, Edit, Favorite, PlayArrow } from '@mui/icons-material';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from '@mui/material';
import { Workout } from '@shared/models/workout';
import { FunctionComponent } from 'react';
import { useWorkoutsDelete } from '../../core/hooks/workouts/use-workouts-delete';
import { useNavigate } from '@tanstack/react-router';
import { useModals } from '../../core/hooks/modals/use-modals';
import WorkoutFormDialog from './workout-form-dialog';

type WorkoutCardProps = {
  data: Workout;
};

const WorkoutCard: FunctionComponent<WorkoutCardProps> = ({ data }) => {
  const { mutate: sendWorkoutsDelete } = useWorkoutsDelete();
  const navigate = useNavigate();
  const { push } = useModals();

  const startSession = () => {
    navigate({
      to: '/workouts/$workout-id/session',
      params: {
        'workout-id': data.id,
      },
    });
  };

  const editWorkout = () => {
    push({ node: <WorkoutFormDialog data={data} /> });
  };

  const deleteWorkout = () => {
    sendWorkoutsDelete(data.id);
  };

  const goToDetails = () => {
    navigate({
      to: '/workouts/$workout-id',
      params: {
        'workout-id': data.id,
      },
    });
  };

  const toggleFavorite = () => {
    // TODO: favorites
    console.log('TODO: Toggle favorite', data);
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
        <IconButton onClick={startSession} color="primary">
          <PlayArrow />
        </IconButton>

        <IconButton
          onClick={toggleFavorite}
          // color={data.isFavorite ? 'primary' : 'default'}
        >
          <Favorite />
        </IconButton>

        <IconButton onClick={editWorkout}>
          <Edit />
        </IconButton>

        <IconButton onClick={deleteWorkout} color="error">
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default WorkoutCard;
export type { WorkoutCardProps };
