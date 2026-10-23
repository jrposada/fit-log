import z from 'zod';

import { SPORTS } from '../../common/sports/sports.ts';
import { TRAINING_PLAN_SLOTS } from '../training-plans/training-plan.ts';
import {
  TRAINING_SESSION_ITEM_LOG_STATUSES,
  TrainingSession,
  TrainingSessionItemLog,
} from './training-session.ts';

export type TrainingSessionsPutRequest = Omit<
  TrainingSession,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'owner'
  | 'location'
  | 'climbHistories'
  | 'currentClimb'
  | 'itemLogs'
> & {
  id?: string;

  currentClimb?: string;
  location: string | null;
  climbHistories: string[];
  /** Defaults to `[]`. */
  itemLogs?: TrainingSessionItemLog[];
};

const itemLogSetSchema = z.object({
  reps: z.number().int().nonnegative().optional(),
  weightKg: z.number().optional(),
  holdS: z.number().nonnegative().optional(),
  durationMin: z.number().nonnegative().optional(),
  rpe: z.number().min(0).max(10).optional(),
});

export const trainingSessionsPutRequestSchema = z.object({
  id: z.string().optional(),
  sport: z.enum(SPORTS),
  title: z.string().nonempty(),
  notes: z.string().optional(),
  startedAt: z.string().nonempty(),
  endedAt: z.string().nonempty().optional(),
  lastActivityAt: z.string().nonempty().optional(),
  planned: z
    .object({
      enrollment: z.string().nonempty(),
      sessionTemplateId: z.string().nonempty(),
      week: z.number().int().positive(),
      day: z.number().int().min(1).max(7),
      slot: z.enum(TRAINING_PLAN_SLOTS),
    })
    .optional(),
  itemLogs: z
    .array(
      z.object({
        itemOrder: z.number().int(),
        exerciseId: z.string().nonempty(),
        status: z.enum(TRAINING_SESSION_ITEM_LOG_STATUSES),
        notes: z.string().optional(),
        sets: z.array(itemLogSetSchema),
      })
    )
    .optional(),
  currentClimb: z.string().nonempty().optional(),
  location: z.string().nonempty().nullable(),
  climbHistories: z.array(z.string().nonempty()),
});

export type TrainingSessionsPutResponse = {
  trainingSession: TrainingSession;
};
