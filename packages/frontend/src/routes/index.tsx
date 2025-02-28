import { createFileRoute, redirect } from '@tanstack/react-router';
import { Container, Typography } from '@mui/material';
import { FunctionComponent } from 'react';
import { useWorkouts } from '../core/hooks/workouts/use-workouts';

const Index: FunctionComponent = () => {
  const { data } = useWorkouts();

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {JSON.stringify(data ?? '[]')}
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
