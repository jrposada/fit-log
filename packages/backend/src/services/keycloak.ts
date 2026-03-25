import { assert } from '@shared/utils/assert';
import jwt from 'jsonwebtoken';
import { JwtHeader, JwtPayload } from 'jsonwebtoken';
import jwksClient, { JwksClient } from 'jwks-rsa';

interface KeycloakTokenPayload extends JwtPayload {
  authId: string;
  email: string;
  name: string;
  roles: string[];
}

class Keycloak {
  private static singleton: Keycloak;
  public static get instance(): Keycloak {
    if (!Keycloak.singleton) {
      Keycloak.singleton = new Keycloak();
    }
    return Keycloak.singleton;
  }

  private readonly url: string;
  private readonly realm: string;
  private readonly jwks: JwksClient;

  private constructor() {
    assert(process.env.KEYCLOAK_ENDPOINT, {
      msg: 'KEYCLOAK_ENDPOINT environment variable is not set',
    });
    this.url = process.env.KEYCLOAK_ENDPOINT;

    assert(process.env.KEYCLOAK_REALM, {
      msg: 'KEYCLOAK_REALM environment variable is not set',
    });
    this.realm = process.env.KEYCLOAK_REALM;

    this.jwks = jwksClient({
      jwksUri: `${this.url}/realms/${encodeURIComponent(this.realm)}/protocol/openid-connect/certs`,
      cache: true,
      cacheMaxAge: 10 * 60 * 1000, // 10 minutes
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    });
  }

  public async verifyToken(
    authorizationHeader: string | undefined
  ): Promise<KeycloakTokenPayload | null> {
    const token = this.extractBearerToken(authorizationHeader);

    if (!token) {
      return null;
    }

    const issuer = `${this.url}/realms/${encodeURIComponent(this.realm)}`;

    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        (header, callback) => {
          this.getSigningKey(header)
            .then((key) => callback(null, key))
            .catch((err) => callback(err as Error));
        },
        {
          issuer,
          algorithms: ['RS256'],
        },
        (err, decoded) => {
          if (err) {
            reject(err);
            return;
          }

          const decodedToken = decoded as jwt.JwtPayload;

          assert(decodedToken.sub, {
            msg: 'Token does not contain subject (sub) claim',
          });
          assert(decodedToken.name, {
            msg: 'Token does not contain name claim',
          });
          assert(decodedToken.email, {
            msg: 'Token does not contain email claim',
          });
          assert(decodedToken.realm_access, {
            msg: 'Token does not contain realm_access claim',
          });

          resolve({
            authId: decodedToken.sub,
            email: decodedToken.email,
            name: decodedToken.name,
            roles: decodedToken.realm_access.roles ?? [],
          } as KeycloakTokenPayload);
        }
      );
    });
  }

  private extractBearerToken(
    authorizationHeader: string | undefined
  ): string | null {
    if (!authorizationHeader) {
      return null;
    }

    const parts = authorizationHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return null;
    }

    return parts[1];
  }

  private async getSigningKey(header: JwtHeader): Promise<string> {
    const key = await this.jwks.getSigningKey(header.kid);
    return key.getPublicKey();
  }
}

export default Keycloak;

export type { KeycloakTokenPayload };
