import type { Router } from 'express';

import { logRequest } from '../../middlewares/log-request.ts';
import { handler as versionGet } from './version-get.ts';

export function registerVersionRoutes(router: Router): void {
  router.get('/version', logRequest, versionGet);
}
