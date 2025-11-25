import { assert } from '@shared/utils/assert';
import { v4 as uuid } from 'uuid';

import { DbRecord } from './aws/db-record';
import { RestfulService } from './restful-service';

export class SectorsService extends RestfulService<'sector'> {
  static #instance: SectorsService;
  static get instance() {
    if (!SectorsService.#instance) {
      assert(process.env.TABLE_NAME);
      SectorsService.#instance = new SectorsService(process.env.TABLE_NAME);
    }

    return SectorsService.#instance;
  }

  static getLocationUuid(sk: string): string {
    const segments = sk.split('#');
    assert(segments.length === 3);
    return segments[1];
  }

  static getSectorUuid(sk: string): string {
    const segments = sk.split('#');
    assert(segments.length === 3);
    return segments[2];
  }

  private constructor(tableName: string) {
    super(tableName, 'sector');
  }

  public calculateSk(locationUuid: string, sectorUuid: string): string {
    return `${this.entity}#${locationUuid}#${sectorUuid}` as DbRecord<'sector'>['SK'];
  }

  public calculatePartialSk(locationUuid?: string): string {
    return [this.entity, locationUuid].filter(Boolean).join('#');
  }

  public newSk(locationUuid: string): DbRecord<'sector'>['SK'] {
    return `${this.entity}#${locationUuid}#${uuid()}` as DbRecord<'sector'>['SK'];
  }

  /**
   * Get all sectors for a specific location
   */
  public async getSectorsByLocation(
    locationUuid: string,
    limit?: number
  ): Promise<{
    items: DbRecord<'sector'>[];
    lastEvaluatedKey: any;
  }> {
    const result = await this.getAll(
      this.calculatePartialSk(locationUuid),
      limit
    );

    return {
      items: result.items,
      lastEvaluatedKey: result.lastEvaluatedKey,
    };
  }
}
