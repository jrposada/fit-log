import { ApiResponse } from '@shared/models/api-response';
import { ClimbsGetResponse } from '@shared/models/climb';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseClimbsParams = {
  onUnauthorized?: () => void;
};

function useClimbs({ onUnauthorized }: UseClimbsParams = {}) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useQuery({
    queryKey: ['climbs'],
    queryFn: query({
      defaultResponse: [],
      fn: async () => {
        const response = await axios.get<ApiResponse<ClimbsGetResponse>>(
          `${apiBaseUrl}/climbs`,
          {
            headers: {
              Authorization: '',
            },
          }
        );

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
