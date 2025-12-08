import { ImagesPutResponse } from '@shared/models/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { getEnvVariable } from '../../infrastructure/get-env-variable';

type UseImagesPutParams = {
  onError?: (message: string) => void;
  onSuccess?: (imageId: string) => void;
};

type UseImagesPutMutationParams = {
  imageFile: File | Blob;
};

function useImagesPut({ onError, onSuccess }: UseImagesPutParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');

  return useMutation<
    ImagesPutResponse['image'],
    string,
    UseImagesPutMutationParams,
    unknown
  >({
    mutationFn: async ({ imageFile }) => {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.put(`${apiBaseUrl}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: '',
        },
      });

      if (!response.data.success) {
        throw new Error('Api error');
      }

      return response.data.data.image;
    },
    onError: (message) => {
      console.error('Failed to put image:', JSON.stringify(message));
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

export { useImagesPut };
