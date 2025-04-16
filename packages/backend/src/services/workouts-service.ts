import { assert } from '@shared/utils/assert';
import { v4 as uuid } from 'uuid';
import { DbRecord } from './aws/db-record';
import { RestfulService } from './restful-service';

export class WorkoutsService extends RestfulService<'workout'> {
  static #instance: WorkoutsService;
  static get instance() {
    if (!WorkoutsService.#instance) {
      assert(process.env.TABLE_NAME);
      WorkoutsService.#instance = new WorkoutsService(process.env.TABLE_NAME);
    }

    return WorkoutsService.#instance;
  }

  static getUserId(id: string): string {
    const segments = id.split(`#`);
    assert(segments.length === 3);
    return segments[1];
  }

  private constructor(tableName: string) {
    super(tableName, 'workout');
  }

  public newSk(userId: string): DbRecord<'workout'>['SK'] {
    return `${this.entity}#${userId}#${uuid()}` as DbRecord<'workout'>['SK'];
  }
}
