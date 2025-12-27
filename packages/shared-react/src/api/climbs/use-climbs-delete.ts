import {
  ClimbsDeleteParams,
  ClimbsDeleteResponse,
} from '@shared/models/climb/climb-delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseClimbsDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

function useClimbsDelete({ onError, onSuccess }: UseClimbsDeleteParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useMutation<ClimbsDeleteResponse, string, ClimbsDeleteParams, unknown>(
    {
      mutationFn: async ({ id }) => {
        const response = await axios.delete(
          `${apiBaseUrl}/climbs/${encodeURIComponent(id)}`,
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
          queryKey: ['climbs'],
        });
        onSuccess?.();
      },
    }
  );
}

export { useClimbsDelete };
