import { assert } from '@shared/utils/assert';
import { v4 as uuid } from 'uuid';
import { DbRecord } from './aws/db-record';
import { RestfulService } from './restful-service';

export class FavoriteWorkoutsService extends RestfulService<'favorite-workout'> {
  static #instance: FavoriteWorkoutsService;
  static get instance() {
    if (!FavoriteWorkoutsService.#instance) {
      assert(process.env.TABLE_NAME);
      FavoriteWorkoutsService.#instance = new FavoriteWorkoutsService(
        process.env.TABLE_NAME
      );
    }

    return FavoriteWorkoutsService.#instance;
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
    super(tableName, 'favorite-workout');
  }

  public calculatePartialSk(userId: string): string {
    return `${this.entity}#${userId}#`;
  }

  public newSk(userId: string): DbRecord<'favorite-workout'>['SK'] {
    return `${this.entity}#${userId}#${uuid()}` as DbRecord<'favorite-workout'>['SK'];
  }
}
