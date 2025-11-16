import { ApiResponse } from '@shared/models/api-response';
import { BouldersGetByIdResponse } from '@shared/models/boulder';
// import { BouldersGetByIdResponse } from '@jrposada/fit-log-shared/models/boulder.js';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { query } from '../query';

type UseBouldersById = {
  apiBaseUrl: string;
  id: string;
  onUnauthorized?: () => void;
};

export function useBouldersByid({
  apiBaseUrl,
  id,
  onUnauthorized,
}: UseBouldersById) {
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
