import { ApiResponse } from '@shared/models/api-response';
import {
  LocationsGetByIdParams,
  LocationsGetByIdResponse,
} from '@shared/models/location/location-get-by-id';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

function useLocationsById({ id }: LocationsGetByIdParams) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { token, refreshToken, logout } = useAuth();

  return useQuery({
    queryKey: ['locations', { id }],
    queryFn: query({
      refreshToken,
      logout,
      fn: async () => {
        const response = await axios.get<ApiResponse<LocationsGetByIdResponse>>(
          `${apiBaseUrl}/locations/${encodeURIComponent(id)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.location;
      },
    }),
    enabled: !!id,
  });
}

export { useLocationsById };
