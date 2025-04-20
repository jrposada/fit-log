import { FitnessCenter } from '@mui/icons-material';
import {
  Button,
  Container,
  Grid2 as Grid,
  Grid2Props as GridProps,
  Paper,
  PaperProps,
  Stack,
  Typography,
} from '@mui/material';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { t } from 'i18next';
import { FunctionComponent } from 'react';
import { useSessions } from '../core/hooks/sessions/use-sessions';
import { useWorkouts } from '../core/hooks/workouts/use-workouts';
import SessionCard from '../features/sessions/session-card';
import WorkoutCard from '../features/workouts/workout-card';

const GRID_PROPS: GridProps = {
  size: { xs: 12, md: 6 },
};
const PAPER_PROPS: PaperProps = {
  elevation: 2,
  sx: { p: 2, display: 'flex', flexDirection: 'column', gap: 2 },
};

const Index: FunctionComponent = () => {
  const { data: workouts } = useWorkouts({ onlyFavorites: true });
  const { data: sessions } = useSessions();
  const navigate = useNavigate();

  const goToWorkouts = () => {
    navigate({
      to: '/workouts',
    });
  };

  return (
    <Container>
      <Grid container spacing={2}>
        {/* Favorite workouts */}
        <Grid {...GRID_PROPS}>
          <Paper {...PAPER_PROPS}>
            <Typography variant="h6">
              {t('dashboard.favorite_workouts')}
            </Typography>

            {!workouts.length && (
              <Stack m={1} spacing={2} alignItems="center">
                <FitnessCenter
                  htmlColor="textSecondary"
                  sx={{ fontSize: '6rem', color: 'text.secondary' }}
                />
                <Typography variant="h4" color="textSecondary">
                  {t('workout.empty_favorites_warning')}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {t('workout.create_suggestion')}
                </Typography>
                <Button onClick={goToWorkouts}>{t('actions.create')}</Button>
              </Stack>
            )}

            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout}></WorkoutCard>
            ))}
          </Paper>
        </Grid>

        {/* Last sessions */}
        <Grid {...GRID_PROPS}>
          <Paper {...PAPER_PROPS}>
            <Typography variant="h6">{t('dashboard.last_sessions')}</Typography>

            {!sessions.length && (
              <Stack m={1} spacing={2} alignItems="center">
                <FitnessCenter
                  htmlColor="textSecondary"
                  sx={{ fontSize: '6rem', color: 'text.secondary' }}
                />
                <Typography variant="h4" color="textSecondary">
                  {t('workout.empty_sessions_warning')}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {t('workout.create_suggestion')}
                </Typography>
                <Button onClick={goToWorkouts}>{t('actions.start')}</Button>
              </Stack>
            )}

            {sessions.map((session) => (
              <SessionCard key={session.id} session={session}></SessionCard>
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
