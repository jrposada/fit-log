import {
  ClimbHistoriesDeleteParams,
  ClimbHistoriesDeleteResponse,
} from '@shared/models/climb-history';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseClimbHistoriesDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

function useClimbHistoriesDelete({
  onError,
  onSuccess,
}: UseClimbHistoriesDeleteParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useMutation<
    ClimbHistoriesDeleteResponse,
    string,
    ClimbHistoriesDeleteParams,
    unknown
  >({
    mutationFn: async ({ id }) => {
      const response = await axios.delete(
        `${apiBaseUrl}/climb-histories/${encodeURIComponent(id)}`,
        {
          headers: {
            Authorization: '',
          },
        }
      );

      if (!response.data.success) {
        throw new Error('Api error');
      }
    },
    onError: (message) => {
      onError?.(message);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ['climb-histories'],
      });
      onSuccess?.();
    },
  });
}

export { useClimbHistoriesDelete };
