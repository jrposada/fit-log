import { feedGetQuerySchema } from '@jrposada/fit-log-shared/models/feed/feed-get';
import type { Router } from 'express';

import { authenticateKeycloak } from '../../middlewares/auth.ts';
import { validateQuery } from '../../middlewares/validate-query.ts';
import { handler as feedGet } from './feed-get.ts';

export function registerFeedRoutes(router: Router): void {
  router.get(
    '/feed',
    authenticateKeycloak,
    validateQuery(feedGetQuerySchema),
    feedGet
  );
}
