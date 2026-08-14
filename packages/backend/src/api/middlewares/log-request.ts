import type { NextFunction, Request, Response } from 'express';

import { RequestContext } from '../../services/request-context.ts';

export async function logRequest(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  console.log(`[${RequestContext.getTraceId()}] [${req.method}] ${req.path}`, {
    payload: req.body ? JSON.stringify(req.body) : null,
  });
  next();
}
