import dotenv from 'dotenv';
import pkg from '../../../../package.json';
import { apiHandler } from '../../api-utils';

if (process.env.IS_OFFLINE) {
  const env = dotenv.config({ path: '.env.development' }).parsed;
  Object.assign(process.env, env);
}

export const handler = apiHandler<string>((_event) => {
  const version = pkg.version;

  return Promise.resolve({
    statusCode: 200,
    body: { success: true, data: version },
  });
});
