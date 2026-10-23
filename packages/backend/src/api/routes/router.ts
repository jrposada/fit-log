import { Router } from 'express';

import { registerBenchmarkResultsRoutes } from './benchmark-results/benchmark-results-routes.ts';
import { registerClimbHistoriesRoutes } from './climb-histories/climb-histories-routes.ts';
import { registerClimbsRoutes } from './climbs/climbs-routes.ts';
import { registerFeedRoutes } from './feed/feed-routes.ts';
import { registerImagesRoutes } from './images/images-routes.ts';
import { registerLocationsRoutes } from './locations/locations-routes.ts';
import { registerMeRoutes } from './me/me-routes.ts';
import { registerModel3dsRoutes } from './model-3ds/model-3ds-routes.ts';
import { registerPlanEnrollmentsRoutes } from './plan-enrollments/plan-enrollments-routes.ts';
import { registerSectorsRoutes } from './sectors/sectors-routes.ts';
import { registerTrainingPlansRoutes } from './training-plans/training-plans-routes.ts';
import { registerTrainingSessionsRoutes } from './training-sessions/training-sessions-routes.ts';
import { registerVersionRoutes } from './version/version-routes.ts';
import { registerWorkoutsRoutes } from './workouts/workouts-routes.ts';

export const router = Router();

registerVersionRoutes(router);
registerMeRoutes(router);
registerFeedRoutes(router);
registerWorkoutsRoutes(router);
registerTrainingSessionsRoutes(router);
registerTrainingPlansRoutes(router);
registerPlanEnrollmentsRoutes(router);
registerBenchmarkResultsRoutes(router);
registerLocationsRoutes(router);
registerSectorsRoutes(router);
registerImagesRoutes(router);
registerModel3dsRoutes(router);
registerClimbsRoutes(router);
registerClimbHistoriesRoutes(router);
