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
    void (await this.db.put<DbRecord<'workout'>>(item));
  }
}
