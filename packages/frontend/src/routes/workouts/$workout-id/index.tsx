import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  GridProps,
  Paper,
  PaperProps,
  Typography,
} from '@mui/material';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { t } from 'i18next';
import { FunctionComponent } from 'react';
import { useSessions } from '../../../core/api/sessions/use-sessions';
import { useWorkoutsById } from '../../../core/api/workouts/use-workouts-by-id';
import SessionCard from '../../../features/sessions/session-card';
import WorkoutActions from '../../../features/workouts/workout-actions';

const GRID_PROPS: GridProps = {
  size: { xs: 12, md: 6 },
};
const PAPER_PROPS: PaperProps = {
  elevation: 2,
  sx: { p: 2, display: 'flex', flexDirection: 'column', gap: 2 },
};

const WorkoutDetails: FunctionComponent = () => {
  const { 'workout-id': workoutId } = Route.useParams();
  const { data: workout, status, error } = useWorkoutsById(workoutId);
  const { data: sessions } = useSessions({ workoutId });

  console.log('status', { status, workout, error });

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

        <Box>{!!workout && <WorkoutActions workout={workout} />}</Box>
      </Box>
      <Typography variant="body1">{workout?.description}</Typography>

      <Grid container spacing={2}>
        {/* Workout exercises */}
        <Grid {...GRID_PROPS}>
          <Paper {...PAPER_PROPS}>
            {workout?.exercises.map((exercise, index) => (
              <Card key={index} sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6">{exercise.name}</Typography>
                  <Typography variant="body2">
                    {exercise.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        {/* Workout sessions */}
        <Grid {...GRID_PROPS}>
          <Paper {...PAPER_PROPS}>
            <Typography variant="h4">{t('workout.session_history')}</Typography>

            {sessions.map((workout) => (
              <SessionCard key={workout.id} session={workout}></SessionCard>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export const Route = createFileRoute('/workouts/$workout-id/')({
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
  component: WorkoutDetails,
});
