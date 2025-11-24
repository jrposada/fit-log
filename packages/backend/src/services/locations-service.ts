import { assert } from '@shared/utils/assert';
import { v4 as uuid } from 'uuid';

import { DbRecord } from './aws/db-record';
import { RestfulService } from './restful-service';

export class LocationsService extends RestfulService<'location'> {
  static #instance: LocationsService;
  static get instance() {
    if (!LocationsService.#instance) {
      assert(process.env.TABLE_NAME);
      LocationsService.#instance = new LocationsService(process.env.TABLE_NAME);
    }

    return LocationsService.#instance;
  }

  static getLocationUuid(sk: string): string {
    const segments = sk.split('#');
    assert(segments.length === 2);
    return segments[1];
  }

  private constructor(tableName: string) {
    super(tableName, 'location');
  }

  public calculateSk(uuid: string): string {
    return `${this.entity}#${uuid}` as DbRecord<'location'>['SK'];
  }

  public calculatePartialSk(): string {
    return this.entity;
  }

  public newSk(): DbRecord<'location'>['SK'] {
    return `${this.entity}#${uuid()}` as DbRecord<'location'>['SK'];
  }
}
