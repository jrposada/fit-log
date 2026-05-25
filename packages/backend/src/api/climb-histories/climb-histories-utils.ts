import type { MergeType, Types } from 'mongoose';

import type { IClimb } from '../../models/climb.ts';
import type { IClimbHistory } from '../../models/climb-history.ts';
import type { IImage } from '../../models/image.ts';
import type { ILocation } from '../../models/location.ts';
import type { ISector } from '../../models/sector.ts';
import type { ITrainingSession } from '../../models/training-session.ts';
import type { WithRequiredRefs } from '../../utils/types.ts';

/** Direct refs on a climb-history that must be non-null to map. */
type ValidClimbHistoryRefs = {
  climb: Types.ObjectId;
  location: Types.ObjectId;
  sector: Types.ObjectId;
};

/** Populated climb-history with all nested refs guaranteed non-null. */
type ValidClimbHistory = MergeType<
  IClimbHistory,
  {
    climb: WithRequiredRefs<IClimb>;
    location: ILocation;
    sector: MergeType<ISector, { images: IImage[] }>;
    trainingSession: ITrainingSession | null;
  }
>;

/**
 * Type guard that checks the populated climb-history has a non-null climb
 * whose own refs (image, location, sector) are also non-null.
 */
function hasValidRefs<T extends { climb: IClimb | null }>(
  h: T
): h is T & { climb: WithRequiredRefs<IClimb> } {
  return (
    h.climb != null &&
    h.climb.image != null &&
    h.climb.location != null &&
    h.climb.sector != null
  );
}

/**
 * Type guard for a climb-history with non-null direct refs (climb, location,
 * sector as ObjectIds). Use when nested fields don't need to be populated.
 */
function hasRequiredClimbHistoryRefs<T extends IClimbHistory>(
  h: T
): h is T & ValidClimbHistoryRefs {
  return h.climb != null && h.location != null && h.sector != null;
}

export { hasRequiredClimbHistoryRefs, hasValidRefs };
export type { ValidClimbHistory, ValidClimbHistoryRefs };
