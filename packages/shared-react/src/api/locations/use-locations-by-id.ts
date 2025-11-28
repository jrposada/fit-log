import { ApiResponse } from '@shared/models/api-response';
import {
  LocationsGetByIdParams,
  LocationsGetByIdResponse,
} from '@shared/models/location';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

function useLocationsById({ id }: LocationsGetByIdParams) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useQuery({
    queryKey: ['locations', { id }],
    queryFn: query({
      fn: async () => {
        const response = await axios.get<ApiResponse<LocationsGetByIdResponse>>(
          `${apiBaseUrl}/locations/${encodeURIComponent(id)}`,
          {
            headers: {
              Authorization: '',
            },
          }
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.location;
      },
    }),
  });
}

export { useLocationsById };
