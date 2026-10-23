import { planWeekForDate } from '@jrposada/fit-log-shared/common/training-plans/plan-week-for-date';
import type { Types } from 'mongoose';

import type { EntityAttributes } from '../data/infrastructure/entity-attributes.ts';
import type { IBenchmarkResult } from '../data/models/benchmark-result.ts';
import { BenchmarkResult } from '../data/models/benchmark-result.ts';
import { PlanEnrollment } from '../data/models/plan-enrollment.ts';
import ResourceNotFound from '../infrastructure/not-found-error.ts';
import ValidationError from '../infrastructure/validation-error.ts';
import { getTrainingPlanById } from './training-plan.ts';

const STRING_UNITS = ['v_grade', 'text'];

/** `owner` is set by the service from the authenticated user; `week` is
 * derived from `date`. */
type UpsertBenchmarkResultInput = Omit<
  EntityAttributes<IBenchmarkResult>,
  'owner' | 'week'
> & { id?: string };

async function getBenchmarkResults(
  owner: Types.ObjectId,
  enrollment: string
): Promise<IBenchmarkResult[]> {
  return BenchmarkResult.find({ owner, enrollment }).sort({
    date: -1,
    createdAt: -1,
  });
}

async function upsertBenchmarkResult(
  owner: Types.ObjectId,
  input: UpsertBenchmarkResultInput
): Promise<IBenchmarkResult> {
  const { id, ...data } = input;

  const enrollment = await PlanEnrollment.findOne({
    _id: data.enrollment,
    owner,
  });
  if (!enrollment) {
    throw new ResourceNotFound(
      `Plan enrollment ${data.enrollment.toString()} not found`
    );
  }

  const plan = await getTrainingPlanById(enrollment.planId);
  const benchmark = plan.benchmarks.find(({ id }) => id === data.benchmarkId);
  if (!benchmark) {
    throw new ValidationError(
      `Benchmark ${data.benchmarkId} not found in plan ${plan.id}`
    );
  }

  const isValidValue = STRING_UNITS.includes(benchmark.unit)
    ? typeof data.value === 'string' && data.value.trim() !== ''
    : typeof data.value === 'number' && Number.isFinite(data.value);
  if (!isValidValue) {
    throw new ValidationError(
      `Invalid value for benchmark ${benchmark.id} with unit ${benchmark.unit}`
    );
  }

  const week = planWeekForDate(enrollment.startDate, data.date);

  if (id) {
    const updated = await BenchmarkResult.findOneAndUpdate(
      { _id: id, owner },
      { $set: { ...data, week } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new ResourceNotFound(
        `Benchmark result ${id} not found or not editable`
      );
    }
    return updated;
  }

  return BenchmarkResult.create({ ...data, week, owner });
}

async function deleteBenchmarkResult(
  owner: Types.ObjectId,
  id: string
): Promise<void> {
  const result = await BenchmarkResult.deleteOne({ _id: id, owner });

  if (result.deletedCount === 0) {
    throw new ResourceNotFound(`Benchmark result with id ${id} not found`);
  }
}

export { deleteBenchmarkResult, getBenchmarkResults, upsertBenchmarkResult };
export type { UpsertBenchmarkResultInput };
