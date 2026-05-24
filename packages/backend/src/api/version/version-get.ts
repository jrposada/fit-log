import pkg from '../../../package.json' with { type: 'json' };
import { toApiResponse } from '../api-utils.ts';

const handler = toApiResponse(async () => {
  const version = pkg.version;

  return {
    statusCode: 200,
    body: { success: true, data: version },
  };
});

export { handler };
