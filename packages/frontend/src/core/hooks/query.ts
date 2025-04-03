import { ParsedLocation, UseNavigateResult } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { Auth } from './auth/auth-context';

export type QueryParams<TResponse> = {
  fn: () => Promise<TResponse>;
  location: ParsedLocation<{
    redirect?: string | undefined;
  }>;
  navigate: UseNavigateResult<string>;
  auth: Auth;
};
export function query<TResponse>({
  fn,
  location,
  navigate,
  auth,
}: QueryParams<TResponse>): () => Promise<TResponse> {
  return async () => {
    try {
      return await fn();
    } catch (error) {
      if (
        error instanceof AxiosError &&
        (error.status === 401 || error.status === 403)
      ) {
        auth.setIsAuthenticated(false);
        navigate({
          to: '/login',
          search: {
            redirect: location.hash,
          },
        });
      }
      return Promise.resolve({} as TResponse);
    }
  };
}
