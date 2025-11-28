import { ClimbsPutRequest, ClimbsPutResponse } from '@shared/models/climb';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseClimbsPutParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

function useClimbsPut({ onError, onSuccess }: UseClimbsPutParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useMutation<
    ClimbsPutResponse['climb'],
    string,
    ClimbsPutRequest,
    unknown
  >({
    mutationFn: async (climb) => {
      console.log('Putting climb:', climb);
      const response = await axios.put(`${apiBaseUrl}/climbs`, climb, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: '',
        },
      });
      console.log('Climb put response:', response);

      if (!response.data.success) {
        throw new Error('Api error');
      }

      return response.data.data.climb;
    },
    onError: (message) => {
      console.error('Failed to put climb:', JSON.stringify(message));
      onError?.(message);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ['climbs'],
      });
      onSuccess?.();
    },
  });
}

export { useClimbsPut };
