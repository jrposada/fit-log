import { ApiResponse } from '@shared/models/api-response';
import {
  ClimbsSearchQuery,
  ClimbsSearchResponse,
} from '@shared/models/climb/climb-search';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

function useClimbsSearch({
  grade,
  limit,
  locationId,
  search,
}: ClimbsSearchQuery = {}) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { token, refreshToken, logout } = useAuth();

  return useQuery({
    queryKey: ['climbs', 'search', { grade, limit, locationId, search }],
    queryFn: query({
      defaultResponse: [],
      refreshToken,
      logout,

      fn: async () => {
        const params = new URLSearchParams();

        grade?.forEach((g) => params.append('grade', g));
        if (limit) {
          params.append('limit', limit.toString());
        }
        if (locationId) {
          params.append('locationId', locationId);
        }
        if (search) {
          params.append('search', search);
        }

        const url = `${apiBaseUrl}/climbs/search${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await axios.get<ApiResponse<ClimbsSearchResponse>>(
          url,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.climbs;
      },
    }),
  });
}

export { useClimbsSearch };
