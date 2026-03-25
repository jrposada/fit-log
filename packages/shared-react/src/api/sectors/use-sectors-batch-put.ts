import { ApiResponse } from '@shared/models/api-response';
import {
  SectorsBatchPutRequest,
  SectorsBatchPutResponse,
} from '@shared/models/sector/sector-batch-put';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseSectorsBatchPutParams = {
  onError?: (message: string) => void;
  onSuccess?: (sectorIds: string[]) => void;
};

function useSectorsBatchPut({
  onError,
  onSuccess,
}: UseSectorsBatchPutParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { token } = useAuth();

  return useMutation<
    SectorsBatchPutResponse,
    string,
    SectorsBatchPutRequest,
    unknown
  >({
    mutationFn: async ({ sectors }) => {
      const response = await axios.put<ApiResponse<SectorsBatchPutResponse>>(
        `${apiBaseUrl}/sectors/batch`,
        { sectors },
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

      return response.data.data;
    },
    onError: (message) => {
      console.error('Failed to batch put sectors:', JSON.stringify(message));
      onError?.(message);
    },
    onSuccess: (data) => {
      client.invalidateQueries({
        queryKey: ['sectors'],
      });
      const sectorIds = data.sectors.map((s) => s.id);
      onSuccess?.(sectorIds);
    },
  });
}

export { useSectorsBatchPut };
