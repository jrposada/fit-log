import { SectorsPutRequest } from '@shared/models/sector/sector-put';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseSectorsPutParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

type UseSectorsPutMutationParams = SectorsPutRequest;

function useSectorsPut({ onError, onSuccess }: UseSectorsPutParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useMutation<void, string, UseSectorsPutMutationParams, unknown>({
    mutationFn: async (sector) => {
      const response = await axios.put(`${apiBaseUrl}/sectors`, sector, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: '',
        },
      });

      if (!response.data.success) {
        throw new Error('Api error');
      }
    },
    onError: (message) => {
      console.error('Failed to put sector:', JSON.stringify(message));
      onError?.(message);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ['sectors'],
      });
      onSuccess?.();
    },
  });
}

export { useSectorsPut };
