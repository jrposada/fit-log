import { Router } from 'express';

import { registerClimbHistoriesRoutes } from './climb-histories/climb-histories-routes.ts';
import { registerClimbingSessionsRoutes } from './climbing-sessions/climbing-sessions-routes.ts';
import { registerClimbsRoutes } from './climbs/climbs-routes.ts';
import { registerFeedRoutes } from './feed/feed-routes.ts';
import { registerImagesRoutes } from './images/images-routes.ts';
import { registerLocationsRoutes } from './locations/locations-routes.ts';
import { registerMeRoutes } from './me/me-routes.ts';
import { registerSectorsRoutes } from './sectors/sectors-routes.ts';
import { registerVersionRoutes } from './version/version-routes.ts';
import { registerWorkoutsRoutes } from './workouts/workouts-routes.ts';

export const router = Router();

registerVersionRoutes(router);
registerMeRoutes(router);
registerFeedRoutes(router);
registerWorkoutsRoutes(router);
registerClimbingSessionsRoutes(router);
registerLocationsRoutes(router);
registerSectorsRoutes(router);
registerImagesRoutes(router);
registerClimbsRoutes(router);
registerClimbHistoriesRoutes(router);
