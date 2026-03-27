import { ApiResponse } from '@shared/models/api-response';
import {
  SectorsBatchDeleteRequest,
  SectorsBatchDeleteResponse,
} from '@shared/models/sector/sector-batch-delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

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
  const { getToken, refreshToken, logout } = useAuth();

  return useMutation<
    SectorsBatchDeleteResponse,
    string,
    SectorsBatchDeleteRequest,
    unknown
  >({
    mutationFn: mutation({
      refreshToken,
      logout,
      fn: async ({ ids }) => {
        const response = await axios.delete<
          ApiResponse<SectorsBatchDeleteResponse>
        >(`${apiBaseUrl}/sectors`, {
          data: { ids },
          headers: {
            'Content-Type': 'application/json',
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
