import { collaboratorDeleteParamsSchema } from '@shared/models/auth/collaborator-delete';
import {
  collaboratorPutParamsSchema,
  collaboratorPutRequestSchema,
} from '@shared/models/auth/collaborator-put';
import { climbsDeleteParamsSchema } from '@shared/models/climb/climb-delete';
import { climbsGetQuerySchema } from '@shared/models/climb/climb-get';
import { climbsGetByIdParamsSchema } from '@shared/models/climb/climb-get-by-id';
import { climbsPutRequestSchema } from '@shared/models/climb/climb-put';
import { climbsSearchQuerySchema } from '@shared/models/climb/climb-search';
import {
  climbHistoriesDeleteParamsSchema,
  climbHistoriesDeleteQuerySchema,
} from '@shared/models/climb-history/climb-history-delete';
import { climbHistoriesGetQuerySchema } from '@shared/models/climb-history/climb-history-get';
import { climbHistoriesGetByIdParamsSchema } from '@shared/models/climb-history/climb-history-get-by-id';
import { climbHistoryProjectRequestSchema } from '@shared/models/climb-history/climb-history-project';
import { climbHistoriesPutRequestSchema } from '@shared/models/climb-history/climb-history-put';
import { imagesDeleteParamsSchema } from '@shared/models/image/image-delete';
import { imagesPostRequestSchema } from '@shared/models/image/image-post';
import { locationsDeleteParamsSchema } from '@shared/models/location/location-delete';
import { locationsGetQuerySchema } from '@shared/models/location/location-get';
import { locationsGetByIdParamsSchema } from '@shared/models/location/location-get-by-id';
import { locationsPutRequestSchema } from '@shared/models/location/location-put';
import { models3dDeleteParamsSchema } from '@shared/models/model3d/model3d-delete';
import { sectorsBatchDeleteRequestSchema } from '@shared/models/sector/sector-batch-delete';
import { sectorsBatchPutRequestSchema } from '@shared/models/sector/sector-batch-put';
import { sectorsDeleteParamsSchema } from '@shared/models/sector/sector-delete';
import { sectorsPutRequestSchema } from '@shared/models/sector/sector-put';
import { sessionsDeleteParamsSchema } from '@shared/models/session/session-delete';
import { sessionsGetQuerySchema } from '@shared/models/session/session-get';
import { sessionsGetByIdParamsSchema } from '@shared/models/session/session-get-by-id';
import { sessionsPutRequestSchema } from '@shared/models/session/session-put';
import { workoutsDeleteParamsSchema } from '@shared/models/workout/workout-delete';
import { workoutsGetQuerySchema } from '@shared/models/workout/workout-get';
import { workoutsGetByIdParamsSchema } from '@shared/models/workout/workout-get-by-id';
import { workoutsPutRequestSchema } from '@shared/models/workout/workout-put';
import { Router } from 'express';

