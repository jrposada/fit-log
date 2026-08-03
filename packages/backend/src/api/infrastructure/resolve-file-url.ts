import { assert } from '@jrposada/fit-log-shared/utils/assert';

export function resolveFileUrl(relativePath: string): string {
  if (
    relativePath.startsWith('http://') ||
    relativePath.startsWith('https://')
  ) {
    return relativePath;
  }

  assert(process.env.PUBLIC_FILES_BASE_URL, {
    msg: 'PUBLIC_FILES_BASE_URL environment variable is not set',
  });

  return `${process.env.PUBLIC_FILES_BASE_URL}/${relativePath}`;
}
