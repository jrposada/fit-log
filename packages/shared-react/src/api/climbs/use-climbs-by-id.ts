import { ApiResponse } from '@shared/models/api-response';
import { ClimbsGetByIdResponse } from '@shared/models/climb';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseClimbsById = {
  id: string;
  onUnauthorized?: () => void;
};

function useClimbsById({ id, onUnauthorized }: UseClimbsById) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useQuery({
    queryKey: ['climbs', { id }],
    queryFn: query({
      fn: async () => {
        const response = await axios.get<ApiResponse<ClimbsGetByIdResponse>>(
          `${apiBaseUrl}/climbs/${encodeURIComponent(id)}`,
          {
            headers: {
              Authorization: '',
            },
          }
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.climb;
      },
      onUnauthorized,
    }),
  });
}

export { useClimbsById };
