import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import {
  FeedStatsQuery,
  FeedStatsResponse,
} from '@jrposada/fit-log-shared/models/feed/feed-stats';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseFeedStatsParams = FeedStatsQuery;

function useFeedStats({
  sport,
  startDate,
  endDate,
  granularity,
  timezone,
}: UseFeedStatsParams = {}) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useQuery({
    queryKey: [
      'feed-stats',
      { sport, startDate, endDate, granularity, timezone },
    ],
    queryFn: query<FeedStatsResponse>({
      refreshToken,
      logout,
      fn: async () => {
        const params = new URLSearchParams();
        if (sport) {
          params.append('sport', sport);
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
        if (timezone) {
          params.append('timezone', timezone);
        }

        const url = `${apiBaseUrl}/feed/stats${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await axios.get<ApiResponse<FeedStatsResponse>>(url, {
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

export { useFeedStats };
