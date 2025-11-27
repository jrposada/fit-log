import { assert } from '@shared/utils/assert';
import { v4 as uuid } from 'uuid';

import { DbRecord } from './aws/db-record';
import { RestfulService } from './restful-service';

export class SessionsService extends RestfulService<'session'> {
  static #instance: SessionsService;
  static get instance() {
    if (!SessionsService.#instance) {
      assert(process.env.TABLE_NAME);
      SessionsService.#instance = new SessionsService(process.env.TABLE_NAME);
    }

    return SessionsService.#instance;
  }

  static getUserId(sk: string): string {
    const segments = sk.split('#');
    assert(segments.length === 4);
    return segments[1];
  }

  private constructor(tableName: string) {
    super(tableName, 'session');
  }

  public calculatePartialSk(userId?: string, workoutId?: string): string {
    return [this.entity, userId, workoutId].filter(Boolean).join('#');
  }

  public newSk(userId: string, workoutId: string): DbRecord<'session'>['SK'] {
    return `${this.entity}#${userId}#${workoutId}#${uuid()}` as DbRecord<'session'>['SK'];
  }
}
