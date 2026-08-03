import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import { ClimbingSessionsGetByIdResponse } from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-get-by-id';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseClimbingSessionsById = {
  id: string | undefined;
};

function useClimbingSessionsById({ id }: UseClimbingSessionsById) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useQuery({
    queryKey: ['climbing-sessions', { id }],
    queryFn: query({
      refreshToken,
      logout,
      fn: async () => {
        const response = await axios.get<
          ApiResponse<ClimbingSessionsGetByIdResponse>
        >(`${apiBaseUrl}/climbing-sessions/${encodeURIComponent(id!)}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.climbingSession;
      },
    }),
    enabled: !!id,
  });
}

export { useClimbingSessionsById };
