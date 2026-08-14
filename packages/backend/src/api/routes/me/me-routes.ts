import type { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate.ts';
import { logRequest } from '../../middlewares/log-request.ts';
import { handler as meGet } from './me-get.ts';

export function registerMeRoutes(router: Router): void {
  router.get('/me', authenticate, logRequest, meGet);
}
