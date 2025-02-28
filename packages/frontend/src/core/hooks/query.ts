import { ParsedLocation, UseNavigateResult } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { Session } from './session/session-context';

export type QueryParams<TResponse> = {
  fn: () => Promise<TResponse>;
  location: ParsedLocation<{
    redirect?: string | undefined;
  }>;
  navigate: UseNavigateResult<string>;
  session: Session;
};
export function query<TResponse>({
  fn,
  location,
  navigate,
  session,
}: QueryParams<TResponse>): () => Promise<TResponse> {
  return async () => {
    try {
      return await fn();
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
      return Promise.resolve({} as TResponse);
    }
  };
}
