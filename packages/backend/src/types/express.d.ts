import type { IUser } from '../data/models/user.ts';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
