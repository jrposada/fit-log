import { NextFunction, Request, Response } from 'express';

import { User } from '../models/user';
import Keycloak from '../services/keycloak';

export async function authenticateKeycloak(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const decodedToken = await Keycloak.instance.verifyToken(
      req.headers.authorization
    );
    if (!decodedToken) {
      res.status(401).json({ success: false, error: 'Invalid token' });
      return;
    }

    let user = await User.findOne({ keycloakId: decodedToken.authId });

    if (!user) {
      user = await User.create({
        keycloakId: decodedToken.authId,
        email: decodedToken.email,
        name: decodedToken.name,
        roles: decodedToken.roles,
      });
    } else {
      let hasChanges = false;

      const newEmail = decodedToken.email || user.email;
      const newName = decodedToken.name;
      const newRoles = decodedToken.roles;

      if (user.email !== newEmail) {
        user.email = newEmail;
        hasChanges = true;
      }

      if (user.name !== newName) {
        user.name = newName;
        hasChanges = true;
      }

      if (
        user.roles.length !== newRoles.length ||
        !user.roles.every((role) => newRoles.includes(role))
      ) {
        user.roles = newRoles;
        hasChanges = true;
      }

      if (hasChanges) {
        await user.save();
      }
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
