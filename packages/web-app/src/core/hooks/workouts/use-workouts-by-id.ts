import { ApiResponse } from '@shared/models/api-response';
import { WorkoutsGetByIdResponse } from '@shared/models/workout';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';
import axios from 'axios';

import { useAuth } from '../../hooks/auth/use-auth';
import { query } from '../query';

export function useWorkoutsById(id: string) {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  return useQuery({
    queryKey: ['workouts', { id }],
    queryFn: query({
      fn: async () => {
        const response = await axios.get<ApiResponse<WorkoutsGetByIdResponse>>(
          `${import.meta.env.VITE_API_BASE_URL}/workouts/${encodeURIComponent(id)}`,
          {
            headers: {
              Authorization: '',
            },
          }
        );

        if (!response.data.success) {
          throw new Error('Api error');
        }

        return response.data.data.workout;
      },
      location,
      navigate,
      auth,
    }),
  });
}
