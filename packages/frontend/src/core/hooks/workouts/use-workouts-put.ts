import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useSnackbar from '../../../ui/snackbar/use-snackbar';
import { WorkoutsPutRequest } from '@shared/models/workout';

type UseWorkoutsPutParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

type UseWorkoutsPutMutationParams = WorkoutsPutRequest;

export function useWorkoutsPut({
  onError,
  onSuccess,
}: UseWorkoutsPutParams = {}) {
  const { enqueueAutoHideSnackbar } = useSnackbar();
  const client = useQueryClient();

  return useMutation<void, string, UseWorkoutsPutMutationParams, unknown>({
    mutationFn: async (workout) => {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/workouts`,
        JSON.stringify(workout),
        {
          headers: {
            Authorization: '',
          },
        }
      );
    },
    onError: (message) => {
      enqueueAutoHideSnackbar({
        message: 'Could not create or update workout.',
        variant: 'error',
      });
      onError?.(message);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ['workouts'],
      });
      onSuccess?.();
    },
  });
}
