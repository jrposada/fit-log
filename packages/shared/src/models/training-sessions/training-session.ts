import { Sport } from '../../common/sports/sports.ts';
import { WithDepopulatedOwnership } from '../auth/with-ownership.ts';
import { ClimbHistory } from '../climb-histories/climb-history.ts';
import { Climb } from '../climbs/climb.ts';
import { Location } from '../locations/location.ts';
import { TrainingPlanSlot } from '../training-plans/training-plan.ts';
import { WithTimestamps } from '../utils/with-timestamps.ts';

/** A session with no activity for this long is considered stale — the next
 * write starts a fresh session rather than resuming it. */
export const SESSION_STALE_MS = 4 * 60 * 60 * 1000;

/** The plan schedule entry a session was started from. */
export type TrainingSessionPlanned = {
  enrollment: string;
  sessionTemplateId: string;
  week: number;
  /** ISO weekday, 1 = Monday. */
  day: number;
  slot: TrainingPlanSlot;
};

export const TRAINING_SESSION_ITEM_LOG_STATUSES = ['done', 'skipped'] as const;
export type TrainingSessionItemLogStatus =
  (typeof TRAINING_SESSION_ITEM_LOG_STATUSES)[number];

export type TrainingSessionItemLogSet = {
  reps?: number;
  weightKg?: number;
  holdS?: number;
  durationMin?: number;
  rpe?: number;
};

/** What was done for one item of the planned session's template. */
export type TrainingSessionItemLog = {
  itemOrder: number;
  exerciseId: string;
  status: TrainingSessionItemLogStatus;
  notes?: string;
  sets: TrainingSessionItemLogSet[];
};

export type TrainingSession = WithTimestamps<{
  /* Data */
  id: string;
  sport: Sport;
  title: string;
  notes?: string;
  startedAt: string;
  endedAt?: string;
  lastActivityAt?: string;
  planned?: TrainingSessionPlanned;
  itemLogs: TrainingSessionItemLog[];

  /* Ownership */
  owner: string;

  /* References */

  currentClimb?: Omit<
    WithDepopulatedOwnership<Climb>,
    'image' | 'location' | 'sector' | 'model3d'
  > & {
    image: string | null;
    location: string;
    sector: string;
    model3d: string | null;
  };
  location?: Omit<WithDepopulatedOwnership<Location>, 'sectors'> & {
    sectors: string[];
  };
  climbHistories: (Omit<
    ClimbHistory,
    'climb' | 'location' | 'sector' | 'trainingSession'
  > & {
    climb: string;
    location: string;
    sector: string;
  })[];
}>;
