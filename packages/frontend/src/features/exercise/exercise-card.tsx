import {
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Exercise } from '@shared/models/workout';
import { useTranslation } from 'react-i18next';
import { FunctionComponent } from 'react';
import { beautifyUnit } from '../../utils/beautify';

type ExerciseCardProps = {
  exercise: Exercise;
};

const ExerciseCard: FunctionComponent<ExerciseCardProps> = ({ exercise }) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">{exercise.name}</Typography>
        <Typography variant="body1">{exercise.description}</Typography>

        <Divider sx={(theme) => ({ marginBlock: theme.spacing(2) })} />

        <Grid container spacing={2}>
          <Grid size={2}>
            <Stack direction="row" spacing={1}>
              <Typography variant="body1" fontWeight="bold">
                {t('exercise.reps')}
              </Typography>
              <Typography variant="body1">{exercise.reps}</Typography>
            </Stack>
          </Grid>

          <Grid size={5}>
            <Stack direction="row" spacing={1}>
              <Typography variant="body1" fontWeight="bold">
                {t('exercise.rest_between_reps')}
              </Typography>
              <Typography variant="body1">
                {exercise.restBetweenSets}
              </Typography>
            </Stack>
          </Grid>

          <Grid size={4}>
            <Stack direction="row" spacing={1}>
              <Typography variant="body1" fontWeight="bold">
                {t('exercise.sets')}
              </Typography>
              <Typography variant="body1">{exercise.sets}</Typography>
            </Stack>
          </Grid>
          <Grid>
            <Stack direction="row" spacing={1}>
              <Typography variant="body1" fontWeight="bold">
                {t('exercise.rest_between_sets')}
              </Typography>
              <Typography variant="body1">
                {exercise.restBetweenSets}
              </Typography>
            </Stack>
          </Grid>

          <Grid>
            <Stack direction="row" spacing={1}>
              <Typography variant="body1" fontWeight="bold">
                {t('exercise.intensity')}
              </Typography>
              <Typography variant="body1">
                {exercise.intensity}
                {t(beautifyUnit(exercise.intensityUnit))}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
export type { ExerciseCardProps };
