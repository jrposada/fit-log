export type SessionDbRecord = {
  PK: 'session';

  /** workout#<user-id>#<workout-id>#{session-id} */
  SK: `session#${string}#${string}#${string}`;

  /**
   * A timestamp in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  completedAt: string;

  /**
   * Workout name when this session was logged.
   */
  workoutName: string;
  /**
   * Workout description when this session was logged.
   */
  workoutDescription: string;
};
