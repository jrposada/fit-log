import {
  ClimbHistoriesPutRequest,
  ClimbHistoriesPutResponse,
} from '@shared/models/climb-history';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseClimbHistoriesPutParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

function useClimbHistoriesPut({
  onError,
  onSuccess,
}: UseClimbHistoriesPutParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useMutation<
    ClimbHistoriesPutResponse['climbHistory'],
    string,
    ClimbHistoriesPutRequest,
    unknown
  >({
    mutationFn: async (climbHistory) => {
      const response = await axios.put(
        `${apiBaseUrl}/climb-histories`,
        climbHistory,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: '',
          },
        }
      );

      if (!response.data.success) {
        throw new Error('Api error');
      }

      return response.data.data.climbHistory;
    },
    onError: (message) => {
      console.error('Failed to put climb history:', JSON.stringify(message));
      onError?.(message);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ['climb-histories'],
      });
      onSuccess?.();
    },
  });
}

export { useClimbHistoriesPut };
