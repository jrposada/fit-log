import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useSnackbar from '../../../ui/snackbar/use-snackbar';

type UseFavoriteWorkoutsDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

type UseFavoriteWorkoutsDeleteMutationParams = string;

export function useFavoriteWorkoutsDelete({
  onError,
  onSuccess,
}: UseFavoriteWorkoutsDeleteParams = {}) {
  const { enqueueAutoHideSnackbar } = useSnackbar();
  const client = useQueryClient();

  return useMutation<
    void,
    string,
    UseFavoriteWorkoutsDeleteMutationParams,
    unknown
  >({
    mutationFn: async (id) => {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/favorite-workouts/${encodeURIComponent(id)}`,
        {
          headers: {
            Authorization: '',
          },
        }
      );
    },
    onError: (message) => {
      enqueueAutoHideSnackbar({
        message: 'Could not remove workout from favorites.',
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
