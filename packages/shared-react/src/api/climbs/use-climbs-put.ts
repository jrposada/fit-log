import { ApiResponse } from '@shared/models/api-response';
import {
  ClimbsPutRequest,
  ClimbsPutResponse,
} from '@shared/models/climb/climb-put';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

type UseClimbsPutParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

function useClimbsPut({ onError, onSuccess }: UseClimbsPutParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { token, refreshToken, logout } = useAuth();

  return useMutation<
    ClimbsPutResponse['climb'],
    string,
    ClimbsPutRequest,
    unknown
  >({
    mutationFn: mutation({
      refreshToken,
      logout,
      fn: async (climb) => {
        const response = await axios.put<ApiResponse<ClimbsPutResponse>>(
          `${apiBaseUrl}/climbs`,
          climb,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.climb;
      },
    }),
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
