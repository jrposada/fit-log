import { SessionDbRecord } from './session-db-record';
import { WorkoutDbRecord } from './workout-db-record';

export type DbRecordType = WorkoutDbRecord['PK'] | SessionDbRecord['PK'];
export type DbRecord<TRecordType extends DbRecordType> = {
  PK: TRecordType;

  SK: `${TRecordType}#${string}`;

  /**
   * A timestamp in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  lastUpdated: string;
} & (WorkoutDbRecord | SessionDbRecord);
