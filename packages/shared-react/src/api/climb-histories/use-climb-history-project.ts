import { ApiResponse } from '@shared/models/api-response';
import {
  ClimbHistoryProjectRequest,
  ClimbHistoryProjectResponse,
} from '@shared/models/climb-history/climb-history-project';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

type UseClimbHistoryProjectParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

function useClimbHistoryProject({
  onError,
  onSuccess,
}: UseClimbHistoryProjectParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useMutation<
    ClimbHistoryProjectResponse['climbHistory'],
    string,
    ClimbHistoryProjectRequest,
    unknown
  >({
    mutationFn: mutation({
      refreshToken,
      logout,
      fn: async (data) => {
        const response = await axios.put<
          ApiResponse<ClimbHistoryProjectResponse>
        >(`${apiBaseUrl}/climb-histories/project`, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.climbHistory;
      },
    }),
    onError: (message) => {
      console.error('Failed to toggle project:', JSON.stringify(message));
      onError?.(message);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ['climb-histories'],
      });
      client.invalidateQueries({
        queryKey: ['climbs', 'search'],
      });
      onSuccess?.();
    },
  });
}

export { useClimbHistoryProject };
