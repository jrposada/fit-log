import { assert } from '@shared/utils/assert';
import { v4 as uuid } from 'uuid';

import { DbRecord } from './aws/db-record';
import { RestfulService } from './restful-service';

export class ClimbsService extends RestfulService<'climb'> {
  static #instance: ClimbsService;
  static get instance() {
    if (!ClimbsService.#instance) {
      assert(process.env.TABLE_NAME);
      ClimbsService.#instance = new ClimbsService(process.env.TABLE_NAME);
    }

    return ClimbsService.#instance;
  }

  static getUserId(sk: string): string {
    const segments = sk.split('#');
    assert(segments.length === 3);
    return segments[1];
  }

  static getClimbUuid(sk: string): string {
    const segments = sk.split('#');
    assert(segments.length === 3);
    return segments[2];
  }

  private constructor(tableName: string) {
    super(tableName, 'climb');
  }

  public calculateSk(userId: string, uuid: string): string {
    return `${this.entity}#${userId}#${uuid}` as DbRecord<'climb'>['SK'];
  }

  public calculatePartialSk(userId?: string): string {
    return [this.entity, userId].filter(Boolean).join('#');
  }

  public newSk(userId: string): DbRecord<'climb'>['SK'] {
    return `${this.entity}#${userId}#${uuid()}` as DbRecord<'climb'>['SK'];
  }
}
