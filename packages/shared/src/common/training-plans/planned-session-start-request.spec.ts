import { describe, expect, it } from 'vitest';

import { loadSeedTrainingPlan } from '../../test-utils/seed-training-plan.ts';
import { plannedSessionStartRequest } from './planned-session-start-request.ts';

const plan = loadSeedTrainingPlan();
const NOW = new Date('2026-10-28T18:30:00.000Z');

function templateOf(id: string) {
  return plan.sessionTemplates.find((template) => template.id === id)!;
}

describe('plannedSessionStartRequest', () => {
  it('starts a gym session for a gym template', () => {
    const planned = {
      enrollment: 'enrollment-1',
      sessionTemplateId: 'gym_a_b1',
      week: 1,
      day: 3,
      slot: 'am',
    } as const;

    expect(
      plannedSessionStartRequest(templateOf('gym_a_b1'), planned, NOW)
    ).toEqual({
      sport: 'gym',
      title: 'Gym A: push + legs',
      startedAt: NOW.toUTCString(),
      location: null,
      climbHistories: [],
      planned,
      itemLogs: [],
    });
  });

  it('starts a climbing session for a climb template', () => {
    expect(
      plannedSessionStartRequest(
        templateOf('b1_mon_technique_arc'),
        {
          enrollment: 'enrollment-1',
          sessionTemplateId: 'b1_mon_technique_arc',
          week: 1,
          day: 1,
          slot: 'pm',
        },
        NOW
      ).sport
    ).toBe('climbing');
  });
});
