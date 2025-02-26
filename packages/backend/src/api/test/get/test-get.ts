import pkg from '../../../../package.json';
import { apiHandler } from '../../api-utils';

export const handler = apiHandler<string>((_event) => {
  console.log('PACO test');
  const version = pkg.version;

  return Promise.resolve({
    statusCode: 200,
    body: { success: true, data: version },
  });
});
