import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
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

type WorkoutFormProps = {
  data?: Workout;
};
const WorkoutForm: FunctionComponent<WorkoutFormProps> = () => {
  const { mutate: sendWorkoutsPut } = useWorkoutsPut();
  const { pop } = useModals();

  const methods = useForm<WorkoutsPutRequest>({
    defaultValues: {
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
        open={true}
        component="form"
        onSubmit={handleSubmit(submit)}
        sx={{ m: 2 }}
      >
        <DialogTitle>{t('dashboard.create-workout')}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={close}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent>
          <TextField
            label="Workout Name"
            {...register('name')}
            {...textFieldProps}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Workout Description"
            {...register('description')}
            {...textFieldProps}
            error={!!errors.description}
            helperText={errors.description?.message}
            multiline
            rows={3}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Exercises
          </Typography>

          {fields.map((field, index) => (
            <WorkoutExerciseForm key={field.id} index={index} remove={remove} />
          ))}

          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={addExercise}>
              Add Exercise
            </Button>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={close}>{t('actions.cancel')}</Button>
          <Button variant="contained" type="submit" sx={{ ml: 2 }}>
            {t('actions.create')}
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

export default WorkoutForm;
export type { WorkoutFormProps };
