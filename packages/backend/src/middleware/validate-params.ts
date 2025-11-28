import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export function validateParams<TSchema extends ZodSchema>(schema: TSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch {
      throw new Error('Invalid request parameters');
    }
  };
}
