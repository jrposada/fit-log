import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import {
  PlanEnrollmentsPutRequest,
  PlanEnrollmentsPutResponse,
} from '@jrposada/fit-log-shared/models/plan-enrollments/plan-enrollments-put';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { mutation } from '../mutation';

type UsePlanEnrollmentsPutParams = {
  onError?: (message: string) => void;
  onSuccess?: (
    planEnrollment: PlanEnrollmentsPutResponse['planEnrollment']
  ) => void;
};

function usePlanEnrollmentsPut({
  onError,
  onSuccess,
}: UsePlanEnrollmentsPutParams = {}) {
  const client = useQueryClient();
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useMutation<
    PlanEnrollmentsPutResponse['planEnrollment'],
    string,
    PlanEnrollmentsPutRequest,
    unknown
  >({
    mutationFn: mutation({
      refreshToken,
      logout,
      fn: async (planEnrollment) => {
        const response = await axios.put<
          ApiResponse<PlanEnrollmentsPutResponse>
        >(`${apiBaseUrl}/plan-enrollments`, planEnrollment, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.planEnrollment;
      },
    }),
    onError: (message) => {
      console.error('Failed to put plan enrollment:', JSON.stringify(message));
      onError?.(message);
    },
    onSuccess: (planEnrollment) => {
      client.invalidateQueries({ queryKey: ['plan-enrollments'] });
      onSuccess?.(planEnrollment);
    },
  });
}

export { usePlanEnrollmentsPut };
