import pkg from '../../../../package.json' with { type: 'json' };
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';

const handler = toRequestHandler(async () => {
  const version = pkg.version;

  return {
    statusCode: 200,
    body: { success: true, data: version },
  };
});

export { handler };
