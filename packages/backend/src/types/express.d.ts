import { AuthorizerContext } from './lambdas/authorizer/authorizer';

declare global {
  namespace Express {
    interface Request {
      user?: AuthorizerContext;
    }
  }
}
