import type { NextFunction, Request, Response } from 'express';

import { User } from '../../data/models/user.ts';
import Keycloak from '../../services/keycloak.ts';

export async function authenticate(
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
      // Upsert (not create): concurrent first-time requests for the same new
      // user would otherwise race a plain create() against the unique index.
      user = await User.findOneAndUpdate(
        { keycloakId: decodedToken.authId },
        {
          $setOnInsert: {
            keycloakId: decodedToken.authId,
            email: decodedToken.email,
            name: decodedToken.name,
            roles: decodedToken.roles,
          },
        },
        { new: true, upsert: true, runValidators: true }
      );
    } else {
      const newEmail = decodedToken.email || user.email;
      const newName = decodedToken.name;
      const newRoles = decodedToken.roles;

      const hasChanges =
        user.email !== newEmail ||
        user.name !== newName ||
        user.roles.length !== newRoles.length ||
        !user.roles.every((role) => newRoles.includes(role));

      if (hasChanges) {
        // findOneAndUpdate is an atomic update, not a versioned document
        // save() — concurrent requests syncing the same role change no
        // longer race each other into a VersionError.
        user = await User.findOneAndUpdate(
          { keycloakId: decodedToken.authId },
          { email: newEmail, name: newName, roles: newRoles },
          { new: true, runValidators: true }
        );
      }
    }

    if (!user) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Keycloak authentication failed', error);
    res.status(401).end();
    return;
  }
}
