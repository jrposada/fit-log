import type {
  BenchmarkResultsDeleteParams,
  BenchmarkResultsDeleteResponse,
} from '@jrposada/fit-log-shared/models/benchmark-results/benchmark-results-delete';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { deleteBenchmarkResult } from '../../../services/benchmark-result.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';

const handler = toRequestHandler<
  BenchmarkResultsDeleteResponse,
  BenchmarkResultsDeleteParams
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { id } = request.params;

  await deleteBenchmarkResult(request.user._id, id);

  return {
    statusCode: 200,
    body: {
      success: true,
      data: undefined,
    },
  };
});

export { handler };
