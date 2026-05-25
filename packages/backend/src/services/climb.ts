import type { IClimb } from '../models/climb.ts';
import type { WithRequiredRefs } from '../utils/types.ts';

function hasRequiredRefs(model: IClimb): model is WithRequiredRefs<IClimb> {
  return model.image != null && model.location != null && model.sector != null;
}

export { hasRequiredRefs };
