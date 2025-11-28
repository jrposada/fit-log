import { ApiResponse } from '@shared/models/api-response';
import {
  SectorsGetByIdParams,
  SectorsGetByIdResponse,
} from '@shared/models/sector';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

function useSectorsById({ id }: SectorsGetByIdParams) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useQuery({
    queryKey: ['sectors', { id }],
    queryFn: query({
      fn: async () => {
        const response = await axios.get<ApiResponse<SectorsGetByIdResponse>>(
          `${apiBaseUrl}/sectors/${encodeURIComponent(id)}`,
          {
            headers: {
              Authorization: '',
            },
          }
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.sector;
      },
    }),
  });
}

export { useSectorsById };
