import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useTest() {
  return useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      console.log('url', import.meta.env.VITE_API_BASE_URL);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/test`
      );
      console.log(response);
      return response;
      // return JSON.parse(response) as Request[];
    },
  });
}
