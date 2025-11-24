import { ApiResponse } from '@shared/models/api-response';
import { LocationsGetResponse } from '@shared/models/location';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseLocationsParams = {
  onUnauthorized?: () => void;
  limit?: number;
};

function useLocations({ onUnauthorized, limit }: UseLocationsParams = {}) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useQuery({
    queryKey: ['locations', { limit }],
    queryFn: query({
      defaultResponse: [],
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
              Authorization: '',
            },
          }
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.locations;
      },
      onUnauthorized,
    }),
  });
}

export { useLocations };
