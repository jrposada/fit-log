import { FavoriteWorkoutsPutRequest } from '@shared/models/favorite-workout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useToasts } from '../../../ui/toasts/use-toasts';

type UseFavoriteWorkoutsPutParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

type UseFavoriteWorkoutsPutMutationParams = FavoriteWorkoutsPutRequest;

export function useFavoriteWorkoutsPut({
  onError,
  onSuccess,
}: UseFavoriteWorkoutsPutParams = {}) {
  const { push } = useToasts();
  const client = useQueryClient();

  return useMutation<
    void,
    string,
    UseFavoriteWorkoutsPutMutationParams,
    unknown
  >({
    mutationFn: async (favorite) => {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/favorite-workouts`,
        JSON.stringify(favorite),
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
        message: 'Could not add workout to favorites.',
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
