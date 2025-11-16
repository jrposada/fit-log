import { BouldersPutRequest } from '@shared/models/boulder';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type UseBouldersPutParams = {
  apiBaseUrl: string;
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

type UseBouldersPutMutationParams = BouldersPutRequest;

export function useBouldersPut({
  apiBaseUrl,
  onError,
  onSuccess,
}: UseBouldersPutParams) {
  const client = useQueryClient();

  return useMutation<void, string, UseBouldersPutMutationParams, unknown>({
    mutationFn: async (boulder) => {
      const response = await axios.put(
        `${apiBaseUrl}/boulders`,
        JSON.stringify(boulder),
        {
          headers: {
            Authorization: '',
          },
        }
      );

      if (!response.data.success) {
        throw new Error('Api error');
      }
    },
    onError: (message) => {
      onError?.(message);
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ['boulders'],
      });
      onSuccess?.();
    },
  });
}
