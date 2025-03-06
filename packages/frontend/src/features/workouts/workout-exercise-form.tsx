import DeleteIcon from '@mui/icons-material/Delete';
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { WorkoutsPutRequest } from '@shared/models/workout';
import { t } from 'i18next';
import { FunctionComponent } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

const textFieldProps: TextFieldProps = {
  fullWidth: true,
  margin: 'normal',
};

type WorkoutExerciseFormProps = {
  index: number;
};
const WorkoutExerciseForm: FunctionComponent<WorkoutExerciseFormProps> = ({
  index,
}) => {
  const {
    control,
    formState: { errors },
    register,
    watch,
  } = useFormContext<WorkoutsPutRequest>();
  const { remove } = useFieldArray({
    control,
    name: 'exercises',
  });

  const intensityUnit = watch(`exercises.${index}.intensityUnit`);

  return (
    <Card>
      <CardHeader
        title="// TODO: name input"
        action={
          <IconButton onClick={() => remove(index)}>
            <DeleteIcon />
          </IconButton>
        }
      />

      <CardContent>
        <TextField
          label="Sets"
          type="number"
          {...register(`exercises.${index}.sets` as const, {
            valueAsNumber: true,
          })}
          {...textFieldProps}
          error={!!errors.exercises?.[index]?.sets}
          helperText={errors.exercises?.[index]?.sets?.message}
        />

        <TextField
          label="Rest Between Sets"
          type="number"
          {...register(`exercises.${index}.restBetweenSets` as const, {
            valueAsNumber: true,
          })}
          {...textFieldProps}
          error={!!errors.exercises?.[index]?.restBetweenSets}
          helperText={errors.exercises?.[index]?.restBetweenSets?.message}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  {t('units.seconds')}
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          label="Reps"
          type="number"
          {...register(`exercises.${index}.reps` as const, {
            valueAsNumber: true,
          })}
          {...textFieldProps}
          error={!!errors.exercises?.[index]?.reps}
          helperText={errors.exercises?.[index]?.reps?.message}
        />

        <TextField
          label="Rest Between Reps"
          type="number"
          {...register(`exercises.${index}.restBetweenReps` as const, {
            valueAsNumber: true,
          })}
          {...textFieldProps}
          error={!!errors.exercises?.[index]?.restBetweenReps}
          helperText={errors.exercises?.[index]?.restBetweenReps?.message}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  {t('units.seconds')}
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          select
          label="Intensity Unit"
          {...register(`exercises.${index}.intensityUnit` as const)}
          {...textFieldProps}
          error={!!errors.exercises?.[index]?.intensityUnit}
          helperText={errors.exercises?.[index]?.intensityUnit?.message}
          defaultValue={'weight'}
        >
          <MenuItem value="time">Time</MenuItem>
          <MenuItem value="weight">Weight</MenuItem>
          <MenuItem value="body-weight">Body Weight</MenuItem>
        </TextField>

        <TextField
          label="Intensity"
          type="number"
          {...register(`exercises.${index}.intensity` as const, {
            valueAsNumber: true,
          })}
          {...textFieldProps}
          error={!!errors.exercises?.[index]?.intensity}
          helperText={errors.exercises?.[index]?.intensity?.message}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  {intensityUnit === 'body-weight' && t('units.percentage')}
                  {intensityUnit === 'time' && t('units.seconds')}
                  {intensityUnit === 'weight' && t('units.kg')}
                </InputAdornment>
              ),
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default WorkoutExerciseForm;
