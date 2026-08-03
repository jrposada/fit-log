import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import { TrainingSessionsGetByIdResponse } from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-get-by-id';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseTrainingSessionsById = {
  id: string | undefined;
};

function useTrainingSessionsById({ id }: UseTrainingSessionsById) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useQuery({
    queryKey: ['training-sessions', { id }],
    queryFn: query({
      refreshToken,
      logout,
      fn: async () => {
        const response = await axios.get<
          ApiResponse<TrainingSessionsGetByIdResponse>
        >(`${apiBaseUrl}/training-sessions/${encodeURIComponent(id!)}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.trainingSession;
      },
    }),
    enabled: !!id,
  });
}

export { useTrainingSessionsById };
