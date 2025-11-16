import { AxiosError } from 'axios';

export type QueryParams<TResponse> = {
  defaultResponse?: TResponse;
  fn: () => Promise<TResponse>;
  onUnauthorized?: () => void;
};

export function query<TResponse>({
  defaultResponse,
  fn,
  onUnauthorized,
}: QueryParams<TResponse>): () => Promise<TResponse> {
  return async () => {
    try {
      return await fn();
    } catch (error) {
      if (
        error instanceof AxiosError &&
        (error.status === 401 || error.status === 403)
      ) {
        onUnauthorized?.();
      }

      return defaultResponse ?? ({} as TResponse);
    }
  };
}
