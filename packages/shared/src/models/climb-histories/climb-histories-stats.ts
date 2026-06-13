import z from 'zod';

import { ClimbGrade } from '../../common/climbs/grades.ts';

export const CLIMB_HISTORIES_STATS_GRANULARITIES = ['week', 'month'] as const;
export type ClimbHistoriesStatsGranularity =
  (typeof CLIMB_HISTORIES_STATS_GRANULARITIES)[number];

export type ClimbHistoriesStatsQuery = {
  locationId?: string;
  sectorId?: string;
  startDate?: string;
  endDate?: string;
  granularity?: ClimbHistoriesStatsGranularity;
};

export const climbHistoriesStatsQuerySchema = z.object({
  locationId: z.string().optional(),
  sectorId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  granularity: z.enum(CLIMB_HISTORIES_STATS_GRANULARITIES).optional(),
});

export type ClimbHistoriesStatsSummary = {
  totalClimbs: number;
  sends: number;
  flashes: number;
  projects: number;
  totalAttempts: number;
  hardestGrade: ClimbGrade | null;
};

export type ClimbHistoriesStatsGradeDistributionEntry = {
  grade: ClimbGrade;
  sends: number;
  attempts: number;
};

export type ClimbHistoriesStatsActivityEntry = {
  period: string;
  climbs: number;
  sends: number;
};

export type ClimbHistoriesStatsProgressionEntry = {
  period: string;
  hardestGrade: ClimbGrade | null;
  /**
   * Mean `GRADE_OPTIONS` index of the grades *sent* in this period (fractional,
   * e.g. 8.5). Non-cumulative, so it rises and falls per period. `null` when no
   * gradeable send happened in the period.
   */
  avgGradeIndex: number | null;
};

export type ClimbHistoriesStatsSessions = {
  total: number;
  avgClimbsPerSession: number;
  avgDurationMinutes: number | null;
};

export type ClimbHistoriesStatsResponse = {
  summary: ClimbHistoriesStatsSummary;
  gradeDistribution: ClimbHistoriesStatsGradeDistributionEntry[];
  activity: ClimbHistoriesStatsActivityEntry[];
  progression: ClimbHistoriesStatsProgressionEntry[];
  sessions: ClimbHistoriesStatsSessions;
};
