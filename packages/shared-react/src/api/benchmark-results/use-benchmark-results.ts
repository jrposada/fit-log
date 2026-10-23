import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import { BenchmarkResultsGetResponse } from '@jrposada/fit-log-shared/models/benchmark-results/benchmark-results-get';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseBenchmarkResultsParams = {
  enrollment: string | undefined;
};

function useBenchmarkResults({ enrollment }: UseBenchmarkResultsParams) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useQuery({
    queryKey: ['benchmark-results', { enrollment }],
    queryFn: query<BenchmarkResultsGetResponse['benchmarkResults']>({
      defaultResponse: [],
      refreshToken,
      logout,
      fn: async () => {
        const params = new URLSearchParams({ enrollment: enrollment! });
        const response = await axios.get<
          ApiResponse<BenchmarkResultsGetResponse>
        >(`${apiBaseUrl}/benchmark-results?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.benchmarkResults;
      },
    }),
    enabled: !!enrollment,
  });
}

export { useBenchmarkResults };
