import { ApiResponse } from '@shared/models/api-response';
import {
  SectorsGetByIdParams,
  SectorsGetByIdResponse,
} from '@shared/models/sector/sector-get-by-id';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

function useSectorsById({ id }: SectorsGetByIdParams) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { token, refreshToken, logout } = useAuth();

  return useQuery({
    queryKey: ['sectors', { id }],
    queryFn: query({
      refreshToken,
      logout,
      fn: async () => {
        const response = await axios.get<ApiResponse<SectorsGetByIdResponse>>(
          `${apiBaseUrl}/sectors/${encodeURIComponent(id)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.sector;
      },
    }),
    enabled: !!id,
  });
}

export { useSectorsById };
