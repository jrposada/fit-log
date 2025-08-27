import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useToasts } from '../../../ui/toasts/use-toasts';

type UseUsersAuthorizeParams = {
  onError?: (message: string) => void;
  onSuccess?: () => void;
};

type UseUsersAuthorizeMutationParams = {
  email: string;
  password: string;
};

export function useUsersAuthorize({
  onError,
  onSuccess,
}: UseUsersAuthorizeParams = {}) {
  const { push } = useToasts();

  return useMutation<void, string, UseUsersAuthorizeMutationParams, unknown>({
    mutationFn: async ({ email, password }) => {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/authorize`,
        JSON.stringify({ email, password }),
        {
          headers: {
            Authorization: '',
          },
        }
      );
    },
    onError: (message) => {
      push({
        message: 'Incorrect username or password.',
        variant: 'error',
      });
      onError?.(message);
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });
}