import { handler as climbHistoriesDelete } from './api/climb-histories/climb-histories-delete';
import { handler as climbHistoriesGet } from './api/climb-histories/climb-histories-get';
import { handler as climbHistoriesGetById } from './api/climb-histories/climb-histories-get-by-id';
import { handler as climbHistoriesProject } from './api/climb-histories/climb-histories-project';
import { handler as climbHistoriesPut } from './api/climb-histories/climb-histories-put';
import { handler as climbsCollaboratorsDelete } from './api/climbs/climbs-collaborators-delete';
import { handler as climbsCollaboratorsPut } from './api/climbs/climbs-collaborators-put';
import { handler as climbsDelete } from './api/climbs/climbs-delete';
import { handler as climbsGet } from './api/climbs/climbs-get';
import { handler as climbsGetById } from './api/climbs/climbs-get-by-id';
import { handler as climbsPut } from './api/climbs/climbs-put';
import { handler as climbsSearch } from './api/climbs/climbs-search';
import { handler as imagesCollaboratorsDelete } from './api/images/images-collaborators-delete';
import { handler as imagesCollaboratorsPut } from './api/images/images-collaborators-put';
import { handler as imagesDelete } from './api/images/images-delete';
import { handler as imagesPost } from './api/images/images-post';
import { handler as locationsCollaboratorsDelete } from './api/locations/locations-collaborators-delete';
import { handler as locationsCollaboratorsPut } from './api/locations/locations-collaborators-put';
import { handler as locationsDelete } from './api/locations/locations-delete';
import { handler as locationsGet } from './api/locations/locations-get';
import { handler as locationsGetById } from './api/locations/locations-get-by-id';
import { handler as locationsPut } from './api/locations/locations-put';
import { handler as meGet } from './api/me/me-get';
import { handler as models3dCollaboratorsDelete } from './api/models3d/models3d-collaborators-delete';
import { handler as models3dCollaboratorsPut } from './api/models3d/models3d-collaborators-put';
import { handler as models3dDelete } from './api/models3d/models3d-delete';
import { handler as sectorsBatchDelete } from './api/sectors/sectors-batch-delete';
import { handler as sectorsBatchPut } from './api/sectors/sectors-batch-put';
import { handler as sectorsCollaboratorsDelete } from './api/sectors/sectors-collaborators-delete';
import { handler as sectorsCollaboratorsPut } from './api/sectors/sectors-collaborators-put';
import { handler as sectorsDelete } from './api/sectors/sectors-delete';
import { handler as sectorsPut } from './api/sectors/sectors-put';
import { handler as sessionsDelete } from './api/sessions/sessions-delete';
import { handler as sessionsGet } from './api/sessions/sessions-get';
import { handler as sessionsGetById } from './api/sessions/sessions-get-by-id';
import { handler as sessionsPut } from './api/sessions/sessions-put';
import { handler as versionGet } from './api/version/version-get';
import { handler as workoutsDelete } from './api/workouts/workouts-delete';
import { handler as workoutsGet } from './api/workouts/workouts-get';
import { handler as workoutsGetById } from './api/workouts/workouts-get-by-id';
import { handler as workoutsPut } from './api/workouts/workouts-put';
import { authenticateKeycloak } from './middleware/auth';
import { validateBody } from './middleware/validate-body';
import { validateParams } from './middleware/validate-params';
import { validateQuery } from './middleware/validate-query';

export const router = Router();

// Version
router.get('/version', versionGet);

// Me
router.get('/me', authenticateKeycloak, meGet);

// Workouts
router.get(
  '/workouts',
  authenticateKeycloak,
  validateQuery(workoutsGetQuerySchema),
  workoutsGet
);
router.get(
  '/workouts/:id',
  authenticateKeycloak,
  validateParams(workoutsGetByIdParamsSchema),
  workoutsGetById
);
router.put(
  '/workouts',
  authenticateKeycloak,
  validateBody(workoutsPutRequestSchema),
  workoutsPut
);
router.delete(
  '/workouts/:id',
  authenticateKeycloak,
  validateParams(workoutsDeleteParamsSchema),
  workoutsDelete
);

// Sessions
router.get(
  '/sessions',
  authenticateKeycloak,
  validateQuery(sessionsGetQuerySchema),
  sessionsGet
);
router.get(
  '/sessions/:id',
  authenticateKeycloak,
  validateParams(sessionsGetByIdParamsSchema),
  sessionsGetById
);
router.put(
  '/sessions',
  authenticateKeycloak,
  validateBody(sessionsPutRequestSchema),
  sessionsPut
);
router.delete(
  '/sessions/:id',
  authenticateKeycloak,
  validateParams(sessionsDeleteParamsSchema),
  sessionsDelete
);

// Locations
router.get(
  '/locations',
  authenticateKeycloak,
  validateQuery(locationsGetQuerySchema),
  locationsGet
);
router.get(
  '/locations/:id',
  authenticateKeycloak,
  validateParams(locationsGetByIdParamsSchema),
  locationsGetById
);
router.put(
  '/locations',
  authenticateKeycloak,
  validateBody(locationsPutRequestSchema),
  locationsPut
);
router.delete(
  '/locations/:id',
  authenticateKeycloak,
  validateParams(locationsDeleteParamsSchema),
  locationsDelete
);
router.put(
  '/locations/:id/collaborators/:userId',
  authenticateKeycloak,
  validateParams(collaboratorPutParamsSchema),
  validateBody(collaboratorPutRequestSchema),
  locationsCollaboratorsPut
);
router.delete(
  '/locations/:id/collaborators/:userId',
  authenticateKeycloak,
  validateParams(collaboratorDeleteParamsSchema),
  locationsCollaboratorsDelete
);

