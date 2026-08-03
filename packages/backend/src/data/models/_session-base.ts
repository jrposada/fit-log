import type { SessionSummaryData } from '@jrposada/fit-log-shared/models/feed/feed';
import type { SchemaDefinition, Types } from 'mongoose';
import { Schema } from 'mongoose';

export type { SessionSummaryData };

export const sessionSummarySchema = new Schema<SessionSummaryData>(
  {
    headline: {
      type: String,
      required: true,
    },
    metric: {
      type: new Schema<NonNullable<SessionSummaryData['metric']>>(
        {
          label: {
            type: String,
            required: true,
          },
          value: {
            type: String,
            required: true,
          },
        },
        { _id: false }
      ),
      required: false,
    },
    count: {
      type: Number,
      required: false,
    },
  },
  { _id: false }
);

/**
 * Marker interface for the per-sport session contract: the shared base
 * fields every sport's session entity must carry on top of its
 * sport-specific fields. `sport` is intentionally not part of the fragment —
 * each collection declares it as its own constant enum value.
 * Combine with `WithTimestamps<Document>`:
 *   interface ITrainingSession extends WithTimestamps<Document>, WithSessionBase { ... }
 */
export interface WithSessionBase {
  /* Data */
  title: string;
  notes?: string;
  startedAt: Date;
  endedAt?: Date;
  /** Denormalized cache, recomputed by the owning sport package on every
   * write that touches the session's derived data. Never authoritative. */
  summary: SessionSummaryData;

  /* Ownership */
  owner: Types.ObjectId;

  /* References */
  location: Types.ObjectId | null;
}

/**
 * Schema field definitions for `WithSessionBase`. Spread into a session
 * model's schema definition object:
 *   new Schema<ITrainingSession>({ ...sessionBaseFields, sport: { ... }, ... });
 */
export const sessionBaseFields: SchemaDefinition<WithSessionBase> = {
  /* Data */
  title: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  startedAt: {
    type: Date,
    required: true,
  },
  endedAt: {
    type: Date,
    required: false,
  },
  summary: {
    type: sessionSummarySchema,
    required: true,
  },

  /* Ownership */
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  /* References */
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: false,
    default: null,
  },
};
