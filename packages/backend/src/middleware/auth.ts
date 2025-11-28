import { NextFunction, Request, Response } from 'express';

import { User } from '../models/user';

export async function authenticateKeycloak(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const decodedToken = {
      // Mock decoding for illustration; replace with actual Keycloak token decoding
      sub: 'unique-user-id',
      email: 'user@example.com',
      name: 'John Doe',
      preferred_username: 'johndoe',
      realm_access: {
        roles: ['user', 'admin'],
      },
    };

    let user = await User.findOne({ keycloakId: decodedToken.sub });

    if (!user) {
      user = await User.create({
        keycloakId: decodedToken.sub,
        email: decodedToken.email,
        name:
          decodedToken.name ||
          decodedToken.preferred_username ||
          'Unknown User',
        roles: decodedToken.realm_access?.roles || [],
      });
    } else {
      let hasChanges = false;

      const newName =
        decodedToken.name || decodedToken.preferred_username || user.name;
      const newRoles = decodedToken.realm_access?.roles || [];

      if (user.email !== decodedToken.email) {
        user.email = decodedToken.email;
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
