import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import {
  LocationsGetQuery,
  LocationsGetResponse,
} from '@jrposada/fit-log-shared/models/locations/locations-get';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseLocationsParams = Omit<LocationsGetQuery, 'cursor'>;

function useLocations({ limit }: UseLocationsParams = {}) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  const result = useInfiniteQuery<
    LocationsGetResponse,
    Error,
    { pages: LocationsGetResponse[]; pageParams: (string | undefined)[] },
    readonly unknown[],
    string | undefined
  >({
    queryKey: ['locations', { limit }],
    initialPageParam: undefined,
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    queryFn: ({ pageParam }) =>
      query<LocationsGetResponse>({
        defaultResponse: { locations: [], nextCursor: null },
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

          const url = `${apiBaseUrl}/locations${params.toString() ? `?${params.toString()}` : ''}`;
          const response = await axios.get<ApiResponse<LocationsGetResponse>>(
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
    () => result.data?.pages.flatMap((page) => page.locations) ?? [],
    [result.data]
  );

  return { ...result, items };
}

export { useLocations };
