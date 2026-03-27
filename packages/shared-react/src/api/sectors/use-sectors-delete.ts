import { ApiResponse } from '@shared/models/api-response';
import {
  SectorsDeleteParams,
  SectorsDeleteResponse,
} from '@shared/models/sector/sector-delete';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

type UseSectorsDeleteParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

function useSectorsDelete({ onError, onSuccess }: UseSectorsDeleteParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useMutation<
    SectorsDeleteResponse,
    string,
    SectorsDeleteParams,
    unknown
  >({
    mutationFn: mutation({
      refreshToken,
      logout,
      fn: async ({ id }) => {
        const response = await axios.delete<ApiResponse<SectorsDeleteResponse>>(
          `${apiBaseUrl}/sectors/${id}`,
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
    }),
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
