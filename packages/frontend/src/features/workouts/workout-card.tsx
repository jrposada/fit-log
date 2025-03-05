import { Add, Delete, Edit, Favorite } from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from '@mui/material';
import { Workout } from '@shared/models/workout';
import { FunctionComponent } from 'react';
import { useWorkoutsDelete } from '../../core/hooks/workouts/use-workouts-delete';

type WorkoutCardProps = {
  data: Workout;
};

const WorkoutCard: FunctionComponent<WorkoutCardProps> = ({ data }) => {
  const { mutate: sendWorkoutsDelete } = useWorkoutsDelete();

  const addSession = () => {
    console.log('Add session', data);
  };
  const editWorkout = () => {
    console.log('Edit workout', data);
  };

  const deleteWorkout = () => {
    sendWorkoutsDelete(data.id);
  };

  const toggleFavorite = () => {
    console.log('Toggle favorite', data);
  };

  return (
    <Card>
      <CardHeader
        title={data.name}
        action={
          <>
            <IconButton onClick={editWorkout}>
              <Edit />
            </IconButton>

            <IconButton onClick={deleteWorkout}>
              <Delete />
            </IconButton>

            <IconButton
              onClick={toggleFavorite}
              // color={data.isFavorite ? 'primary' : 'default'}
            >
              <Favorite />
            </IconButton>

            <IconButton onClick={addSession} color="primary">
              <Add />
            </IconButton>
          </>
        }
      ></CardHeader>

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {data.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;
export type { WorkoutCardProps };
