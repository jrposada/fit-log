import type { NextFunction, Request, Response } from 'express';

export async function logRequest(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  console.log(`[${req.method}] ${req.path}`, {
    payload: req.body ? JSON.stringify(req.body) : null,
  });
  next();
}
