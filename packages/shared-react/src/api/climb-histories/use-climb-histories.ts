import { ApiResponse } from '@shared/models/api-response';
import {
  ClimbHistoriesGetQuery,
  ClimbHistoriesGetResponse,
} from '@shared/models/climb-history/climb-history-get';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseClimbHistoriesParams = Omit<ClimbHistoriesGetQuery, 'cursor'>;

function useClimbHistories({
  limit,
  climbId,
  locationId,
  sectorId,
  status,
  startDate,
  endDate,
}: UseClimbHistoriesParams = {}) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  const result = useInfiniteQuery<
    ClimbHistoriesGetResponse,
    Error,
    { pages: ClimbHistoriesGetResponse[]; pageParams: (string | undefined)[] },
    readonly unknown[],
    string | undefined
  >({
    queryKey: [
      'climb-histories',
      { limit, climbId, locationId, sectorId, status, startDate, endDate },
    ],
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    queryFn: ({ pageParam }) =>
      query<ClimbHistoriesGetResponse>({
        defaultResponse: { climbHistories: [], nextCursor: null },
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
          if (climbId) {
            params.append('climbId', climbId);
          }
          if (locationId) {
            params.append('locationId', locationId);
          }
          if (sectorId) {
            params.append('sectorId', sectorId);
          }
          status?.forEach((s) => {
            params.append('status', s);
          });
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
    () => result.data?.pages.flatMap((page) => page.climbHistories) ?? [],
    [result.data]
  );

  return { ...result, items };
}

export { useClimbHistories };
