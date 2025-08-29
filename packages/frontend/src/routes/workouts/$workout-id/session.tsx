import {
  NavigateBefore,
  NavigateNext,
  Pause,
  PlayArrow,
  SkipNext,
  SkipPrevious,
} from '@mui/icons-material';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { assert } from '@shared/utils/assert';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { FunctionComponent, useEffect, useState } from 'react';
import { useModals } from '../../../ui/modals/use-modals';
import { useWorkoutsById } from '../../../core/api/workouts/use-workouts-by-id';
import SessionFormDialog from '../../../features/sessions/session-form-dialog';

type State = {
  done: boolean;
  exerciseIndex: number;
  rep: number;
  set: number;
};
const WorkoutSession: FunctionComponent = () => {
  const { 'workout-id': workoutId } = Route.useParams();
  const { data: workout } = useWorkoutsById(workoutId);
  const { push } = useModals();
  const navigate = useNavigate();

  const [{ done, exerciseIndex, rep, set }, setState] = useState<State>({
    done: false,
    exerciseIndex: 0,
    rep: 0,
    set: 0,
  });
  const [running, setRunning] = useState(false);

  const _nextExercise = (state: State) => {
    const next = { ...state };
    next.exerciseIndex += 1;

    assert(workout);
    if (next.exerciseIndex >= workout.exercises.length) {
      next.exerciseIndex = workout?.exercises.length - 1;
      next.set = workout.exercises[next.exerciseIndex].sets;
      next.rep = workout.exercises[next.exerciseIndex].reps;
      // Since this method is called inside a setState we can not call push
      // modals directly.
      next.done = true;
      return next;
    }

    next.set = 0;
    next.rep = 0;
    return next;
  };

  const _nextRep = (prev: State): State => {
    const next = { ...prev };
    next.rep += 1;

    assert(workout?.exercises[next.exerciseIndex]);
    if (next.rep >= workout.exercises[next.exerciseIndex].reps) {
      return _nextSet(next);
    }

    return next;
  };

  const _nextSet = (prev: State): State => {
    const next = { ...prev };
    next.set += 1;

    assert(workout?.exercises[next.exerciseIndex]);
    if (next.set >= workout.exercises[next.exerciseIndex].sets) {
      return _nextExercise(next);
    }

    next.rep = 0;
    return next;
  };

  const _previousExercise = (prev: State): State => {
    const next = { ...prev };
    next.exerciseIndex -= 1;

    if (next.exerciseIndex < 0) {
      next.exerciseIndex = 0;
    }

    assert(workout?.exercises[next.exerciseIndex]);
    next.set = workout.exercises[next.exerciseIndex].sets - 1;
    next.rep = workout.exercises[next.exerciseIndex].reps - 1;
    return next;
  };

  const _previousRep = (prev: State): State => {
    const next = { ...prev };
    next.rep -= 1;

    if (next.rep < 0) {
      return _previousSet(next);
    }

    return next;
  };

  const _previousSet = (prev: State): State => {
    const next = { ...prev };
    next.set -= 1;

    if (next.set < 0) {
      return _previousExercise(next);
    }

    assert(workout?.exercises[next.exerciseIndex]);
    next.rep = workout.exercises[next.exerciseIndex].reps - 1;
    return next;
  };

  const nextRep = () => {
    setState((prev) => _nextRep(prev));
  };
  const nextSet = () => {
    setState((prev) => _nextSet(prev));
  };
  const previousRep = () => {
    setState((prev) => _previousRep(prev));
  };
  const previousSet = () => {
    setState((prev) => _previousSet(prev));
  };

  const toggle = () => {
    setRunning((prev) => !prev);
  };

  // Push session form dialog on done.
  useEffect(() => {
    if (!done) {
      return;
    }

    assert(workout, { msg: 'Expected workout to be defined.' });

    push({
      node: <SessionFormDialog workout={workout} />,
      onClose: () => {
        navigate({
          to: '/workouts/$workout-id',
          params: {
            'workout-id': workoutId,
          },
        });
      },
    });
  }, [done, navigate, push, workout, workoutId]);

  const currentExercise = workout?.exercises[exerciseIndex];

  return (
    <Container>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        my={2}
      >
        <Typography variant="h4">{workout?.name}</Typography>
      </Box>
      {currentExercise?.name}
      {currentExercise?.description}
      {/* // TODO: Remove */}
      <ul>
        <li>
          Index: {exerciseIndex} / {workout?.exercises.length}
        </li>
        <li>
          Reps: {rep} / {currentExercise?.reps}
        </li>
        <li>
          Sets: {set} / {currentExercise?.sets}
        </li>
      </ul>

      <Stack spacing={2} direction={'row'}>
        <Button
          onClick={previousSet}
          disabled={exerciseIndex <= 0 && set <= 0}
          color="primary"
        >
          <SkipPrevious />
        </Button>

        <Button
          onClick={previousRep}
          disabled={exerciseIndex <= 0 && set <= 0 && rep <= 0}
          color="primary"
        >
          <NavigateBefore />
        </Button>

        <Button onClick={toggle} color="primary">
          {running ? <Pause /> : <PlayArrow />}
        </Button>

        <Button
          onClick={nextRep}
          disabled={
            exerciseIndex >= (workout?.exercises.length ?? 0) - 1 &&
            set >= (currentExercise?.sets ?? 0) &&
            rep >= (currentExercise?.reps ?? 0)
          }
          color="primary"
        >
          <NavigateNext />
        </Button>

        <Button
          onClick={nextSet}
          disabled={
            exerciseIndex >= (workout?.exercises.length ?? 0) - 1 &&
            set >= (currentExercise?.sets ?? 0)
          }
          color="primary"
        >
          <SkipNext />
        </Button>
      </Stack>
    </Container>
  );
};

export const Route = createFileRoute('/workouts/$workout-id/session')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: WorkoutSession,
});
