import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import {
  ClimbingSessionsPutRequest,
  ClimbingSessionsPutResponse,
} from '@jrposada/fit-log-shared/models/climbing-sessions/climbing-sessions-put';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

type UseClimbingSessionsPutParams = {
  onError?: (message: string) => void;
  onSuccess?: (
    climbingSession: ClimbingSessionsPutResponse['climbingSession']
  ) => void;
};

function useClimbingSessionsPut({
  onError,
  onSuccess,
}: UseClimbingSessionsPutParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useMutation<
    ClimbingSessionsPutResponse['climbingSession'],
    string,
    ClimbingSessionsPutRequest,
    unknown
  >({
    mutationFn: mutation({
      refreshToken,
      logout,
      fn: async (climbingSession) => {
        const response = await axios.put<
          ApiResponse<ClimbingSessionsPutResponse>
        >(`${apiBaseUrl}/climbing-sessions`, climbingSession, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.climbingSession;
      },
    }),
    onError: (message) => {
      console.error('Failed to put climbing session:', JSON.stringify(message));
      onError?.(message);
    },
    onSuccess: (climbingSession) => {
      client.invalidateQueries({
        queryKey: ['climbing-sessions'],
      });
      onSuccess?.(climbingSession);
    },
  });
}

export { useClimbingSessionsPut };
