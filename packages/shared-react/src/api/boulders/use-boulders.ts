import { ApiResponse } from '@shared/models/api-response';
import { BouldersGetResponse } from '@shared/models/boulder';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { query } from '../query';

type UseBouldersParams = {
  apiBaseUrl: string;
  onUnauthorized?: () => void;
};

export function useBoulders({ apiBaseUrl, onUnauthorized }: UseBouldersParams) {
  return useQuery({
    queryKey: ['boulders'],
    queryFn: query({
      defaultResponse: [],
      fn: async () => {
        const response = await axios.get<ApiResponse<BouldersGetResponse>>(
          `${apiBaseUrl}/boulders`,
          {
            headers: {
              Authorization: '',
            },
          }
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.boulders;
      },
      onUnauthorized,
    }),
  });
}
