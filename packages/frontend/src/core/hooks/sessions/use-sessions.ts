import { ApiResponse } from '@shared/models/api-response';
import { SessionsGetResponse } from '@shared/models/session';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { useAuth } from '../auth/use-auth';
import { query } from '../query';

export function useSessions() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  return useQuery({
    queryKey: ['sessions'],
    queryFn: query({
      fn: async () => {
        const response = await axios.get<ApiResponse<SessionsGetResponse>>(
          `${import.meta.env.VITE_API_BASE_URL}/sessions`,
          {
            headers: {
              Authorization: '',
            },
          }
        );

        return response.data.data.sessions;
      },
      location,
      navigate,
      auth,
    }),
    initialData: [],
  });
}
