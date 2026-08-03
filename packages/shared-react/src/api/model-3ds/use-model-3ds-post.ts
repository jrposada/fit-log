import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import {
  Model3dsPostRequest,
  Model3dsPostResponse,
} from '@jrposada/fit-log-shared/models/model-3d/model-3ds-post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

type UseModel3dsPostParams = {
  onError?: (message: string) => void;
  onSuccess?: (model3dId: string) => void;
};

function useModel3dsPost({ onError, onSuccess }: UseModel3dsPostParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useMutation<
    Model3dsPostResponse['model3d'],
    string,
    Model3dsPostRequest,
    unknown
  >({
    mutationFn: mutation({
      refreshToken,
      logout,
      fn: async (payload) => {
        const response = await axios.post<ApiResponse<Model3dsPostResponse>>(
          `${apiBaseUrl}/model-3ds`,
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

        return response.data.data.model3d;
      },
    }),
    onError: (message) => {
      console.error('Failed to post model3d:', JSON.stringify(message));
      onError?.(message);
    },
    onSuccess: (model3d) => {
      client.invalidateQueries({
        queryKey: ['model-3ds'],
      });
      onSuccess?.(model3d.id);
    },
  });
}

export { useModel3dsPost };
