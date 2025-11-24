import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DbRecord, DbRecordType } from './aws/db-record';
import { DynamoDBHelper } from './aws/dynamodb';
import ResourceNotFound from '../infrastructure/not-found-error';

export abstract class RestfulService<T extends DbRecordType> {
  private db: DynamoDBHelper;

  public constructor(
    tableName: string,
    protected readonly entity: T
  ) {
    // TODO: Improve. We should not create a new DynamoDBHelper for each service.
    this.db = new DynamoDBHelper(tableName);
  }

  public async batchGet(ids: string[]): Promise<DbRecord<T>[]> {
    return this.db.batchGet<DbRecord<T>>(
      ids.map((id) => ({ PK: this.entity, SK: id }))
    );
  }

  public async delete(id: string): Promise<undefined> {
    return this.db.delete({ PK: this.entity, SK: id });
  }

  public async get(id: string): Promise<DbRecord<T>> {
    const record = await this.db.get<DbRecord<T>>({
      PK: this.entity,
      SK: id,
    });

    if (!record) {
      throw new ResourceNotFound('');
    }

    return record;
  }

  public async getAll(
    sk?: string,
    limit?: number
  ): Promise<{
    items: DbRecord<T>[];
    lastEvaluatedKey: QueryCommandOutput['LastEvaluatedKey'];
  }> {
    const data = await this.db.query<DbRecord<T>>({
      KeyConditionExpression: sk
        ? 'PK = :PK AND begins_with(SK, :SK)'
        : 'PK = :PK',
      ExpressionAttributeValues: {
        ':PK': this.entity,
        ...(sk ? { ':SK': sk } : {}),
      },
      ...(limit ? { Limit: limit } : {}),
    });

    return data;
  }

  public async put(item: DbRecord<T>): Promise<undefined> {
    return this.db.put<DbRecord<T>>(item);
  }
}
