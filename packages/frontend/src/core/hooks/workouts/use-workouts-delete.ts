import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToasts } from '../../../ui/toasts/use-toasts';

type UseWorkoutsDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

type UseWorkoutsDeleteMutationParams = string;

export function useWorkoutsDelete({
  onError,
  onSuccess,
}: UseWorkoutsDeleteParams = {}) {
  const { push } = useToasts();
  const client = useQueryClient();

  return useMutation<void, string, UseWorkoutsDeleteMutationParams, unknown>({
    mutationFn: async (id) => {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/workouts/${encodeURIComponent(id)}`,
        {
          headers: {
            Authorization: '',
          },
        }
      );
    },
    onError: (message) => {
      push({
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
