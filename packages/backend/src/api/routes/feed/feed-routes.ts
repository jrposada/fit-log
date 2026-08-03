import { feedGetQuerySchema } from '@jrposada/fit-log-shared/models/feed/feed-get';
import { feedStatsQuerySchema } from '@jrposada/fit-log-shared/models/feed/feed-stats';
import type { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate.ts';
import { validateQuery } from '../../middlewares/validate-query.ts';
import { handler as feedGet } from './feed-get.ts';
import { handler as feedStats } from './feed-stats.ts';

export function registerFeedRoutes(router: Router): void {
  router.get('/feed', authenticate, validateQuery(feedGetQuerySchema), feedGet);
  // Must be registered before '/feed/:id' (once it exists) so 'stats' is not
  // matched as an id, mirroring the climb-histories ordering gotcha.
  router.get(
    '/feed/stats',
    authenticate,
    validateQuery(feedStatsQuerySchema),
    feedStats
  );
}
