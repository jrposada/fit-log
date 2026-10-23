import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import {
  BenchmarkResultsDeleteParams,
  BenchmarkResultsDeleteResponse,
} from '@jrposada/fit-log-shared/models/benchmark-results/benchmark-results-delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

type UseBenchmarkResultsDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

function useBenchmarkResultsDelete({
  onError,
  onSuccess,
}: UseBenchmarkResultsDeleteParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useMutation<
    BenchmarkResultsDeleteResponse,
    string,
    BenchmarkResultsDeleteParams,
    unknown
  >({
    mutationFn: mutation({
      refreshToken,
      logout,
      fn: async ({ id }) => {
        const response = await axios.delete<
          ApiResponse<BenchmarkResultsDeleteResponse>
        >(`${apiBaseUrl}/benchmark-results/${encodeURIComponent(id)}`, {
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
        queryKey: ['benchmark-results'],
      });
      onSuccess?.();
    },
  });
}

export { useBenchmarkResultsDelete };
