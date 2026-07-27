import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import {
  FeedGetQuery,
  FeedGetResponse,
} from '@jrposada/fit-log-shared/models/feed/feed-get';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseFeedParams = Omit<FeedGetQuery, 'cursor'>;

function useFeed({
  limit,
  sport,
  locationId,
  startDate,
  endDate,
}: UseFeedParams = {}) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  const result = useInfiniteQuery<
    FeedGetResponse,
    Error,
    { pages: FeedGetResponse[]; pageParams: (string | undefined)[] },
    readonly unknown[],
    string | undefined
  >({
    queryKey: ['feed', { limit, sport, locationId, startDate, endDate }],
    initialPageParam: undefined,
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    queryFn: ({ pageParam }) =>
      query<FeedGetResponse>({
        defaultResponse: { sessions: [], nextCursor: null },
        refreshToken,
        logout,
        fn: async () => {
          const params = new URLSearchParams();
          if (limit) {
            params.append('limit', limit.toString());
          }
          if (pageParam) {
            params.append('cursor', pageParam);
          }
          if (sport) {
            params.append('sport', sport);
          }
          if (locationId) {
            params.append('locationId', locationId);
          }
          if (startDate) {
            params.append('startDate', startDate);
          }
          if (endDate) {
            params.append('endDate', endDate);
          }

          const url = `${apiBaseUrl}/feed${params.toString() ? `?${params.toString()}` : ''}`;
          const response = await axios.get<ApiResponse<FeedGetResponse>>(url, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          });

          if (!response.data.success) {
            throw new Error('Api error');
          }

          return response.data.data;
        },
      })(),
  });

  const items = useMemo(
    () => result.data?.pages.flatMap((page) => page.sessions) ?? [],
    [result.data]
  );

  return { ...result, items };
}

export { useFeed };
