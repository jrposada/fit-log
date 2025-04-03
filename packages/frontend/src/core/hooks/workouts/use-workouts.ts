import { ApiResponse } from '@shared/models/api-response';
import { WorkoutsGetResponse } from '@shared/models/workout';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { useAuth } from '../auth/use-auth';
import { query } from '../query';

export function useWorkouts() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  return useQuery({
    queryKey: ['workouts'],
    queryFn: query({
      fn: async () => {
        const response = await axios.get<ApiResponse<WorkoutsGetResponse>>(
          `${import.meta.env.VITE_API_BASE_URL}/workouts`,
          {
            headers: {
              Authorization: '',
            },
          }
        );

        return response.data.data.workouts;
      },
      location,
      navigate,
      auth,
    }),
    initialData: [],
  });
}
