import { ApiResponse } from '@shared/models/api-response';
import {
  ClimbHistoriesPutRequest,
  ClimbHistoriesPutResponse,
} from '@shared/models/climb-history/climb-history-put';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

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
  const { token, refreshToken, logout } = useAuth();

  return useMutation<
    ClimbHistoriesPutResponse['climbHistory'],
    string,
    ClimbHistoriesPutRequest,
    unknown
  >({
    mutationFn: mutation({
      refreshToken,
      logout,
      fn: async (climbHistory) => {
        const response = await axios.put<
          ApiResponse<ClimbHistoriesPutResponse>
        >(`${apiBaseUrl}/climb-histories`, climbHistory, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.climbHistory;
      },
    }),
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
