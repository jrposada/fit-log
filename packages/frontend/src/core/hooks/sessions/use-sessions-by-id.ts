import { ApiResponse } from '@shared/models/api-response';
import { SessionsGetByIdResponse } from '@shared/models/session';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { useAuth } from '../auth/use-auth';
import { query } from '../query';

export function useSessionsById(id: string) {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  return useQuery({
    queryKey: ['sessions', { id }],
    queryFn: query({
      fn: async () => {
        const response = await axios.get<ApiResponse<SessionsGetByIdResponse>>(
          `${import.meta.env.VITE_API_BASE_URL}/sessions/${encodeURIComponent(id)}`,
          {
            headers: {
              Authorization: '',
            },
          }
        );

        return response.data.data.session;
      },
      location,
      navigate,
      auth,
    }),
  });
}
