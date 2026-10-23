import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

import type { WithRefs } from '../infrastructure/with-refs.ts';
import type { IPlanEnrollment } from './plan-enrollment.ts';

export type BenchmarkResultPopulatedRefs = {
  enrollment: IPlanEnrollment;
};

export interface IBenchmarkResult
  extends
    WithTimestamps<Document<Types.ObjectId>>,
    WithRefs<BenchmarkResultPopulatedRefs> {
  /* Data */
  /** Benchmark id within the enrollment's plan, not an ObjectId. */
  benchmarkId: string;
  /** `YYYY-MM-DD` calendar date, kept as a string so the plan's week math
   * never depends on a timezone. */
  date: string;
  /** Derived from `date` and the enrollment's start; never client-supplied. */
  week: number;
  value: number | string;
  notes?: string;

  /* Ownership */
  owner: Types.ObjectId;
}

const benchmarkResultSchema = new Schema<IBenchmarkResult>(
  {
    /* Data */
    benchmarkId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    week: {
      type: Number,
      required: true,
    },
    // A number or a string depending on the benchmark's unit.
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },

    /* Ownership */
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    /* References */
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: 'PlanEnrollment',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

benchmarkResultSchema.index({
  owner: 1,
  enrollment: 1,
  benchmarkId: 1,
  date: -1,
});

export const BenchmarkResult = model<IBenchmarkResult>(
  'BenchmarkResult',
  benchmarkResultSchema
);
