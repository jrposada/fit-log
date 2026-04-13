import { ApiResponse } from '@shared/models/api-response';
import { ClimbsGetByIdResponse } from '@shared/models/climb/climb-get-by-id';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseClimbsById = {
  id: string | undefined;
};

function useClimbsById({ id }: UseClimbsById) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useQuery({
    queryKey: ['climbs', { id }],
    queryFn: query({
      refreshToken,
      logout,
      fn: async () => {
        const response = await axios.get<ApiResponse<ClimbsGetByIdResponse>>(
          `${apiBaseUrl}/climbs/${encodeURIComponent(id!)}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.climb;
      },
    }),
    enabled: !!id,
  });
}

export { useClimbsById };
