import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import { Request } from '../../types/request';

export function useRequests() {
  return useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const response = await invoke<string>('get_requests');

      return JSON.parse(response) as Request[];
    },
  });
}
