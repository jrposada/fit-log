import { ApiResponse } from '@shared/models/api-response';
import {
  SectorUploadUrlRequest,
  SectorUploadUrlResponse,
} from '@shared/models/sector';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseSectorUploadUrlParams = {
  onError?: (message: string) => void;
  onSuccess?: (data: SectorUploadUrlResponse) => void;
};

type UseSectorUploadUrlMutationParams = SectorUploadUrlRequest;

function useSectorUploadUrl({
  onError,
  onSuccess,
}: UseSectorUploadUrlParams = {}) {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useMutation<
    SectorUploadUrlResponse,
    string,
    UseSectorUploadUrlMutationParams,
    unknown
  >({
    mutationFn: async (data) => {
      const response = await axios.post<ApiResponse<SectorUploadUrlResponse>>(
        `${apiBaseUrl}/sectors/upload-url`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: '',
          },
        }
      );

      if (!response.data.success) {
        throw new Error('Api error');
      }

      return response.data.data;
    },
    onError: (message) => {
      console.error('Failed to get upload URL:', JSON.stringify(message));
      onError?.(message);
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
  });
}

export { useSectorUploadUrl };
