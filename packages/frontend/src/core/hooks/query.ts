import { ParsedLocation, UseNavigateResult } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { Auth } from './auth/auth-context';

export type QueryParams<TResponse> = {
  auth: Auth;
  defaultResponse?: TResponse;
  fn: () => Promise<TResponse>;
  location: ParsedLocation<{
    redirect?: string | undefined;
  }>;
  navigate: UseNavigateResult<string>;
};
export function query<TResponse>({
  auth,
  defaultResponse,
  fn,
  location,
  navigate,
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

      return defaultResponse ?? ({} as TResponse);
    }
  };
}
