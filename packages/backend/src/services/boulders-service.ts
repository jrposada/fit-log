import { assert } from '@shared/utils/assert';
import { v4 as uuid } from 'uuid';

import { DbRecord } from './aws/db-record';
import { RestfulService } from './restful-service';

export class BouldersService extends RestfulService<'boulder'> {
  static #instance: BouldersService;
  static get instance() {
    if (!BouldersService.#instance) {
      assert(process.env.TABLE_NAME);
      BouldersService.#instance = new BouldersService(process.env.TABLE_NAME);
    }

    return BouldersService.#instance;
  }

  static getUserId(sk: string): string {
    const segments = sk.split('#');
    assert(segments.length === 3);
    return segments[1];
  }

  static getBoulderUuid(sk: string): string {
    const segments = sk.split('#');
    assert(segments.length === 3);
    return segments[2];
  }

  private constructor(tableName: string) {
    super(tableName, 'boulder');
  }

  public calculateSk(userId: string, uuid: string): string {
    return `${this.entity}#${userId}#${uuid}` as DbRecord<'boulder'>['SK'];
  }

  public calculatePartialSk(userId?: string): string {
    return [this.entity, userId].filter(Boolean).join('#');
  }

  public newSk(userId: string): DbRecord<'boulder'>['SK'] {
    return `${this.entity}#${userId}#${uuid()}` as DbRecord<'boulder'>['SK'];
  }
}
