import { ApiResponse } from '@shared/models/api-response';
import {
  SectorsPutRequest,
  SectorsPutResponse,
} from '@shared/models/sector/sector-put';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseSectorsPutParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

function useSectorsPut({ onError, onSuccess }: UseSectorsPutParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { token } = useAuth();

  return useMutation<
    SectorsPutResponse['sector'],
    string,
    SectorsPutRequest,
    unknown
  >({
    mutationFn: async (sector) => {
      const response = await axios.put<ApiResponse<SectorsPutResponse>>(
        `${apiBaseUrl}/sectors`,
        sector,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error('Api error');
      }

      return response.data.data.sector;
    },
    onError: (message) => {
      console.error('Failed to put sector:', JSON.stringify(message));
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

export { useSectorsPut };
