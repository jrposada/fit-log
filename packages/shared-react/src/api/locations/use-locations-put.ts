import { Location, LocationsPutRequest } from '@shared/models/location';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseLocationsPutParams = {
  onError?: (message: string) => void;
  onSuccess?: (location: Location) => void;
};

type UseLocationsPutMutationParams = LocationsPutRequest;

function useLocationsPut({ onError, onSuccess }: UseLocationsPutParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useMutation<Location, string, UseLocationsPutMutationParams, unknown>({
    mutationFn: async (location) => {
      const response = await axios.put(`${apiBaseUrl}/locations`, location, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: '',
        },
      });

      if (!response.data.success) {
        throw new Error('Api error');
      }

      return response.data.data.location;
    },
    onError: (message) => {
      console.error('Failed to put location:', JSON.stringify(message));
      onError?.(message);
    },
    onSuccess: (location) => {
      client.invalidateQueries({
        queryKey: ['locations'],
      });
      onSuccess?.(location);
    },
  });
}

export { useLocationsPut };
