import { FitnessCenter } from '@mui/icons-material';
import {
  Button,
  Container,
  Grid,
  GridProps,
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

// import React, { useEffect, useRef, useState } from 'react';
// import { Box } from '@mui/material';
// import useSnackbar from '../ui/snackbar/use-snackbar';

// const BorderProgressBox: FunctionComponent<any> = ({
//   progress = 0,
//   duration = 2,
//   children,
// }) => {
//   const boxRef = useRef<any>(null);
//   const [boxSize, setBoxSize] = useState({ width: 0, height: 0 });

//   useEffect(() => {
//     if (boxRef.current) {
//       const { width, height } = boxRef.current.getBoundingClientRect();
//       setBoxSize({ width, height });
//     }
//   }, []);

//   const { width, height } = boxSize;
//   const perimeter = 2 * (width + height);
//   const dashOffset = perimeter * (1 - progress);

//   return (
//     <Box
//       sx={{
//         position: 'relative',
//         display: 'inline-block',
//         padding: 2,
//         margin: 4,
//       }}
//     >
//       {/* Content Box */}
//       <Box
//         ref={boxRef}
//         sx={{
//           backgroundColor: 'white',
//           zIndex: 1,
//           position: 'relative',
//         }}
//       >
//         {children}
//       </Box>

//       {/* Animated Border */}
//       {width > 0 && height > 0 && (
//         <svg
//           width={width}
//           height={height}
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             zIndex: 2,
//             pointerEvents: 'none',
//           }}
//         >
//           <rect
//             x="0"
//             y="0"
//             width={width}
//             height={height}
//             fill="none"
//             stroke="#1976d2"
//             strokeWidth="2"
//             strokeDasharray={perimeter}
//             strokeDashoffset={dashOffset}
//             style={{
//               transition: `stroke-dashoffset ${duration}s ease`,
//             }}
//           />
//         </svg>
//       )}
//     </Box>
//   );
// };
