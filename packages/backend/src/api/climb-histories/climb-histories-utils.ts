import { MergeType } from 'mongoose';

import { IClimb } from '../../models/climb.ts';
import { IClimbHistory } from '../../models/climb-history.ts';
import { IImage } from '../../models/image.ts';
import { ILocation } from '../../models/location.ts';
import { ISector } from '../../models/sector.ts';
import { WithRequiredRefs } from '../../utils/types.ts';

/** Populated climb-history with all nested refs guaranteed non-null. */
type ValidClimbHistory = MergeType<
  IClimbHistory,
  {
    climb: WithRequiredRefs<IClimb>;
    location: ILocation;
    sector: MergeType<ISector, { images: IImage[] }>;
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

export { hasValidRefs };
export type { ValidClimbHistory };
