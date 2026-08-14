import type { Router } from 'express';

import { logRequest } from '../../middlewares/log-request.ts';
import { logResponse } from '../../middlewares/log-response.ts';
import { handler as versionGet } from './version-get.ts';

export function registerVersionRoutes(router: Router): void {
  router.get('/version', logRequest, logResponse, versionGet);
}
