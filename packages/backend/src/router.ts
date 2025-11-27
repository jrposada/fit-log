import { Router } from 'express';

// Import all handlers
import { handler as versionGet } from './api/version/version-get';

// Workouts
import { handler as workoutsGet } from './api/workouts/workouts-get';
import { handler as workoutsGetById } from './api/workouts/workouts-get-by-id';
import { handler as workoutsPut } from './api/workouts/workouts-put';
import { handler as workoutsDelete } from './api/workouts/workouts-delete';

// Sessions
import { handler as sessionsGet } from './api/sessions/sessions-get';
import { handler as sessionsGetById } from './api/sessions/sessions-get-by-id';
import { handler as sessionsPut } from './api/sessions/sessions-put';
import { handler as sessionsDelete } from './api/sessions/sessions-delete';

// Favorite Workouts
import { handler as favoriteWorkoutsPut } from './api/favorite-workouts/favorite-workouts-put';
import { handler as favoriteWorkoutsDelete } from './api/favorite-workouts/favorite-workouts-delete';

// Users
import { handler as usersPost } from './api/users/users-post';
import { handler as usersAuthorize } from './api/users/users-authorize';

// Locations
import { handler as locationsGet } from './api/locations/locations-get';
import { handler as locationsGetById } from './api/locations/locations-get-by-id';
import { handler as locationsPut } from './api/locations/locations-put';
import { handler as locationsDelete } from './api/locations/locations-delete';

// Sectors
import { handler as sectorsGet } from './api/sectors/sectors-get';
import { handler as sectorsPut } from './api/sectors/sectors-put';
import { handler as sectorsDelete } from './api/sectors/sectors-delete';
import { handler as sectorsUploadUrl } from './api/sectors/sectors-upload-url';

// Climbs
import { handler as climbsGet } from './api/climbs/climbs-get';
import { handler as climbsGetById } from './api/climbs/climbs-get-by-id';
import { handler as climbsPut } from './api/climbs/climbs-put';
import { handler as climbsDelete } from './api/climbs/climbs-delete';

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
