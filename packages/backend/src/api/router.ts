import { Router } from 'express';

import { registerClimbHistoriesRoutes } from './routes/climb-histories/climb-histories-routes.ts';
import { registerClimbingSessionsRoutes } from './routes/climbing-sessions/climbing-sessions-routes.ts';
import { registerClimbsRoutes } from './routes/climbs/climbs-routes.ts';
import { registerFeedRoutes } from './routes/feed/feed-routes.ts';
import { registerImagesRoutes } from './routes/images/images-routes.ts';
import { registerLocationsRoutes } from './routes/locations/locations-routes.ts';
import { registerMeRoutes } from './routes/me/me-routes.ts';
import { registerSectorsRoutes } from './routes/sectors/sectors-routes.ts';
import { registerSessionsRoutes } from './routes/sessions/sessions-routes.ts';
import { registerVersionRoutes } from './routes/version/version-routes.ts';
import { registerWorkoutsRoutes } from './routes/workouts/workouts-routes.ts';

export const router = Router();

registerVersionRoutes(router);
registerMeRoutes(router);
registerFeedRoutes(router);
registerWorkoutsRoutes(router);
registerSessionsRoutes(router);
registerClimbingSessionsRoutes(router);
registerLocationsRoutes(router);
registerSectorsRoutes(router);
registerImagesRoutes(router);
registerClimbsRoutes(router);
registerClimbHistoriesRoutes(router);