// Sectors
router.put(
  '/sectors',
  authenticateKeycloak,
  validateBody(sectorsPutRequestSchema),
  sectorsPut
);
router.put(
  '/sectors/batch',
  authenticateKeycloak,
  validateBody(sectorsBatchPutRequestSchema),
  sectorsBatchPut
);
router.delete(
  '/sectors/:id',
  authenticateKeycloak,
  validateParams(sectorsDeleteParamsSchema),
  sectorsDelete
);
router.delete(
  '/sectors',
  authenticateKeycloak,
  validateBody(sectorsBatchDeleteRequestSchema),
  sectorsBatchDelete
);
router.put(
  '/sectors/:id/collaborators/:userId',
  authenticateKeycloak,
  validateParams(collaboratorPutParamsSchema),
  validateBody(collaboratorPutRequestSchema),
  sectorsCollaboratorsPut
);
router.delete(
  '/sectors/:id/collaborators/:userId',
  authenticateKeycloak,
  validateParams(collaboratorDeleteParamsSchema),
  sectorsCollaboratorsDelete
);

// Models3D
router.delete(
  '/models3d/:id',
  authenticateKeycloak,
  validateParams(models3dDeleteParamsSchema),
  models3dDelete
);
router.put(
  '/models3d/:id/collaborators/:userId',
  authenticateKeycloak,
  validateParams(collaboratorPutParamsSchema),
  validateBody(collaboratorPutRequestSchema),
  models3dCollaboratorsPut
);
router.delete(
  '/models3d/:id/collaborators/:userId',
  authenticateKeycloak,
  validateParams(collaboratorDeleteParamsSchema),
  models3dCollaboratorsDelete
);

// Images
router.post(
  '/images',
  authenticateKeycloak,
  validateBody(imagesPostRequestSchema),
  imagesPost
);
router.delete(
  '/images/:id',
  authenticateKeycloak,
  validateParams(imagesDeleteParamsSchema),
  imagesDelete
);
router.put(
  '/images/:id/collaborators/:userId',
  authenticateKeycloak,
  validateParams(collaboratorPutParamsSchema),
  validateBody(collaboratorPutRequestSchema),
  imagesCollaboratorsPut
);
router.delete(
  '/images/:id/collaborators/:userId',
  authenticateKeycloak,
  validateParams(collaboratorDeleteParamsSchema),
  imagesCollaboratorsDelete
);

// Climbs
router.get(
  '/climbs',
  authenticateKeycloak,
  validateQuery(climbsGetQuerySchema),
  climbsGet
);
router.get(
  '/climbs/search',
  authenticateKeycloak,
  validateQuery(climbsSearchQuerySchema),
  climbsSearch
);
router.get(
  '/climbs/:id',
  authenticateKeycloak,
  validateParams(climbsGetByIdParamsSchema),
  climbsGetById
);
router.put(
  '/climbs',
  authenticateKeycloak,
  validateBody(climbsPutRequestSchema),
  climbsPut
);
router.delete(
  '/climbs/:id',
  authenticateKeycloak,
  validateParams(climbsDeleteParamsSchema),
  climbsDelete
);
router.put(
  '/climbs/:id/collaborators/:userId',
  authenticateKeycloak,
  validateParams(collaboratorPutParamsSchema),
  validateBody(collaboratorPutRequestSchema),
  climbsCollaboratorsPut
);
router.delete(
  '/climbs/:id/collaborators/:userId',
  authenticateKeycloak,
  validateParams(collaboratorDeleteParamsSchema),
  climbsCollaboratorsDelete
);

// Climb Histories
router.get(
  '/climb-histories',
  authenticateKeycloak,
  validateQuery(climbHistoriesGetQuerySchema),
  climbHistoriesGet
);
router.get(
  '/climb-histories/:id',
  authenticateKeycloak,
  validateParams(climbHistoriesGetByIdParamsSchema),
  climbHistoriesGetById
);
router.put(
  '/climb-histories',
  authenticateKeycloak,
  validateBody(climbHistoriesPutRequestSchema),
  climbHistoriesPut
);
router.put(
  '/climb-histories/project',
  authenticateKeycloak,
  validateBody(climbHistoryProjectRequestSchema),
  climbHistoriesProject
);
router.delete(
  '/climb-histories/:id',
  authenticateKeycloak,
  validateParams(climbHistoriesDeleteParamsSchema),
  validateQuery(climbHistoriesDeleteQuerySchema),
  climbHistoriesDelete
);
