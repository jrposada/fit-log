import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DbRecord, DbRecordType } from './aws/db-record';
import { DynamoDBHelper } from './aws/dynamodb';

export abstract class RestfulService<T extends DbRecordType> {
  private db: DynamoDBHelper;

  public constructor(
    tableName: string,
    protected readonly entity: T
  ) {
    this.db = new DynamoDBHelper(tableName);
  }

  public async delete(id: string): Promise<undefined> {
    return this.db.delete({ PK: this.entity, SK: id });
  }

  public async get(id: string): Promise<DbRecord<T>> {
    const workout = await this.db.get<DbRecord<T>>({
      PK: this.entity,
      SK: id,
    });

    if (!workout) {
      throw new Error('Not Found');
    }

    return workout;
  }

  public async getAll(sk?: string): Promise<{
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
    });

    return data;
  }

  public async put(item: DbRecord<T>): Promise<undefined> {
    return this.db.put<DbRecord<T>>(item);
  }
}
