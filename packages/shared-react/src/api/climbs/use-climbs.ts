import { ApiResponse } from '@shared/models/api-response';
import { ClimbsGetResponse } from '@shared/models/climb';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseClimbsParams = {
  onUnauthorized?: () => void;
  limit?: number;
};

function useClimbs({ onUnauthorized, limit }: UseClimbsParams = {}) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useQuery({
    queryKey: ['climbs', { limit }],
    queryFn: query({
      defaultResponse: [],
      fn: async () => {
        const params = new URLSearchParams();
        if (limit) {
          params.append('limit', limit.toString());
        }

        const url = `${apiBaseUrl}/climbs${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await axios.get<ApiResponse<ClimbsGetResponse>>(url, {
          headers: {
            Authorization: '',
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.climbs;
      },
      onUnauthorized,
    }),
  });
}

export { useClimbs };
