import { zodResolver } from '@hookform/resolvers/zod';
import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  TextFieldProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Workout,
  WorkoutsPutRequest,
  workoutsPutRequestSchema,
} from '@shared/models/workout';
import { t } from 'i18next';
import { FunctionComponent } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useModals } from '../../core/hooks/modals/use-modals';
import { useWorkoutsPut } from '../../core/hooks/workouts/use-workouts-put';
import WorkoutExerciseForm from './workout-exercise-form';

const defaultExercise: WorkoutsPutRequest['exercises'][number] = {
  description: '',
  intensity: 0,
  intensityUnit: 'weight',
  name: '',
  reps: 10,
  restBetweenReps: 3 * 60,
  restBetweenSets: 5 * 60,
  sets: 1,
  sort: 0,
};

const textFieldProps: TextFieldProps = {
  fullWidth: true,
  margin: 'normal',
};

type WorkoutFormDialogProps = {
  data?: Workout;
};
const WorkoutFormDialog: FunctionComponent<WorkoutFormDialogProps> = ({
  data,
}) => {
  const { mutate: sendWorkoutsPut } = useWorkoutsPut();
  const { pop } = useModals();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const methods = useForm<WorkoutsPutRequest>({
    defaultValues: data ?? {
      description: '',
      exercises: [],
      name: '',
    },
    resolver: zodResolver(workoutsPutRequestSchema),
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exercises',
  });

  const addExercise = () => {
    append(structuredClone(defaultExercise));
  };

  const submit = (data: WorkoutsPutRequest) => {
    sendWorkoutsPut(data);
    close();
  };

  const close = () => {
    pop();
  };

  return (
    <FormProvider {...methods}>
      <Dialog
        component="form"
        fullScreen={fullScreen}
        onSubmit={handleSubmit(submit)}
        open={true}
      >
        <DialogTitle>
          {data ? t('workout.update') : t('workout.create')}
        </DialogTitle>

        <IconButton
          onClick={close}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>

        <DialogContent>
          <TextField
            label={t('workout.name')}
            {...register('name')}
            {...textFieldProps}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label={t('workout.description')}
            {...register('description')}
            {...textFieldProps}
            error={!!errors.description}
            helperText={errors.description?.message}
            multiline
            rows={3}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            {t('workout.exercises')}
          </Typography>

          {fields.map((field, index) => (
            <WorkoutExerciseForm
              key={field.id}
              index={index}
              remove={remove}
              sx={{ mt: 2 }}
            />
          ))}

          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={addExercise}>
              {t('workout.add-exercise')}
            </Button>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={close}>{t('actions.cancel')}</Button>
          <Button variant="contained" type="submit" sx={{ ml: 2 }}>
            {data ? t('actions.update') : t('actions.create')}
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

export default WorkoutFormDialog;
export type { WorkoutFormDialogProps };
