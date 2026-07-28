import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import {
  ClimbsGetQuery,
  ClimbsGetResponse,
} from '@jrposada/fit-log-shared/models/climbs/climbs-get';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseClimbsParams = Omit<ClimbsGetQuery, 'cursor'>;

function useClimbs({ grade, limit, locationId, search }: UseClimbsParams = {}) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  const result = useInfiniteQuery<
    ClimbsGetResponse,
    Error,
    { pages: ClimbsGetResponse[]; pageParams: (string | undefined)[] },
    readonly unknown[],
    string | undefined
  >({
    queryKey: ['climbs', 'get', { grade, limit, locationId, search }],
    initialPageParam: undefined,
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    queryFn: ({ pageParam }) =>
      query<ClimbsGetResponse>({
        defaultResponse: { climbs: [], nextCursor: null },
        refreshToken,
        logout,
        fn: async () => {
          const params = new URLSearchParams();

          grade?.forEach((g) => params.append('grade', g));
          if (limit) {
            params.append('limit', limit.toString());
          }
          if (pageParam) {
            params.append('cursor', pageParam);
          }
          if (locationId) {
            params.append('locationId', locationId);
          }
          if (search) {
            params.append('search', search);
          }

          const url = `${apiBaseUrl}/climbs${params.toString() ? `?${params.toString()}` : ''}`;
          const response = await axios.get<ApiResponse<ClimbsGetResponse>>(
            url,
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );

          if (!response.data.success) {
            throw new Error('Api error');
          }

          return response.data.data;
        },
      })(),
  });

  const items = useMemo(
    () => result.data?.pages.flatMap((page) => page.climbs) ?? [],
    [result.data]
  );

  return { ...result, items };
}

export { useClimbs };
