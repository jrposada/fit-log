import { Delete, Edit, Favorite, PlayArrow } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Workout } from '@shared/models/workout';
import { useNavigate } from '@tanstack/react-router';
import { FunctionComponent } from 'react';
import { useModals } from '../../core/hooks/modals/use-modals';
import { useWorkoutsDelete } from '../../core/hooks/workouts/use-workouts-delete';
import WorkoutFormDialog from './workout-form-dialog';

type WorkoutActionsProps = {
  data: Workout;
};

const WorkoutActions: FunctionComponent<WorkoutActionsProps> = ({ data }) => {
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

  const toggleFavorite = () => {
    // TODO: favorites
    console.log('TODO: Toggle favorite', data);
  };

  return (
    <>
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
    </>
  );
};

export default WorkoutActions;
export type { WorkoutActionsProps };
