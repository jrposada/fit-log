import { BouldersPutRequest } from '@shared/models/boulder';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseBouldersPutParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

type UseBouldersPutMutationParams = BouldersPutRequest;

export function useBouldersPut({ onError, onSuccess }: UseBouldersPutParams) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useMutation<void, string, UseBouldersPutMutationParams, unknown>({
    mutationFn: async (boulder) => {
      console.log('Putting boulder:', boulder);
      const response = await axios.put(`${apiBaseUrl}/boulders`, boulder, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: '',
        },
      });
      console.log('Boulder put response:', response);

      if (!response.data.success) {
        throw new Error('Api error');
      }
    },
    onError: (message) => {
      console.error('Failed to put boulder:', JSON.stringify(message));
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
