import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import assert from 'node:assert';
import { DbRecord } from './aws/db-record';
import { DynamoDBHelper } from './aws/dynamodb';

export class WorkoutsService {
  static #instance: WorkoutsService;
  static get instance() {
    if (!WorkoutsService.#instance) {
      assert(process.env.TABLE_NAME);
      WorkoutsService.#instance = new WorkoutsService(process.env.TABLE_NAME);
    }

    return WorkoutsService.#instance;
  }

  private db: DynamoDBHelper;

  private constructor(tableName: string) {
    this.db = new DynamoDBHelper(tableName);
  }

  async delete(id: string): Promise<undefined> {
    return this.db.delete({ PK: 'workout', SK: id });
  }

  async get(id: string): Promise<DbRecord<'workout'>> {
    const workout = await this.db.get<DbRecord<'workout'>>({
      PK: 'workout',
      SK: id,
    });

    if (!workout) {
      throw new Error('Not Found');
    }

    return workout;
  }

  async getAll(): Promise<{
    items: DbRecord<'workout'>[];
    lastEvaluatedKey: QueryCommandOutput['LastEvaluatedKey'];
  }> {
    const data = await this.db.query<DbRecord<'workout'>>({
      KeyConditionExpression: 'PK = :PK',
      ExpressionAttributeValues: {
        ':PK': 'workout',
      },
    });

    return data;
  }

  async put(item: DbRecord<'workout'>): Promise<undefined> {
    return this.db.put<DbRecord<'workout'>>(item);
  }
}
