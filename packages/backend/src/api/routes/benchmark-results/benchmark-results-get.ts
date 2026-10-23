import type {
  BenchmarkResultsGetQuery,
  BenchmarkResultsGetResponse,
} from '@jrposada/fit-log-shared/models/benchmark-results/benchmark-results-get';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { getBenchmarkResults } from '../../../services/benchmark-result.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import { toApiBenchmarkResult } from '../../mappers/benchmark-results.ts';

const handler = toRequestHandler<
  BenchmarkResultsGetResponse,
  unknown,
  BenchmarkResultsGetQuery
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const { enrollment } = request.query;

  const benchmarkResults = await getBenchmarkResults(
    request.user._id,
    enrollment
  );

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        benchmarkResults: benchmarkResults.map(toApiBenchmarkResult),
      },
    },
  };
});

export { handler };
