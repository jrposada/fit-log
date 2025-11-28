import { AxiosError } from 'axios';

export type QueryParams<TResponse> = {
  defaultResponse?: TResponse;
  fn: () => Promise<TResponse>;
};

export function query<TResponse>({
  defaultResponse,
  fn,
}: QueryParams<TResponse>): () => Promise<TResponse> {
  return async () => {
    try {
      return await fn();
    } catch (error) {
      if (
        error instanceof AxiosError &&
        (error.status === 401 || error.status === 403)
      ) {
        console.log('Unauthorized access - redirecting to login.');
      }

      return defaultResponse ?? ({} as TResponse);
    }
  };
}
