import { describe, expect, it } from 'vitest';

import { TrainingSession } from '../../models/training-sessions/training-session.ts';
import { toTrainingSessionsPutRequest } from './to-training-sessions-put-request.ts';

const BASE = {
  id: 'session-1',
  sport: 'climbing',
  title: 'Technique + ARC',
  startedAt: '2026-10-26T18:00:00.000Z',
  owner: 'user-1',
  createdAt: '2026-10-26T18:00:00.000Z',
  updatedAt: '2026-10-26T18:00:00.000Z',
  planned: {
    enrollment: 'enrollment-1',
    sessionTemplateId: 'b1_mon_technique_arc',
    week: 1,
    day: 1,
    slot: 'pm',
  },
  itemLogs: [
    { itemOrder: 5, exerciseId: 'hollow_body_hold', status: 'done', sets: [] },
  ],
  climbHistories: [],
} satisfies TrainingSession;

describe('toTrainingSessionsPutRequest', () => {
  it('keeps planned and item logs and depopulates references', () => {
    const session = {
      ...BASE,
      location: { id: 'location-1' },
      currentClimb: { id: 'climb-1' },
      climbHistories: [{ id: 'history-1' }, { id: 'history-2' }],
    } as unknown as TrainingSession;

    expect(toTrainingSessionsPutRequest(session)).toMatchObject({
      id: 'session-1',
      planned: BASE.planned,
      itemLogs: BASE.itemLogs,
      location: 'location-1',
      currentClimb: 'climb-1',
      climbHistories: ['history-1', 'history-2'],
    });
  });

  it('sends a null location and no current climb when unset', () => {
    const request = toTrainingSessionsPutRequest(BASE);

    expect(request.location).toBeNull();
    expect(request.currentClimb).toBeUndefined();
  });
});
