import {
  climbsDeleteParamsSchema,
  climbsGetByIdParamsSchema,
  climbsGetQuerySchema,
  climbsPutRequestSchema,
} from '@shared/models/climb';
import {
  climbHistoriesDeleteParamsSchema,
  climbHistoriesGetByIdParamsSchema,
  climbHistoriesGetQuerySchema,
  climbHistoriesPutRequestSchema,
} from '@shared/models/climb-history';
import { imagesPostRequestSchema } from '@shared/models/image';
import {
  locationsDeleteParamsSchema,
  locationsGetByIdParamsSchema,
  locationsGetQuerySchema,
  locationsPutRequestSchema,
} from '@shared/models/location';
import {
  sectorsBatchDeleteRequestSchema,
  sectorsBatchPutRequestSchema,
  sectorsDeleteParamsSchema,
  sectorsPutRequestSchema,
} from '@shared/models/sector';
import {
  sessionsDeleteParamsSchema,
  sessionsGetByIdParamsSchema,
  sessionsGetQuerySchema,
  sessionsPutRequestSchema,
} from '@shared/models/session';
import {
  workoutsDeleteParamsSchema,
  workoutsGetByIdParamsSchema,
  workoutsGetQuerySchema,
  workoutsPutRequestSchema,
} from '@shared/models/workout';
import { Router } from 'express';

import { handler as climbHistoriesDelete } from './api/climb-histories/climb-histories-delete';
import { handler as climbHistoriesGet } from './api/climb-histories/climb-histories-get';
import { handler as climbHistoriesGetById } from './api/climb-histories/climb-histories-get-by-id';
import { handler as climbHistoriesPut } from './api/climb-histories/climb-histories-put';
import { handler as climbsDelete } from './api/climbs/climbs-delete';
import { handler as climbsGet } from './api/climbs/climbs-get';
import { handler as climbsGetById } from './api/climbs/climbs-get-by-id';
import { handler as climbsPut } from './api/climbs/climbs-put';
import { handler as imagesPost } from './api/images/images-post';
import { handler as locationsDelete } from './api/locations/locations-delete';
import { handler as locationsGet } from './api/locations/locations-get';
import { handler as locationsGetById } from './api/locations/locations-get-by-id';
import { handler as locationsPut } from './api/locations/locations-put';
import { handler as sectorsBatchDelete } from './api/sectors/sectors-batch-delete';
import { handler as sectorsBatchPut } from './api/sectors/sectors-batch-put';
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
router.get('/sessions', validateQuery(sessionsGetQuerySchema), sessionsGet);
router.get(
  '/sessions/:id',
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

// Images
router.post(
  '/images',
  authenticateKeycloak,
  validateBody(imagesPostRequestSchema),
  imagesPost
);

// Climbs
router.get(
  '/climbs',
  authenticateKeycloak,
  validateQuery(climbsGetQuerySchema),
  climbsGet
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
router.delete(
  '/climb-histories/:id',
  authenticateKeycloak,
  validateParams(climbHistoriesDeleteParamsSchema),
  climbHistoriesDelete
);
