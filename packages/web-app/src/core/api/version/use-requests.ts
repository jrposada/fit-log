import { useQuery } from '@tanstack/react-query';

export function useRequests() {
  return useQuery({
    queryKey: ['version'],
    queryFn: async () => {
      const response = 'local';
      return response;
      // return JSON.parse(response) as Request[];
    },
  });
}
