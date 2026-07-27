import { GRADE_OPTIONS } from '@jrposada/fit-log-shared/common/climbs/grades';
import type { SessionSummaryData } from '@jrposada/fit-log-shared/models/feed/feed';
import type { Types } from 'mongoose';

import type { IClimb } from '../../../models/climb.ts';
import type { ClimbHistoryStatus } from '../../../models/climb-history.ts';
import { ClimbHistory } from '../../../models/climb-history.ts';
import {
  ClimbingSession,
  EMPTY_CLIMBING_SESSION_SUMMARY,
} from '../../../models/climbing-session.ts';

const GRADES: string[] = [...GRADE_OPTIONS];

function computeClimbingSessionSummary(
  histories: { status: ClimbHistoryStatus; climb: IClimb | null }[]
): SessionSummaryData {
  const count = histories.length;
  if (count === 0) {
    return { ...EMPTY_CLIMBING_SESSION_SUMMARY };
  }

  // Hardest *sent* grade; only grades present in GRADE_OPTIONS are
  // reportable (ordered slots), mirroring climb-histories-stats.
  let hardestGradeIndex = -1;
  for (const history of histories) {
    if (history.status !== 'send' && history.status !== 'flash') {
      continue;
    }
    const gradeIndex = history.climb ? GRADES.indexOf(history.climb.grade) : -1;
    if (gradeIndex > hardestGradeIndex) {
      hardestGradeIndex = gradeIndex;
    }
  }
  const hardestGrade = GRADES[hardestGradeIndex];

  return {
    headline: `${count} route${count === 1 ? '' : 's'}`,
    count,
    ...(hardestGrade
      ? { metric: { label: 'hardest', value: hardestGrade } }
      : {}),
  };
}

/**
 * Recomputes the denormalized `summary` cache on a climbing session from its
 * climb histories. Must run after every write that touches the session's
 * derived data (try add/edit/remove, history delete), mirroring the
 * `computeTopStatus`-on-every-write pattern one level up.
 */
async function recomputeClimbingSessionSummary(
  sessionId: Types.ObjectId | string
): Promise<void> {
  const histories = await ClimbHistory.find({
    climbingSession: sessionId,
  }).populate<{ climb: IClimb | null }>('climb');

  const summary = computeClimbingSessionSummary(histories);

  await ClimbingSession.updateOne({ _id: sessionId }, { $set: { summary } });
}

export { computeClimbingSessionSummary, recomputeClimbingSessionSummary };
