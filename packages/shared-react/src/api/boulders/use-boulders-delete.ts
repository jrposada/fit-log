import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseBouldersDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

type UseBouldersDeleteMutationParams = string;

export function useBouldersDelete({
  onError,
  onSuccess,
}: UseBouldersDeleteParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useMutation<void, string, UseBouldersDeleteMutationParams, unknown>({
    mutationFn: async (id) => {
      const response = await axios.delete(
        `${apiBaseUrl}/boulders/${encodeURIComponent(id)}`,
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
      onError?.(message);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ['boulders'],
      });
      onSuccess?.();
    },
  });
}
