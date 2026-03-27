import { ApiResponse } from '@shared/models/api-response';
import {
  ClimbHistoriesDeleteParams,
  ClimbHistoriesDeleteQuery,
  ClimbHistoriesDeleteResponse,
} from '@shared/models/climb-history/climb-history-delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

type UseClimbHistoriesDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

function useClimbHistoriesDelete({
  onError,
  onSuccess,
}: UseClimbHistoriesDeleteParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { token, refreshToken, logout } = useAuth();

  return useMutation<
    ClimbHistoriesDeleteResponse,
    string,
    ClimbHistoriesDeleteParams & ClimbHistoriesDeleteQuery,
    unknown
  >({
    mutationFn: mutation({
      refreshToken,
      logout,
      fn: async ({ id, tryId }) => {
        const params = new URLSearchParams();
        if (tryId) {
          params.append('tryId', tryId);
        }

        const url = `${apiBaseUrl}/climb-histories/${encodeURIComponent(id)}${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await axios.delete<
          ApiResponse<ClimbHistoriesDeleteResponse>
        >(url, {
          headers: {
            Authorization: `Bearer ${token}`,
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
        queryKey: ['climb-histories'],
      });
      client.invalidateQueries({
        queryKey: ['climbs-search'],
      });
      onSuccess?.();
    },
  });
}

export { useClimbHistoriesDelete };
