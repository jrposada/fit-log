import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useToasts } from '../../../ui/toasts/use-toasts';

type UseSessionsDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

type UseSessionsDeleteMutationParams = string;

export function useSessionsDelete({
  onError,
  onSuccess,
}: UseSessionsDeleteParams = {}) {
  const { push } = useToasts();
  const client = useQueryClient();

  return useMutation<void, string, UseSessionsDeleteMutationParams, unknown>({
    mutationFn: async (id) => {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/sessions/${encodeURIComponent(id)}`,
        {
          headers: {
            Authorization: '',
          },
        }
      );
    },
    onError: (message) => {
      push({
        message: 'Could not delete session.',
        variant: 'error',
      });
      onError?.(message);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ['sessions'],
      });
      onSuccess?.();
    },
  });
}
