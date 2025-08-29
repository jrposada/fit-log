import { WorkoutsPutRequest } from '@shared/models/workout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToasts } from '../../../ui/toasts/use-toasts';

type UseWorkoutsPutParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

type UseWorkoutsPutMutationParams = WorkoutsPutRequest;

export function useWorkoutsPut({
  onError,
  onSuccess,
}: UseWorkoutsPutParams = {}) {
  const { push } = useToasts();
  const client = useQueryClient();

  return useMutation<void, string, UseWorkoutsPutMutationParams, unknown>({
    mutationFn: async (workout) => {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/workouts`,
        JSON.stringify(workout),
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
