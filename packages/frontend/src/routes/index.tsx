import {
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

  return (
    <Container>
      <Grid container spacing={2}>
        {/* Favorite workouts */}
        <Grid {...GRID_PROPS}>
          <Paper {...PAPER_PROPS}>
            <Typography variant="h6">
              {t('dashboard.favorite_workouts')}
            </Typography>

            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout}></WorkoutCard>
            ))}
          </Paper>
        </Grid>

        {/* Last sessions */}
        <Grid {...GRID_PROPS}>
          <Paper {...PAPER_PROPS}>
            <Typography variant="h6">{t('dashboard.last_sessions')}</Typography>

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
