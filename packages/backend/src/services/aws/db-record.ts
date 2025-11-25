import { ClimbDbRecord } from './records/climb-db-record';
import { FavoriteWorkoutDbRecord } from './records/favorite-workout-db-record';
import { LocationDbRecord } from './records/location-db-record';
import { SectorDbRecord } from './records/sector-db-record';
import { SessionDbRecord } from './records/session-db-record';
import { WorkoutDbRecord } from './records/workout-db-record';

export type DbRecordType =
  | ClimbDbRecord['PK']
  | FavoriteWorkoutDbRecord['PK']
  | LocationDbRecord['PK']
  | SectorDbRecord['PK']
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
  | LocationDbRecord
  | SectorDbRecord
  | SessionDbRecord
  | WorkoutDbRecord
);
