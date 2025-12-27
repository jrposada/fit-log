import { ApiResponse } from '@shared/models/api-response';
import { ClimbHistoriesGetByIdResponse } from '@shared/models/climb-history/climb-history-get-by-id';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseClimbHistoriesById = {
  id: string;
};

function useClimbHistoriesById({ id }: UseClimbHistoriesById) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useQuery({
    queryKey: ['climb-histories', { id }],
    queryFn: query({
      fn: async () => {
        const response = await axios.get<
          ApiResponse<ClimbHistoriesGetByIdResponse>
        >(`${apiBaseUrl}/climb-histories/${encodeURIComponent(id)}`, {
          headers: {
            Authorization: '',
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.climbHistory;
      },
    }),
    enabled: !!id,
  });
}

export { useClimbHistoriesById };
