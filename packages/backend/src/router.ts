import { collaboratorDeleteParamsSchema } from '@jrposada/fit-log-shared/models/auth/collaborator-delete';
import {
  collaboratorPutParamsSchema,
  collaboratorPutRequestSchema,
} from '@jrposada/fit-log-shared/models/auth/collaborator-put';
import {
  climbHistoriesDeleteParamsSchema,
  climbHistoriesDeleteQuerySchema,
} from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-delete';
import { climbHistoriesGetQuerySchema } from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-get';
import { climbHistoriesGetByIdParamsSchema } from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-get-by-id';
import { climbHistoryProjectRequestSchema } from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-project';
import { climbHistoriesPutRequestSchema } from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-put';
import { climbsDeleteParamsSchema } from '@jrposada/fit-log-shared/models/climbs/climbs-delete';
import { climbsGetQuerySchema } from '@jrposada/fit-log-shared/models/climbs/climbs-get';
import { climbsGetByIdParamsSchema } from '@jrposada/fit-log-shared/models/climbs/climbs-get-by-id';
import { climbsPutRequestSchema } from '@jrposada/fit-log-shared/models/climbs/climbs-put';
import { climbsSearchQuerySchema } from '@jrposada/fit-log-shared/models/climbs/climbs-search';
import { imagesDeleteParamsSchema } from '@jrposada/fit-log-shared/models/images/images-delete';
import { imagesPostRequestSchema } from '@jrposada/fit-log-shared/models/images/images-post';
import { locationsDeleteParamsSchema } from '@jrposada/fit-log-shared/models/locations/locations-delete';
import { locationsGetQuerySchema } from '@jrposada/fit-log-shared/models/locations/locations-get';
import { locationsGetByIdParamsSchema } from '@jrposada/fit-log-shared/models/locations/locations-get-by-id';
import { locationsPutRequestSchema } from '@jrposada/fit-log-shared/models/locations/locations-put';
import { sectorsBatchDeleteRequestSchema } from '@jrposada/fit-log-shared/models/sectors/sectors-batch-delete';
import { sectorsBatchPutRequestSchema } from '@jrposada/fit-log-shared/models/sectors/sectors-batch-put';
import { sectorsDeleteParamsSchema } from '@jrposada/fit-log-shared/models/sectors/sectors-delete';
import { sectorsPutRequestSchema } from '@jrposada/fit-log-shared/models/sectors/sectors-put';
import { sessionsDeleteParamsSchema } from '@jrposada/fit-log-shared/models/sessions/sessions-delete';
import { sessionsGetQuerySchema } from '@jrposada/fit-log-shared/models/sessions/sessions-get';
import { sessionsGetByIdParamsSchema } from '@jrposada/fit-log-shared/models/sessions/sessions-get-by-id';
import { sessionsPutRequestSchema } from '@jrposada/fit-log-shared/models/sessions/sessions-put';
import { workoutsDeleteParamsSchema } from '@jrposada/fit-log-shared/models/workout/workout-delete';
import { workoutsGetQuerySchema } from '@jrposada/fit-log-shared/models/workout/workout-get';
import { workoutsGetByIdParamsSchema } from '@jrposada/fit-log-shared/models/workout/workout-get-by-id';
import { workoutsPutRequestSchema } from '@jrposada/fit-log-shared/models/workout/workout-put';
import { Router } from 'express';

import { handler as climbHistoriesDelete } from './api/climb-histories/climb-histories-delete.ts';
import { handler as climbHistoriesGet } from './api/climb-histories/climb-histories-get.ts';
import { handler as climbHistoriesGetById } from './api/climb-histories/climb-histories-get-by-id.ts';
import { handler as climbHistoriesProject } from './api/climb-histories/climb-histories-project.ts';
import { handler as climbHistoriesPut } from './api/climb-histories/climb-histories-put.ts';
import { handler as climbsCollaboratorsDelete } from './api/climbs/climbs-collaborators-delete.ts';
import { handler as climbsCollaboratorsPut } from './api/climbs/climbs-collaborators-put.ts';
import { handler as climbsDelete } from './api/climbs/climbs-delete.ts';
import { handler as climbsGet } from './api/climbs/climbs-get.ts';
import { handler as climbsGetById } from './api/climbs/climbs-get-by-id.ts';
import { handler as climbsPut } from './api/climbs/climbs-put.ts';
import { handler as climbsSearch } from './api/climbs/climbs-search.ts';
import { handler as imagesCollaboratorsDelete } from './api/images/images-collaborators-delete.ts';
import { handler as imagesCollaboratorsPut } from './api/images/images-collaborators-put.ts';
import { handler as imagesDelete } from './api/images/images-delete.ts';
import { handler as imagesPost } from './api/images/images-post.ts';
import { handler as locationsCollaboratorsDelete } from './api/locations/locations-collaborators-delete.ts';
import { handler as locationsCollaboratorsPut } from './api/locations/locations-collaborators-put.ts';
import { handler as locationsDelete } from './api/locations/locations-delete.ts';
import { handler as locationsGet } from './api/locations/locations-get.ts';
import { handler as locationsGetById } from './api/locations/locations-get-by-id.ts';
import { handler as locationsPut } from './api/locations/locations-put.ts';
import { handler as meGet } from './api/me/me-get.ts';
import { handler as sectorsBatchDelete } from './api/sectors/sectors-batch-delete.ts';
import { handler as sectorsBatchPut } from './api/sectors/sectors-batch-put.ts';
import { handler as sectorsCollaboratorsDelete } from './api/sectors/sectors-collaborators-delete.ts';
import { handler as sectorsCollaboratorsPut } from './api/sectors/sectors-collaborators-put.ts';
import { handler as sectorsDelete } from './api/sectors/sectors-delete.ts';
import { handler as sectorsPut } from './api/sectors/sectors-put.ts';
import { handler as sessionsDelete } from './api/sessions/sessions-delete.ts';
import { handler as sessionsGet } from './api/sessions/sessions-get.ts';
import { handler as sessionsGetById } from './api/sessions/sessions-get-by-id.ts';
import { handler as sessionsPut } from './api/sessions/sessions-put.ts';
import { handler as versionGet } from './api/version/version-get.ts';
import { handler as workoutsDelete } from './api/workouts/workouts-delete.ts';
import { handler as workoutsGet } from './api/workouts/workouts-get.ts';
import { handler as workoutsGetById } from './api/workouts/workouts-get-by-id.ts';
import { handler as workoutsPut } from './api/workouts/workouts-put.ts';
import { authenticateKeycloak } from './middleware/auth.ts';
import { validateBody } from './middleware/validate-body.ts';
import { validateParams } from './middleware/validate-params.ts';
import { validateQuery } from './middleware/validate-query.ts';

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
