import { ApiResponse } from '@shared/models/api-response';
import {
  ClimbHistoriesGetQuery,
  ClimbHistoriesGetResponse,
} from '@shared/models/climb-history/climb-history-get';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

function useClimbHistories({
  limit,
  climbId,
  locationId,
  sectorId,
  status,
  startDate,
  endDate,
}: ClimbHistoriesGetQuery = {}) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useQuery({
    queryKey: [
      'climb-histories',
      { limit, climbId, locationId, sectorId, status, startDate, endDate },
    ],
    queryFn: query({
      defaultResponse: [],
      fn: async () => {
        const params = new URLSearchParams();
        if (limit) {
          params.append('limit', limit.toString());
        }
        if (climbId) {
          params.append('climbId', climbId);
        }
        if (locationId) {
          params.append('locationId', locationId);
        }
        if (sectorId) {
          params.append('sectorId', sectorId);
        }
        if (status) {
          params.append('status', status);
        }
        if (startDate) {
          params.append('startDate', startDate);
        }
        if (endDate) {
          params.append('endDate', endDate);
        }

        const url = `${apiBaseUrl}/climb-histories${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await axios.get<
          ApiResponse<ClimbHistoriesGetResponse>
        >(url, {
          headers: {
            Authorization: '',
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.climbHistories;
      },
    }),
  });
}

export { useClimbHistories };
