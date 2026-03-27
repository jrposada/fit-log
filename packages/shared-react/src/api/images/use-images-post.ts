import { ApiResponse } from '@shared/models/api-response';
import {
  ImagesPostRequest,
  ImagesPostResponse,
} from '@shared/models/image/image-post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

type UseImagesPostParams = {
  onError?: (message: string) => void;
  onSuccess?: (imageId: string) => void;
};

function useImagesPost({ onError, onSuccess }: UseImagesPostParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useMutation<
    ImagesPostResponse['image'],
    string,
    ImagesPostRequest,
    unknown
  >({
    mutationFn: mutation({
      refreshToken,
      logout,
      fn: async (payload) => {
        const response = await axios.post<ApiResponse<ImagesPostResponse>>(
          `${apiBaseUrl}/images`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.image;
      },
    }),
    onError: (message) => {
      console.error('Failed to post image:', JSON.stringify(message));
      onError?.(message);
    },
    onSuccess: (image) => {
      client.invalidateQueries({
        queryKey: ['images'],
      });
      onSuccess?.(image.id);
    },
  });
}

export { useImagesPost };
