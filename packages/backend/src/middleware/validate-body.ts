import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export function validateBody<TSchema extends ZodSchema>(schema: TSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch {
      throw new Error('Invalid request body');
    }
  };
}
