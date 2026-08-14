import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import {
  TrainingSessionsPutRequest,
  TrainingSessionsPutResponse,
} from '@jrposada/fit-log-shared/models/training-sessions/training-sessions-put';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

type UseTrainingSessionsPutParams = {
  onError?: (message: string) => void;
  onSuccess?: (
    trainingSession: TrainingSessionsPutResponse['trainingSession']
  ) => void;
};

function useTrainingSessionsPut({
  onError,
  onSuccess,
}: UseTrainingSessionsPutParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useMutation<
    TrainingSessionsPutResponse['trainingSession'],
    string,
    TrainingSessionsPutRequest,
    unknown
  >({
    mutationFn: mutation({
      refreshToken,
      logout,
      fn: async (trainingSession) => {
        const response = await axios.put<
          ApiResponse<TrainingSessionsPutResponse>
        >(`${apiBaseUrl}/training-sessions`, trainingSession, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.trainingSession;
      },
    }),
    onError: (message) => {
      console.error('Failed to put training session:', JSON.stringify(message));
      onError?.(message);
    },
    onSuccess: (trainingSession) => {
      client.invalidateQueries({
        queryKey: ['training-sessions'],
      });
      client.invalidateQueries({ queryKey: ['feed'] });
      onSuccess?.(trainingSession);
    },
  });
}

export { useTrainingSessionsPut };
