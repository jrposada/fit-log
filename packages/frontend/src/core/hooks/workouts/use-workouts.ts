import { ApiResponse } from '@shared/models/api-response';
import { WorkoutsGetResponse } from '@shared/models/workout';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { query } from '../query';
import { useSession } from '../session/use-session';

export function useWorkouts() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSession();

  return useQuery({
    queryKey: ['workouts'],
    queryFn: query({
      fn: async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/workouts`,
          {
            headers: {
              Authorization: '',
            },
          }
        );

        return (response.data as ApiResponse<WorkoutsGetResponse>).data
          .workouts;
      },
      location,
      navigate,
      session,
    }),
    initialData: [],
  });
}
