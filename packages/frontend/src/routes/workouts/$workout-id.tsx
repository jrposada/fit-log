import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { FunctionComponent } from 'react';
import { useWorkoutsById } from '../../core/hooks/workouts/use-workouts-by-id';

const WorkoutDetails: FunctionComponent = () => {
  const { 'workout-id': workoutId } = Route.useParams();
  const { data: workout } = useWorkoutsById(workoutId);
  const navigate = useNavigate();

  const startSession = () => {
    if (!workout) {
      return;
    }

    navigate({
      to: '/workouts/$workout-id/session',
      params: {
        'workout-id': workout.id,
      },
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {workout?.name}
      </Typography>

      <Typography variant="body1" gutterBottom>
        {workout?.description}
      </Typography>

      {workout?.exercises.map((exercise, index) => (
        <Card key={index} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">{exercise.name}</Typography>
            <Typography variant="body2">{exercise.description}</Typography>
          </CardContent>
        </Card>
      ))}

      <Button variant="contained" fullWidth onClick={startSession}>
        Start Training Session
      </Button>
    </Container>
  );
};

export const Route = createFileRoute('/workouts/$workout-id')({
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
  component: WorkoutDetails,
});
