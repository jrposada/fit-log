import { NextFunction, Request, Response } from 'express';

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    throw new Error('Unauthorized');
  }
  next();
}
