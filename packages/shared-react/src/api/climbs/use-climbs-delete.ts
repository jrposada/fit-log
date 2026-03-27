import { ApiResponse } from '@shared/models/api-response';
import {
  ClimbsDeleteParams,
  ClimbsDeleteResponse,
} from '@shared/models/climb/climb-delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

type UseClimbsDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

function useClimbsDelete({ onError, onSuccess }: UseClimbsDeleteParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useMutation<ClimbsDeleteResponse, string, ClimbsDeleteParams, unknown>(
    {
      mutationFn: mutation({
        refreshToken,
        logout,
        fn: async ({ id }) => {
          const response = await axios.delete<
            ApiResponse<ClimbsDeleteResponse>
          >(`${apiBaseUrl}/climbs/${encodeURIComponent(id)}`, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          });

          if (!response.data.success) {
            throw new Error('Api error');
          }

          return response.data.data;
        },
      }),
      onError: (message) => {
        onError?.(message);
      },
      onSuccess: () => {
        client.invalidateQueries({
          queryKey: ['climbs'],
        });
        onSuccess?.();
      },
    }
  );
}

export { useClimbsDelete };
