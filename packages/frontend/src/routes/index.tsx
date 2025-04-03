import { Add } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Grid2 as Grid,
  Grid2Props as GridProps,
  Paper,
  PaperProps,
  Typography,
} from '@mui/material';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { t } from 'i18next';
import { FunctionComponent } from 'react';
import { useModals } from '../core/hooks/modals/use-modals';
import { useSessions } from '../core/hooks/sessions/use-sessions';
import { useWorkouts } from '../core/hooks/workouts/use-workouts';
import SessionCard from '../features/sessions/session-card';
import WorkoutCard from '../features/workouts/workout-card';
import WorkoutFormDialog from '../features/workouts/workout-form-dialog';

const Index: FunctionComponent = () => {
  const { data: workouts } = useWorkouts();
  const { data: sessions } = useSessions();
  const { push } = useModals();

  const createWorkout = () => {
    push({
      node: <WorkoutFormDialog />,
    });
  };

  const gridProps: GridProps = {
    size: { xs: 12, md: 6 },
  };
  const paperProps: PaperProps = {
    elevation: 2,
    sx: { p: 2, display: 'flex', flexDirection: 'column', gap: 2 },
  };

  return (
    <Container>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        my={2}
      >
        <Typography variant="h4">{t('dashboard.title')}</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={createWorkout}>
          {t('dashboard.create-workout')}
        </Button>
      </Box>

      <Grid container spacing={2}>
        {/* Favorite workouts */}
        <Grid {...gridProps}>
          <Paper {...paperProps}>
            <Typography variant="h6">
              {t('dashboard.favorite-workouts')}
            </Typography>

            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} data={workout}></WorkoutCard>
            ))}
          </Paper>
        </Grid>

        {/* Last sessions */}
        <Grid {...gridProps}>
          <Paper {...paperProps}>
            <Typography variant="h6">{t('dashboard.last-sessions')}</Typography>

            {sessions.map((workout) => (
              <SessionCard key={workout.id} data={workout}></SessionCard>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export const Route = createFileRoute('/')({
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
