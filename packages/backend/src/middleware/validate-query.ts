import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export function validateQuery<TSchema extends ZodSchema>(schema: TSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch {
      throw new Error('Invalid query parameters');
    }
  };
}
