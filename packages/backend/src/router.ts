import { Router } from 'express';

// Import all handlers
import { handler as versionGet } from './api/version/get/version-get';

// Workouts
import { handler as workoutsGet } from './api/workouts/get/workouts-get';
import { handler as workoutsGetById } from './api/workouts/get-by-id/workouts-get-by-id';
import { handler as workoutsPut } from './api/workouts/put/workouts-put';
import { handler as workoutsDelete } from './api/workouts/delete/workouts-delete';

// Sessions
import { handler as sessionsGet } from './api/sessions/get/sessions-get';
import { handler as sessionsGetById } from './api/sessions/get-by-id/sessions-get-by-id';
import { handler as sessionsPut } from './api/sessions/put/sessions-put';
import { handler as sessionsDelete } from './api/sessions/delete/sessions-delete';

// Favorite Workouts
import { handler as favoriteWorkoutsPut } from './api/favorite-workouts/put/favorite-workouts-put';
import { handler as favoriteWorkoutsDelete } from './api/favorite-workouts/delete/favorite-workouts-delete';

// Users
import { handler as usersPost } from './api/users/post/users-post';
import { handler as usersAuthorize } from './api/users/authorize/users-authorize';

// Locations
import { handler as locationsGet } from './api/locations/get/locations-get';
import { handler as locationsGetById } from './api/locations/get-by-id/locations-get-by-id';
import { handler as locationsPut } from './api/locations/put/locations-put';
import { handler as locationsDelete } from './api/locations/delete/locations-delete';

// Sectors
import { handler as sectorsGet } from './api/sectors/get/sectors-get';
import { handler as sectorsPut } from './api/sectors/put/sectors-put';
import { handler as sectorsDelete } from './api/sectors/delete/sectors-delete';
import { handler as sectorsUploadUrl } from './api/sectors/upload-url/sectors-upload-url';

// Climbs
import { handler as climbsGet } from './api/climbs/get/climbs-get';
import { handler as climbsGetById } from './api/climbs/get-by-id/climbs-get-by-id';
import { handler as climbsPut } from './api/climbs/put/climbs-put';
import { handler as climbsDelete } from './api/climbs/delete/climbs-delete';

export const router = Router();

// Version
router.get('/version', versionGet);

// Workouts
router.get('/workouts', workoutsGet);
router.get('/workouts/:id', workoutsGetById);
router.put('/workouts', workoutsPut);
router.delete('/workouts/:id', workoutsDelete);

// Sessions
router.get('/sessions', sessionsGet);
router.get('/sessions/:id', sessionsGetById);
router.put('/sessions', sessionsPut);
router.delete('/sessions/:id', sessionsDelete);

// Favorite Workouts
router.put('/favorite-workouts', favoriteWorkoutsPut);
router.delete('/favorite-workouts/:id', favoriteWorkoutsDelete);

// Users
router.post('/users', usersPost);
router.post('/users/authorize', usersAuthorize);

// Locations
router.get('/locations', locationsGet);
router.get('/locations/:id', locationsGetById);
router.put('/locations', locationsPut);
router.delete('/locations/:id', locationsDelete);

// Sectors
router.get('/sectors', sectorsGet);
router.put('/sectors', sectorsPut);
router.delete('/sectors/:id', sectorsDelete);
router.post('/sectors/upload-url', sectorsUploadUrl);

// Climbs
router.get('/climbs', climbsGet);
router.get('/climbs/:id', climbsGetById);
router.put('/climbs', climbsPut);
router.delete('/climbs/:id', climbsDelete);
