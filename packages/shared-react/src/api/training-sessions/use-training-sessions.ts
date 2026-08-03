import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import {
  TrainingSessionsGetQuery,
  TrainingSessionsGetResponse,
} from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-get';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

type UseTrainingSessionsParams = Omit<TrainingSessionsGetQuery, 'cursor'>;

function useTrainingSessions({
  limit,
  active,
}: UseTrainingSessionsParams = {}) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  const result = useInfiniteQuery<
    TrainingSessionsGetResponse,
    Error,
    {
      pages: TrainingSessionsGetResponse[];
      pageParams: (string | undefined)[];
    },
    readonly unknown[],
    string | undefined
  >({
    queryKey: ['training-sessions', { limit, active }],
    initialPageParam: undefined,
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    queryFn: ({ pageParam }) =>
      query<TrainingSessionsGetResponse>({
        defaultResponse: { trainingSessions: [], nextCursor: null },
        refreshToken,
        logout,
        fn: async () => {
          const params = new URLSearchParams();
          if (limit) {
            params.append('limit', limit.toString());
          }
          if (active) {
            params.append('active', 'true');
          }
          if (pageParam) {
            params.append('cursor', pageParam);
          }

          const url = `${apiBaseUrl}/training-sessions${params.toString() ? `?${params.toString()}` : ''}`;
          const response = await axios.get<
            ApiResponse<TrainingSessionsGetResponse>
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
    () => result.data?.pages.flatMap((page) => page.trainingSessions) ?? [],
    [result.data]
  );

  return { ...result, items };
}

export { useTrainingSessions };
