import { ApiResponse } from '@shared/models/api-response';
import { WorkoutsGetParams, WorkoutsGetResponse } from '@shared/models/workout';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { useAuth } from '../auth/use-auth';
import { query } from '../query';

type UseWorkoutsParams = Omit<WorkoutsGetParams, 'onlyFavorites'> & {
  onlyFavorites?: boolean;
};
export function useWorkouts({ onlyFavorites }: UseWorkoutsParams = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  return useQuery({
    queryKey: ['workouts'],
    queryFn: query({
      defaultResponse: [],
      fn: async () => {
        const response = await axios.get<ApiResponse<WorkoutsGetResponse>>(
          `${import.meta.env.VITE_API_BASE_URL}/workouts?${onlyFavorites ? 'onlyFavorites' : ''}`,
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
