import { WorkoutDbRecord } from './workout-db-record';

export type DbRecordType = 'workout';
export type DbRecord<TRecordType extends DbRecordType> = {
  PK: TRecordType;

  SK: `${TRecordType}#${string}`;

  /**
   * A timestamp in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  lastUpdated: string;
} & WorkoutDbRecord;
