import type { MergeType } from 'mongoose';

import type { IClimb } from '../../models/climb.ts';
import type { IClimbHistory } from '../../models/climb-history.ts';
import type { IImage } from '../../models/image.ts';
import type { ILocation } from '../../models/location.ts';
import type { ISector } from '../../models/sector.ts';
import type { WithRequiredRefs } from '../../utils/types.ts';

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
