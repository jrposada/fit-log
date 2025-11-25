import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseLocationsDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

type UseLocationsDeleteMutationParams = string;

function useLocationsDelete({
  onError,
  onSuccess,
}: UseLocationsDeleteParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useMutation<void, string, UseLocationsDeleteMutationParams, unknown>({
    mutationFn: async (id) => {
      const response = await axios.delete(
        `${apiBaseUrl}/locations/${encodeURIComponent(id)}`,
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
        queryKey: ['locations'],
      });
      onSuccess?.();
    },
  });
}

export { useLocationsDelete };
