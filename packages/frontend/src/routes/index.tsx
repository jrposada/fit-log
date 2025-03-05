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
import { useWorkouts } from '../core/hooks/workouts/use-workouts';
import WorkoutCard from '../features/workouts/workout-card';
import WorkoutForm from '../features/workouts/workout-form';

const Index: FunctionComponent = () => {
  const { data: workouts } = useWorkouts();

  const createWorkout = () => {};

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

            {workouts?.map((workout) => (
              <WorkoutCard key={workout.id} data={workout}></WorkoutCard>
            ))}
          </Paper>
        </Grid>

        {/* Last sessions */}
        <Grid {...gridProps}>
          <Paper {...paperProps}>
            {/* TODO: sessions */}
            <Typography variant="h6">{t('dashboard.last-sessions')}</Typography>

            {workouts?.map((workout) => (
              <WorkoutCard key={workout.id} data={workout}></WorkoutCard>
            ))}
          </Paper>
        </Grid>
      </Grid>
      <WorkoutForm></WorkoutForm>
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
