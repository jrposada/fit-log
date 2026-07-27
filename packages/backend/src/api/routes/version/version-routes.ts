import type { Router } from 'express';

import { handler as versionGet } from './version-get.ts';

export function registerVersionRoutes(router: Router): void {
  router.get('/version', versionGet);
}
