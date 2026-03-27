import { ApiResponse } from '@shared/models/api-response';
import {
  LocationsDeleteParams,
  LocationsDeleteResponse,
} from '@shared/models/location/location-delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

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
  const { getToken, refreshToken, logout } = useAuth();

  return useMutation<
    LocationsDeleteResponse,
    string,
    LocationsDeleteParams,
    unknown
  >({
    mutationFn: mutation({
      refreshToken,
      logout,
      fn: async ({ id }) => {
        const response = await axios.delete<
          ApiResponse<LocationsDeleteResponse>
        >(`${apiBaseUrl}/locations/${encodeURIComponent(id)}`, {
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
