import {
  LocationsDeleteParams,
  LocationsDeleteResponse,
} from '@shared/models/location/location-delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseLocationsDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

function useLocationsDelete({
  onError,
  onSuccess,
}: UseLocationsDeleteParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { token } = useAuth();

  return useMutation<
    LocationsDeleteResponse,
    string,
    LocationsDeleteParams,
    unknown
  >({
    mutationFn: async ({ id }) => {
      const response = await axios.delete(
        `${apiBaseUrl}/locations/${encodeURIComponent(id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
        queryKey: ['locations'],
      });
      onSuccess?.();
    },
  });
}

export { useLocationsDelete };
