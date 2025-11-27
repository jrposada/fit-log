import pkg from '../../../../package.json';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<string>(() => {
  const version = pkg.version;

  return Promise.resolve({
    statusCode: 200,
    body: { success: true, data: version },
  });
});
