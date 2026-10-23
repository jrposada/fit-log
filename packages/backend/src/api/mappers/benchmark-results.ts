import type { BenchmarkResult } from '@jrposada/fit-log-shared/models/benchmark-results/benchmark-result';
import type { BenchmarkResultsPutRequest } from '@jrposada/fit-log-shared/models/benchmark-results/benchmark-results-put';
import { Types } from 'mongoose';

import type { IBenchmarkResult } from '../../data/models/benchmark-result.ts';
import type { UpsertBenchmarkResultInput } from '../../services/benchmark-result.ts';

function toApiBenchmarkResult(model: IBenchmarkResult): BenchmarkResult {
  return {
    /* Data */
    id: model._id.toString(),
    benchmarkId: model.benchmarkId,
    date: model.date,
    week: model.week,
    value: model.value,
    notes: model.notes,

    /* Ownership */
    owner: model.owner.toString(),

    /* References */
    enrollment: model.enrollment.toString(),

    /* Timestamps */
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}

function toUpsertBenchmarkResultInput(
  request: BenchmarkResultsPutRequest
): UpsertBenchmarkResultInput {
  return {
    /* Data */
    id: request.id,
    benchmarkId: request.benchmarkId,
    date: request.date,
    value: request.value,
    notes: request.notes,

    /* References */
    enrollment: new Types.ObjectId(request.enrollment),
  };
}

export { toApiBenchmarkResult, toUpsertBenchmarkResultInput };
