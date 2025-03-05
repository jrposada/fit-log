import { zodResolver } from '@hookform/resolvers/zod';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  WorkoutsPutRequest,
  workoutsPutRequestSchema,
} from '@shared/models/workout';
import { FunctionComponent } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useWorkoutsPut } from '../../core/hooks/workouts/use-workouts-put';

const defaultExercise: WorkoutsPutRequest['exercises'][number] = {
  sets: 0,
  restBetweenSets: 0,
  reps: 0,
  restBetweenReps: 0,
  intensity: 0,
  intensityUnit: 'time',
};

type WorkoutFormProps = {};
const WorkoutForm: FunctionComponent = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<WorkoutsPutRequest>({
    defaultValues: {
      description: '',
      exercises: [],
      name: '',
    },
    resolver: zodResolver(workoutsPutRequestSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exercises',
  });

  const { mutate: workoutsPut } = useWorkoutsPut();

  const submit = (data: WorkoutsPutRequest) => {
    workoutsPut(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(submit)} sx={{ m: 2 }}>
      <TextField
        label="Workout Name"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Workout Description"
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
        fullWidth
        margin="normal"
        multiline
        rows={3}
        required
      />

      <Typography variant="h6" sx={{ mt: 2 }}>
        Exercises
      </Typography>

      {fields.map((field, index) => (
        <Box
          key={field.id}
          sx={{
            border: '1px solid #ccc',
            borderRadius: 2,
            p: 2,
            mt: 2,
            position: 'relative',
          }}
        >
          <TextField
            label="Sets"
            type="number"
            {...register(`exercises.${index}.sets` as const, {
              valueAsNumber: true,
            })}
            error={!!errors.exercises?.[index]?.sets}
            helperText={errors.exercises?.[index]?.sets?.message}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Rest Between Sets (seconds)"
            type="number"
            {...register(`exercises.${index}.restBetweenSets` as const, {
              valueAsNumber: true,
            })}
            error={!!errors.exercises?.[index]?.restBetweenSets}
            helperText={errors.exercises?.[index]?.restBetweenSets?.message}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Reps"
            type="number"
            {...register(`exercises.${index}.reps` as const, {
              valueAsNumber: true,
            })}
            error={!!errors.exercises?.[index]?.reps}
            helperText={errors.exercises?.[index]?.reps?.message}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Rest Between Reps (seconds)"
            type="number"
            {...register(`exercises.${index}.restBetweenReps` as const, {
              valueAsNumber: true,
            })}
            error={!!errors.exercises?.[index]?.restBetweenReps}
            helperText={errors.exercises?.[index]?.restBetweenReps?.message}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Intensity"
            type="number"
            {...register(`exercises.${index}.intensity` as const, {
              valueAsNumber: true,
            })}
            error={!!errors.exercises?.[index]?.intensity}
            helperText={errors.exercises?.[index]?.intensity?.message}
            fullWidth
            margin="normal"
          />

          <TextField
            select
            label="Intensity Unit"
            {...register(`exercises.${index}.intensityUnit` as const)}
            error={!!errors.exercises?.[index]?.intensityUnit}
            helperText={errors.exercises?.[index]?.intensityUnit?.message}
            fullWidth
            margin="normal"
          >
            <MenuItem value="time">Time</MenuItem>
            <MenuItem value="weight">Weight</MenuItem>
          </TextField>

          <IconButton
            onClick={() => remove(index)}
            disabled={fields.length === 1}
            aria-label="Remove exercise"
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={() => append(defaultExercise)}>
          Add Exercise
        </Button>
        <Button variant="contained" type="submit" sx={{ ml: 2 }}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default WorkoutForm;
export type { WorkoutFormProps };
