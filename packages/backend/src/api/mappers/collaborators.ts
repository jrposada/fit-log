import type {
  Collaborator,
  DepopulatedCollaborator,
} from '@jrposada/fit-log-shared/models/auth/with-ownership';

import type { WithPopulatedRefs } from '../../data/infrastructure/with-populated-refs.ts';
import type { WithRequiredRefs } from '../../data/infrastructure/with-required-refs.ts';
import type {
  CollaboratorRequiredRefs,
  ICollaborator,
} from '../../data/models/_collaborator.ts';
import { toApiUserSummary } from './user-summary.ts';

export function toApiDepopulatedCollaborator(
  model: WithRequiredRefs<ICollaborator, CollaboratorRequiredRefs>
): DepopulatedCollaborator {
  return {
    user: model.user._id.toString(),
    permission: model.permission,
  };
}

export function toApiCollaborator(
  model: WithPopulatedRefs<
    WithRequiredRefs<ICollaborator, CollaboratorRequiredRefs>,
    CollaboratorRequiredRefs
  >
): Collaborator {
  return {
    user: toApiUserSummary(model.user),
    permission: model.permission,
  };
}
