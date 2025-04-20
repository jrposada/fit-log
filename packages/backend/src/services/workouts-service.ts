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

  static getUserId(sk: string): string {
    const segments = sk.split('#');
    assert(segments.length === 3);
    return segments[1];
  }

  static getWorkoutUuid(sk: string): string {
    const segments = sk.split('#');
    assert(segments.length === 3);
    return segments[2];
  }

  private constructor(tableName: string) {
    super(tableName, 'workout');
  }

  public calculateSk(userId: string, uuid: string): string {
    return `${this.entity}#${userId}#${uuid}` as DbRecord<'workout'>['SK'];
  }

  public newSk(userId: string): DbRecord<'workout'>['SK'] {
    return `${this.entity}#${userId}#${uuid()}` as DbRecord<'workout'>['SK'];
  }
}
