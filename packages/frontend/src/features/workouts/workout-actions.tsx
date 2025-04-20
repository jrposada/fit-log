import { Delete, Edit, Favorite, PlayArrow } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Workout } from '@shared/models/workout';
import { useNavigate } from '@tanstack/react-router';
import { FunctionComponent } from 'react';
import { useModals } from '../../core/hooks/modals/use-modals';
import { useWorkoutsDelete } from '../../core/hooks/workouts/use-workouts-delete';
import WorkoutFormDialog from './workout-form-dialog';
import { useFavoriteWorkoutsPut } from '../../core/hooks/favorite-workouts/use-favorite-workouts-put';
import { useFavoriteWorkoutsDelete } from '../../core/hooks/favorite-workouts/use-favorite-workouts-delete';

type WorkoutActionsProps = {
  workout: Workout;
};

const WorkoutActions: FunctionComponent<WorkoutActionsProps> = ({
  workout,
}) => {
  const { mutate: sendFavoriteWorkoutsDelete } = useFavoriteWorkoutsDelete();
  const { mutate: sendFavoriteWorkoutsPut } = useFavoriteWorkoutsPut();
  const { mutate: sendWorkoutsDelete } = useWorkoutsDelete();
  const { push } = useModals();
  const navigate = useNavigate();

  const startSession = () => {
    navigate({
      to: '/workouts/$workout-id/session',
      params: {
        'workout-id': workout.id,
      },
    });
  };

  const editWorkout = () => {
    push({ node: <WorkoutFormDialog workout={workout} /> });
  };

  const deleteWorkout = () => {
    sendWorkoutsDelete(workout.id);
  };

  const toggleFavorite = () => {
    if (workout.isFavorite) {
      sendFavoriteWorkoutsDelete(workout.id);
    } else {
      sendFavoriteWorkoutsPut({ workoutId: workout.id });
    }
  };

  return (
    <>
      <IconButton onClick={startSession} color="primary">
        <PlayArrow />
      </IconButton>

      <IconButton
        onClick={toggleFavorite}
        color={workout.isFavorite ? 'primary' : 'default'}
      >
        <Favorite />
      </IconButton>

      <IconButton onClick={editWorkout}>
        <Edit />
      </IconButton>

      <IconButton onClick={deleteWorkout} color="error">
        <Delete />
      </IconButton>
    </>
  );
};

export default WorkoutActions;
export type { WorkoutActionsProps };
