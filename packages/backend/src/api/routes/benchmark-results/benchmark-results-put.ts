import type {
  BenchmarkResultsPutRequest,
  BenchmarkResultsPutResponse,
} from '@jrposada/fit-log-shared/models/benchmark-results/benchmark-results-put';
import { assert } from '@jrposada/fit-log-shared/utils/assert';

import { upsertBenchmarkResult } from '../../../services/benchmark-result.ts';
import { toRequestHandler } from '../../infrastructure/to-request-handler.ts';
import {
  toApiBenchmarkResult,
  toUpsertBenchmarkResultInput,
} from '../../mappers/benchmark-results.ts';

const handler = toRequestHandler<
  BenchmarkResultsPutResponse,
  unknown,
  unknown,
  BenchmarkResultsPutRequest
>(async (request) => {
  assert(request.user, { msg: 'Unauthorized' });

  const benchmarkResult = await upsertBenchmarkResult(
    request.user._id,
    toUpsertBenchmarkResultInput(request.body)
  );

  return {
    statusCode: 200,
    body: {
      success: true,
      data: {
        benchmarkResult: toApiBenchmarkResult(benchmarkResult),
      },
    },
  };
});

export { handler };
