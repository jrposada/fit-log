import { ApiResponse } from '@shared/models/api-response';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useTest() {
  return useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/test`
      );

      return response.data as ApiResponse<string>;
    },
  });
}
