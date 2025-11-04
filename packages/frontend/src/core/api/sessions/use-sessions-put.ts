import { SessionsPutRequest } from '@shared/models/session';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useToasts } from '../../../ui/toasts/use-toasts';

type UseSessionsPutParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

type UseSessionsPutMutationParams = SessionsPutRequest;

export function useSessionsPut({
  onError,
  onSuccess,
}: UseSessionsPutParams = {}) {
  const { push } = useToasts();
  const client = useQueryClient();

  return useMutation<void, string, UseSessionsPutMutationParams, unknown>({
    mutationFn: async (session) => {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/sessions`,
        JSON.stringify(session),
        {
          headers: {
            Authorization: '',
          },
        }
      );
    },
    onError: (message) => {
      push({
        message: 'Could not create or update session.',
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
