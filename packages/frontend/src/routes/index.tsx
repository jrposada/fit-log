import { Container, Typography } from '@mui/material';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { FunctionComponent } from 'react';
import { useWorkouts } from '../core/hooks/workouts/use-workouts';
import WorkoutForm from '../features/workouts/workout-form';

const Index: FunctionComponent = () => {
  const { data } = useWorkouts();

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {JSON.stringify(data ?? '[]')}

      <WorkoutForm />
    </Container>
  );
};

export const Route = createFileRoute('/')({
  beforeLoad: ({ context, location }) => {
    if (!context.session?.isAuthenticated) {
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
