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
  CardProps,
} from '@mui/material';
import { WorkoutsPutRequest } from '@shared/models/workout';
import { t } from 'i18next';
import { FunctionComponent } from 'react';
import { UseFieldArrayRemove, useFormContext } from 'react-hook-form';

const textFieldProps: TextFieldProps = {
  fullWidth: true,
  margin: 'normal',
};

type WorkoutExerciseFormProps = {
  index: number;
  remove: UseFieldArrayRemove;
  sx?: CardProps['sx'];
};
const WorkoutExerciseForm: FunctionComponent<WorkoutExerciseFormProps> = ({
  index,
  remove,
  sx,
}) => {
  const {
    formState: { errors },
    register,
    watch,
  } = useFormContext<WorkoutsPutRequest>();

  const name = watch(`exercises.${index}.name`);
  const intensityUnit = watch(`exercises.${index}.intensityUnit`);

  return (
    <Card sx={sx}>
      <CardHeader
        title={name || t('exercise.name')}
        action={
          <IconButton onClick={() => remove(index)}>
            <DeleteIcon />
          </IconButton>
        }
      />

      <CardContent>
        <TextField
          label={t('exercise.name')}
          {...register(`exercises.${index}.name` as const)}
          {...textFieldProps}
          error={!!errors.exercises?.[index]?.name}
          helperText={errors.exercises?.[index]?.name?.message}
        />

        <TextField
          label={t('exercise.description')}
          {...register(`exercises.${index}.description` as const)}
          {...textFieldProps}
          error={!!errors.exercises?.[index]?.description}
          helperText={errors.exercises?.[index]?.description?.message}
          multiline
          rows={3}
        />

        <TextField
          label={t('exercise.sets')}
          type="number"
          {...register(`exercises.${index}.sets` as const, {
            valueAsNumber: true,
          })}
          {...textFieldProps}
          error={!!errors.exercises?.[index]?.sets}
          helperText={errors.exercises?.[index]?.sets?.message}
        />

        <TextField
          label={t('exercise.rest-between-sets')}
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
          label={t('exercise.reps')}
          type="number"
          {...register(`exercises.${index}.reps` as const, {
            valueAsNumber: true,
          })}
          {...textFieldProps}
          error={!!errors.exercises?.[index]?.reps}
          helperText={errors.exercises?.[index]?.reps?.message}
        />

        <TextField
          label={t('exercise.rest-between-reps')}
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
          label={t('exercise.intensity-unit')}
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
          label={t('exercise.intensity')}
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
