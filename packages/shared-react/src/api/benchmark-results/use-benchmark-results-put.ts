import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import {
  BenchmarkResultsPutRequest,
  BenchmarkResultsPutResponse,
} from '@jrposada/fit-log-shared/models/benchmark-results/benchmark-results-put';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

type UseBenchmarkResultsPutParams = {
  onError?: (message: string) => void;
  onSuccess?: (
    benchmarkResult: BenchmarkResultsPutResponse['benchmarkResult']
  ) => void;
};

function useBenchmarkResultsPut({
  onError,
  onSuccess,
}: UseBenchmarkResultsPutParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useMutation<
    BenchmarkResultsPutResponse['benchmarkResult'],
    string,
    BenchmarkResultsPutRequest,
    unknown
  >({
    mutationFn: mutation({
      refreshToken,
      logout,
      fn: async (benchmarkResult) => {
        const response = await axios.put<
          ApiResponse<BenchmarkResultsPutResponse>
        >(`${apiBaseUrl}/benchmark-results`, benchmarkResult, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.benchmarkResult;
      },
    }),
    onError: (message) => {
      console.error('Failed to put benchmark result:', JSON.stringify(message));
      onError?.(message);
    },
    onSuccess: (benchmarkResult) => {
      client.invalidateQueries({ queryKey: ['benchmark-results'] });
      onSuccess?.(benchmarkResult);
    },
  });
}

export { useBenchmarkResultsPut };
