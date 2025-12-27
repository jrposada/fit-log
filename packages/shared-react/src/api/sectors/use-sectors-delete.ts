import {
  SectorsDeleteParams,
  SectorsDeleteResponse,
} from '@shared/models/sector/sector-delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseSectorsDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

function useSectorsDelete({ onError, onSuccess }: UseSectorsDeleteParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useMutation<
    SectorsDeleteResponse,
    string,
    SectorsDeleteParams,
    unknown
  >({
    mutationFn: async ({ id }) => {
      const response = await axios.delete(`${apiBaseUrl}/sectors/${id}`, {
        headers: {
          Authorization: '',
        },
      });

      if (!response.data.success) {
        throw new Error('Api error');
      }
    },
    onError: (message) => {
      console.error('Failed to delete sector:', JSON.stringify(message));
      onError?.(message);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ['sectors'],
      });
      onSuccess?.();
    },
  });
}

export { useSectorsDelete };
