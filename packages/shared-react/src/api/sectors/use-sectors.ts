import { ApiResponse } from '@shared/models/api-response';
import { SectorsGetResponse } from '@shared/models/sector';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseSectorsParams = {
  locationUuid: string;
  onUnauthorized?: () => void;
};

function useSectors({ locationUuid, onUnauthorized }: UseSectorsParams) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useQuery({
    queryKey: ['sectors', { locationUuid }],
    queryFn: query({
      defaultResponse: [],
      fn: async () => {
        const params = new URLSearchParams();
        params.append('locationUuid', locationUuid);

        const url = `${apiBaseUrl}/sectors?${params.toString()}`;
        const response = await axios.get<ApiResponse<SectorsGetResponse>>(url, {
          headers: {
            Authorization: '',
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.sectors;
      },
      onUnauthorized,
    }),
    enabled: !!locationUuid,
  });
}

export { useSectors };
