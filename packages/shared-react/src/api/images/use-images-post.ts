import { ImagesPostRequest, ImagesPostResponse } from '@shared/models/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseImagesPostParams = {
  onError?: (message: string) => void;
  onSuccess?: (imageId: string) => void;
};

function useImagesPost({ onError, onSuccess }: UseImagesPostParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useMutation<
    ImagesPostResponse['image'],
    string,
    ImagesPostRequest,
    unknown
  >({
    mutationFn: async (payload) => {
      const response = await axios.post(`${apiBaseUrl}/images`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: '',
        },
      });

      if (!response.data.success) {
        throw new Error('Api error');
      }

      return response.data.data.image;
    },
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
