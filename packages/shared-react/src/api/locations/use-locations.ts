import { ApiResponse } from '@shared/models/api-response';
import {
  LocationsGetQuery,
  LocationsGetResponse,
} from '@shared/models/location/location-get';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

function useLocations({ limit }: LocationsGetQuery = {}) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useQuery({
    queryKey: ['locations', { limit }],
    queryFn: query({
      defaultResponse: [],
      refreshToken,
      logout,

      fn: async () => {
        const params = new URLSearchParams();
        if (limit) {
          params.append('limit', limit.toString());
        }

        const url = `${apiBaseUrl}/locations${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await axios.get<ApiResponse<LocationsGetResponse>>(
          url,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.locations;
      },
    }),
  });
}

export { useLocations };
