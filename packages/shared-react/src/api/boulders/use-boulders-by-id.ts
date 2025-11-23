import { ApiResponse } from '@shared/models/api-response';
import { BouldersGetByIdResponse } from '@shared/models/boulder';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseBouldersById = {
  id: string;
  onUnauthorized?: () => void;
};

export function useBouldersByid({ id, onUnauthorized }: UseBouldersById) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useQuery({
    queryKey: ['boulders', { id }],
    queryFn: query({
      fn: async () => {
        const response = await axios.get<ApiResponse<BouldersGetByIdResponse>>(
          `${apiBaseUrl}/boulders/${encodeURIComponent(id)}`,
          {
            headers: {
              Authorization: '',
            },
          }
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.boulder;
      },
      onUnauthorized,
    }),
  });
}
