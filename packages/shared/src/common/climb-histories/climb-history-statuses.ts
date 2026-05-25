export const CLIMB_HISTORY_STATUSES = ['send', 'flash', 'attempt'] as const;
export type ClimbHistoryStatus = (typeof CLIMB_HISTORY_STATUSES)[number];

export const CLIMB_HISTORY_QUERY_STATUSES = [
  ...CLIMB_HISTORY_STATUSES,
  'project',
] as const;
