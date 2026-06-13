import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import {
  ClimbHistoriesStatsQuery,
  ClimbHistoriesStatsResponse,
} from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-stats';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseClimbHistoriesStatsParams = ClimbHistoriesStatsQuery;

function useClimbHistoriesStats({
  locationId,
  sectorId,
  startDate,
  endDate,
  granularity,
}: UseClimbHistoriesStatsParams = {}) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useQuery({
    queryKey: [
      'climb-histories-stats',
      { locationId, sectorId, startDate, endDate, granularity },
    ],
    queryFn: query<ClimbHistoriesStatsResponse>({
      refreshToken,
      logout,
      fn: async () => {
        const params = new URLSearchParams();
        if (locationId) {
          params.append('locationId', locationId);
        }
        if (sectorId) {
          params.append('sectorId', sectorId);
        }
        if (startDate) {
          params.append('startDate', startDate);
        }
        if (endDate) {
          params.append('endDate', endDate);
        }
        if (granularity) {
          params.append('granularity', granularity);
        }

        const url = `${apiBaseUrl}/climb-histories/stats${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await axios.get<
          ApiResponse<ClimbHistoriesStatsResponse>
        >(url, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data;
      },
    }),
  });
}

export { useClimbHistoriesStats };
