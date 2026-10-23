import { describe, expect, it } from 'vitest';

import { planEntryStatus } from './plan-entry-status.ts';

const START = '2026-10-26';
const ENTRY = {
  day: 3,
  slot: 'pm',
  sessionTemplateId: 'gym_b',
} as const;
const PLANNED = {
  enrollment: 'enrollment-1',
  sessionTemplateId: 'gym_b',
  week: 2,
  day: 3,
  slot: 'pm',
} as const;
// Week 2 Wednesday.
const ENTRY_DATE = '2026-11-04';

describe('planEntryStatus', () => {
  it('is done when a matching session has ended', () => {
    const sessions = [{ planned: PLANNED, endedAt: '2026-11-04T19:00:00Z' }];

    expect(
      planEntryStatus({
        entry: ENTRY,
        week: 2,
        startDate: START,
        today: '2026-11-10',
        sessions,
      })
    ).toBe('done');
  });

  it('is skipped when the date has passed without a matching session', () => {
    expect(
      planEntryStatus({
        entry: ENTRY,
        week: 2,
        startDate: START,
        today: '2026-11-05',
        sessions: [],
      })
    ).toBe('skipped');
  });

  it('is upcoming on its own date without a session', () => {
    expect(
      planEntryStatus({
        entry: ENTRY,
        week: 2,
        startDate: START,
        today: ENTRY_DATE,
        sessions: [],
      })
    ).toBe('upcoming');
  });

  it('ignores sessions planned for another week, day, slot or template', () => {
    const endedAt = '2026-11-04T19:00:00Z';
    const sessions = [
      { planned: { ...PLANNED, week: 3 }, endedAt },
      { planned: { ...PLANNED, day: 4 }, endedAt },
      { planned: { ...PLANNED, slot: 'am' as const }, endedAt },
      { planned: { ...PLANNED, sessionTemplateId: 'gym_a' }, endedAt },
      { endedAt },
    ];

    expect(
      planEntryStatus({
        entry: ENTRY,
        week: 2,
        startDate: START,
        today: '2026-11-05',
        sessions,
      })
    ).toBe('skipped');
  });

  it('is not skipped while a matching session is still running', () => {
    const sessions = [{ planned: PLANNED }];

    expect(
      planEntryStatus({
        entry: ENTRY,
        week: 2,
        startDate: START,
        today: '2026-11-05',
        sessions,
      })
    ).toBe('upcoming');
  });
});
