import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useSnackbar from '../../../ui/snackbar/use-snackbar';

type UseWorkoutsDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

type UseWorkoutsDeleteMutationParams = string;

export function useWorkoutsDelete({
  onError,
  onSuccess,
}: UseWorkoutsDeleteParams = {}) {
  const { enqueueAutoHideSnackbar } = useSnackbar();
  const client = useQueryClient();

  return useMutation<void, string, UseWorkoutsDeleteMutationParams, unknown>({
    mutationFn: async (workoutId) => {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/workouts/${encodeURIComponent(workoutId)}`,
        {
          headers: {
            Authorization: '',
          },
        }
      );
    },
    onError: (message) => {
      enqueueAutoHideSnackbar({
        message: 'Could not delete workout.',
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
