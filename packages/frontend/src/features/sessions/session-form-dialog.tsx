import { zodResolver } from '@hookform/resolvers/zod';
import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { PickerValidDate } from '@mui/x-date-pickers';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import {
  Session,
  SessionsPutRequest,
  sessionsPutRequestSchema,
} from '@shared/models/session';
import { Workout } from '@shared/models/workout';
import { t } from 'i18next';
import moment from 'moment';
import { FunctionComponent, useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useModals } from '../../core/hooks/modals/use-modals';
import { useSessionsPut } from '../../core/hooks/sessions/use-sessions-put';
import { assert } from '@shared/utils/assert';

type SessionFormDialogProps = {
  session?: Session;
  workout?: Workout;
};

const SessionFormDialog: FunctionComponent<SessionFormDialogProps> = ({
  session,
  workout,
}) => {
  assert(session || workout, { msg: 'Session or workout must be defined.' });

  const { mutate: sendSessionsPut } = useSessionsPut();
  const { pop } = useModals();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const methods = useForm<SessionsPutRequest>({
    defaultValues: session ?? {
      completedAt: new Date().toISOString(),
      workoutDescription: workout?.description,
      workoutId: workout?.id,
      workoutName: workout?.name,
    },
    resolver: zodResolver(sessionsPutRequestSchema),
  });
  const { handleSubmit, register, watch, setValue } = methods;
  const submit = (data: SessionsPutRequest) => {
    sendSessionsPut(data);

    close();
  };

  const close = () => {
    pop();
  };

  const completedAtRegister = register('completedAt');

  const _completedAtValue = watch('completedAt');
  const completedAtValue = useMemo(
    () => moment(_completedAtValue),
    [_completedAtValue]
  );

  const completedAtOnChange = useCallback<
    NonNullable<DatePickerProps<PickerValidDate, false>['onChange']>
  >(
    (value) => {
      // FIXME: review dates timezone and time picker hour.
      setValue('completedAt', value?.toISOString() ?? '', {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  return (
    <FormProvider {...methods}>
      <Dialog
        component="form"
        fullScreen={fullScreen}
        onSubmit={handleSubmit(submit)}
        open={true}
      >
        <DialogTitle>
          {session ? t('session.update') : t('session.create')}
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

        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <DialogContentText>
            {session?.workoutName ?? workout?.name}
          </DialogContentText>

          <DatePicker
            label={t('session.completed-at')}
            {...completedAtRegister}
            value={completedAtValue}
            onChange={completedAtOnChange}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={close}>{t('actions.cancel')}</Button>
          <Button variant="contained" type="submit" sx={{ ml: 2 }}>
            {session ? t('actions.update') : t('actions.add')}
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

export default SessionFormDialog;
export type { SessionFormDialogProps };
