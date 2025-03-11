import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { t } from 'i18next';
import { FunctionComponent } from 'react';
import { useWorkoutsById } from '../../core/hooks/workouts/use-workouts-by-id';
import WorkoutActions from '../../features/workouts/workout-actions';

const WorkoutDetails: FunctionComponent = () => {
  const { 'workout-id': workoutId } = Route.useParams();
  const { data: workout } = useWorkoutsById(workoutId);

  return (
    <Container>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4">{workout?.name}</Typography>

        <Box>{!!workout && <WorkoutActions data={workout} />}</Box>
      </Box>
      <Typography variant="body1">{workout?.description}</Typography>
      <Divider />
      {workout?.exercises.map((exercise, index) => (
        <Card key={index} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">{exercise.name}</Typography>
            <Typography variant="body2">{exercise.description}</Typography>
          </CardContent>
        </Card>
      ))}
      <Divider />
      <Typography variant="h4">{t('workout.session-history')}</Typography>
      TODO
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
