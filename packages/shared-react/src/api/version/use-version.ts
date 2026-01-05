import { ApiResponse } from '@shared/models/api-response';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

export function useVersion() {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useQuery({
    queryKey: ['version'],
    queryFn: query({
      defaultResponse: '',
      fn: async () => {
        const response = await axios.get<ApiResponse<string>>(
          `${apiBaseUrl}/version`
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data;
      },
    }),
  });
}
