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
};
