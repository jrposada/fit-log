import { planEnrollmentsPutRequestSchema } from '@jrposada/fit-log-shared/models/plan-enrollments/plan-enrollments-put';
import type { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate.ts';
import { logRequest } from '../../middlewares/log-request.ts';
import { logResponse } from '../../middlewares/log-response.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import { handler as planEnrollmentsGetActive } from './plan-enrollments-get-active.ts';
import { handler as planEnrollmentsPut } from './plan-enrollments-put.ts';

export function registerPlanEnrollmentsRoutes(router: Router): void {
  router.get(
    '/plan-enrollments/active',
    authenticate,
    logRequest,
    logResponse,
    planEnrollmentsGetActive
  );
  router.put(
    '/plan-enrollments',
    authenticate,
    logRequest,
    logResponse,
    validateBody(planEnrollmentsPutRequestSchema),
    planEnrollmentsPut
  );
}
