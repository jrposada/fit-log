import { ApiResponse } from '@jrposada/fit-log-shared/models/api-response';
import { PlanEnrollmentsGetActiveResponse } from '@jrposada/fit-log-shared/models/plan-enrollments/plan-enrollments-get-active';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuth } from '../../contexts/auth/use-auth';
import { getEnvVariable } from '../../infrastructure/get-env-variable';
import { query } from '../query';

function usePlanEnrollmentsActive() {
  const apiBaseUrl = getEnvVariable('PUBLIC_API_BASE_URL');
  const { getToken, refreshToken, logout } = useAuth();

  return useQuery<PlanEnrollmentsGetActiveResponse['planEnrollment'], Error>({
    queryKey: ['plan-enrollments', { active: true }],
    queryFn: query({
      defaultResponse: null,
      refreshToken,
      logout,
      fn: async () => {
        const response = await axios.get<
          ApiResponse<PlanEnrollmentsGetActiveResponse>
        >(`${apiBaseUrl}/plan-enrollments/active`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.planEnrollment;
      },
    }),
  });
}

export { usePlanEnrollmentsActive };
