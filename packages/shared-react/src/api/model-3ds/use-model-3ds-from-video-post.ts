import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import {
  Model3dsFromVideoPostRequest,
  Model3dsFromVideoPostResponse,
} from '@jrposada/fit-log-shared/models/model-3d/model-3ds-from-video-post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

type UseModel3dsFromVideoPostParams = {
  onError?: (message: string) => void;
  onSuccess?: (model3dId: string) => void;
};

/** `model3d.status` on the resolved value is 'processing', not 'ready' —
 * the reconstruction job has only just been queued. */
function useModel3dsFromVideoPost({
  onError,
  onSuccess,
}: UseModel3dsFromVideoPostParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useMutation<
    Model3dsFromVideoPostResponse['model3d'],
    string,
    Model3dsFromVideoPostRequest,
    unknown
  >({
    mutationFn: mutation({
      refreshToken,
      logout,
      fn: async (payload) => {
        const response = await axios.post<
          ApiResponse<Model3dsFromVideoPostResponse>
        >(`${apiBaseUrl}/model-3ds/from-video`, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.model3d;
      },
    }),
    onError: (message) => {
      console.error(
        'Failed to post model3d from video:',
        JSON.stringify(message)
      );
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

export { useModel3dsFromVideoPost };
