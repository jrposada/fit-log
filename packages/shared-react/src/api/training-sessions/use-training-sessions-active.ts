import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import { TrainingSessionsGetResponse } from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-get';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

function useTrainingSessionsActive() {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useQuery<
    TrainingSessionsGetResponse['trainingSessions'][number] | undefined,
    Error
  >({
    queryKey: ['training-sessions', { active: true }],
    queryFn: query({
      refreshToken,
      logout,
      fn: async () => {
        const params = new URLSearchParams();
        params.append('active', 'true');

        const url = `${apiBaseUrl}/training-sessions?${params.toString()}`;
        const response = await axios.get<
          ApiResponse<TrainingSessionsGetResponse>
        >(url, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.trainingSessions[0];
      },
    }),
  });
}

export { useTrainingSessionsActive };
