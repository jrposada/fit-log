import {
  SectorsBatchDeleteRequest,
  SectorsBatchDeleteResponse,
} from '@shared/models/sector';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseSectorsBatchDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: (deletedCount: number) => void;
};

function useSectorsBatchDelete({
  onError,
  onSuccess,
}: UseSectorsBatchDeleteParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useMutation<
    SectorsBatchDeleteResponse,
    string,
    SectorsBatchDeleteRequest,
    unknown
  >({
    mutationFn: async ({ ids }) => {
      const response = await axios.delete(`${apiBaseUrl}/sectors`, {
        data: { ids },
        headers: {
          'Content-Type': 'application/json',
          Authorization: '',
        },
      });

      if (!response.data.success) {
        throw new Error('Api error');
      }

      return response.data.data;
    },
    onError: (message) => {
      console.error('Failed to batch delete sectors:', JSON.stringify(message));
      onError?.(message);
    },
    onSuccess: (data) => {
      client.invalidateQueries({
        queryKey: ['sectors'],
      });
      onSuccess?.(data.deletedCount);
    },
  });
}

export { useSectorsBatchDelete };
