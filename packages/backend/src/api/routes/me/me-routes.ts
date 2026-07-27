import type { Router } from 'express';

import { authenticateKeycloak } from '../../middlewares/auth.ts';
import { handler as meGet } from './me-get.ts';

export function registerMeRoutes(router: Router): void {
  router.get('/me', authenticateKeycloak, meGet);
}
