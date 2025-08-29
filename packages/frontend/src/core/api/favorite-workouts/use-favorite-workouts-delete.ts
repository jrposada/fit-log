import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToasts } from '../../../ui/toasts/use-toasts';

type UseFavoriteWorkoutsDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

type UseFavoriteWorkoutsDeleteMutationParams = string;

export function useFavoriteWorkoutsDelete({
  onError,
  onSuccess,
}: UseFavoriteWorkoutsDeleteParams = {}) {
  const { push } = useToasts();
  const client = useQueryClient();

  return useMutation<
    void,
    string,
    UseFavoriteWorkoutsDeleteMutationParams,
    unknown
  >({
    mutationFn: async (id) => {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/favorite-workouts/${encodeURIComponent(id)}`,
        {
          headers: {
            Authorization: '',
          },
        }
      );

      if (!response.data.success) {
        throw new Error('Api error');
      }
    },
    onError: (message) => {
      push({
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
