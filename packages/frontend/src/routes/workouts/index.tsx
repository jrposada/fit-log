import { Container, Stack } from '@mui/material';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { FunctionComponent } from 'react';
import { useWorkouts } from '../../core/hooks/workouts/use-workouts';
import WorkoutCard from '../../features/workouts/workout-card';

const Index: FunctionComponent = () => {
  const { data: workouts } = useWorkouts();

  return (
    <Container>
      <Stack spacing={2}>
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} data={workout}></WorkoutCard>
        ))}
      </Stack>
    </Container>
  );
};

export const Route = createFileRoute('/workouts/')({
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
  component: Index,
});
