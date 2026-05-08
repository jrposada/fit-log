import { ApiResponse } from '@shared/models/api-response';
import { MeResponse } from '@shared/models/auth/me';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

function useMe() {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['me'],
    enabled: isAuthenticated,
    queryFn: query<MeResponse | undefined>({
      defaultResponse: undefined,
      refreshToken,
      logout,

      fn: async () => {
        const response = await axios.get<ApiResponse<MeResponse>>(
          `${apiBaseUrl}/me`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data;
      },
    }),
  });
}

export { useMe };
