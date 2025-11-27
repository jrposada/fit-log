import pkg from '../../../package.json';
import { toApiResponse } from '../api-utils';

const handler = toApiResponse(async () => {
  const version = pkg.version;

  return {
    statusCode: 200,
    body: { success: true, data: version },
  };
});

export { handler };
