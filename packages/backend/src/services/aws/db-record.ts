import { ClimbDbRecord } from './records/climb-db-record';
import { FavoriteWorkoutDbRecord } from './records/favorite-workout-db-record';
import { SessionDbRecord } from './records/session-db-record';
import { WorkoutDbRecord } from './records/workout-db-record';

export type DbRecordType =
  | ClimbDbRecord['PK']
  | FavoriteWorkoutDbRecord['PK']
  | SessionDbRecord['PK']
  | WorkoutDbRecord['PK'];

export type DbRecord<TRecordType extends DbRecordType> = {
  PK: TRecordType;

  SK: `${TRecordType}#${string}`;

  /**
   * A timestamp in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  updatedAt: string;
} & (
  | ClimbDbRecord
  | FavoriteWorkoutDbRecord
  | SessionDbRecord
  | WorkoutDbRecord
);
