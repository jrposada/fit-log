import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useSnackbar from '../../../ui/snackbar/use-snackbar';

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
  const { enqueueAutoHideSnackbar } = useSnackbar();

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
      enqueueAutoHideSnackbar({
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
