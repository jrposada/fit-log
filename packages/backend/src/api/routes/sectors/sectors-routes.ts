import { collaboratorDeleteParamsSchema } from '@jrposada/fit-log-shared/models/auth/collaborator-delete';
import {
  collaboratorPutParamsSchema,
  collaboratorPutRequestSchema,
} from '@jrposada/fit-log-shared/models/auth/collaborator-put';
import { sectorsBatchDeleteRequestSchema } from '@jrposada/fit-log-shared/models/sectors/sectors-batch-delete';
import { sectorsBatchPutRequestSchema } from '@jrposada/fit-log-shared/models/sectors/sectors-batch-put';
import { sectorsDeleteParamsSchema } from '@jrposada/fit-log-shared/models/sectors/sectors-delete';
import { sectorsPutRequestSchema } from '@jrposada/fit-log-shared/models/sectors/sectors-put';
import type { Router } from 'express';

import { authenticate } from '../../middlewares/authenticate.ts';
import { logRequest } from '../../middlewares/log-request.ts';
import { logResponse } from '../../middlewares/log-response.ts';
import { validateBody } from '../../middlewares/validate-body.ts';
import { validateParams } from '../../middlewares/validate-params.ts';
import { handler as sectorsBatchDelete } from './sectors-batch-delete.ts';
import { handler as sectorsBatchPut } from './sectors-batch-put.ts';
import { handler as sectorsCollaboratorsDelete } from './sectors-collaborators-delete.ts';
import { handler as sectorsCollaboratorsPut } from './sectors-collaborators-put.ts';
import { handler as sectorsDelete } from './sectors-delete.ts';
import { handler as sectorsPut } from './sectors-put.ts';

export function registerSectorsRoutes(router: Router): void {
  router.put(
    '/sectors',
    authenticate,
    logRequest,
    logResponse,
    validateBody(sectorsPutRequestSchema),
    sectorsPut
  );
  router.put(
    '/sectors/batch',
    authenticate,
    logRequest,
    logResponse,
    validateBody(sectorsBatchPutRequestSchema),
    sectorsBatchPut
  );
  router.delete(
    '/sectors/:id',
    authenticate,
    logRequest,
    logResponse,
    validateParams(sectorsDeleteParamsSchema),
    sectorsDelete
  );
  router.delete(
    '/sectors',
    authenticate,
    logRequest,
    logResponse,
    validateBody(sectorsBatchDeleteRequestSchema),
    sectorsBatchDelete
  );
  router.put(
    '/sectors/:id/collaborators/:userId',
    authenticate,
    logRequest,
    logResponse,
    validateParams(collaboratorPutParamsSchema),
    validateBody(collaboratorPutRequestSchema),
    sectorsCollaboratorsPut
  );
  router.delete(
    '/sectors/:id/collaborators/:userId',
    authenticate,
    logRequest,
    logResponse,
    validateParams(collaboratorDeleteParamsSchema),
    sectorsCollaboratorsDelete
  );
}
