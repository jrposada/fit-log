import { ApiResponse } from '@shared/models/api-response';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSession } from '../session/use-session';
import { useLocation, useNavigate } from '@tanstack/react-router';

export function useTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSession();

  return useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/test`
        );

        return response.data as ApiResponse<string>;
      } catch (error) {
        if (
          error instanceof AxiosError &&
          (error.status === 401 || error.status === 403)
        ) {
          session.setIsAuthenticated(false);
          navigate({
            to: '/login',
            search: {
              redirect: location.hash,
            },
          });
        }
        return {};
      }
    },
  });
}
