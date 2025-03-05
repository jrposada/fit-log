import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  BatchGetCommand,
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { batch } from '@shared/utils';
import dotenv from 'dotenv';
import assert from 'node:assert';

if (process.env.IS_OFFLINE) {
  const env = dotenv.config({ path: '.env.development' }).parsed;
  Object.assign(process.env, env);
}

/** @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/BatchWriteItemCommand/ */
const BATCH_WRITE_SIZE = 25;
/** @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/dynamodb/command/BatchGetItemCommand/ */
const BATCH_GET_SIZE = 100;

export class DynamoDBHelper {
  private readonly documentClient: DynamoDBDocumentClient;

  constructor(private readonly tableName: string) {
    assert(process.env.AWS_REGION);
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      ...(process.env.IS_OFFLINE && {
        endpoint: process.env.DB_LOCAL_ENDPOINT,
      }),
    });

    this.documentClient = DynamoDBDocumentClient.from(client);
  }

  async batchDelete(keys: { PK: string; SK: string }[]): Promise<undefined> {
    if (!keys.length) {
      return;
    }

    const promises = batch(keys, BATCH_WRITE_SIZE).map((chunk) => {
      const command = new BatchWriteCommand({
        RequestItems: {
          [this.tableName]: chunk.map((item) => ({
            DeleteRequest: { Key: { PK: item.PK, SK: item.SK } },
          })),
        },
      });
      return this.documentClient.send(command);
    });

    void (await Promise.allSettled(promises));
  }

  async batchGet<T>(keys: { PK: string; SK: string }[]): Promise<T[]> {
    if (!keys.length) {
      return [];
    }

    const promises = batch(keys, BATCH_GET_SIZE).map((chunk) => {
      const command = new BatchGetCommand({
        RequestItems: {
          [this.tableName]: {
            Keys: chunk.map((item) => ({ PK: item.PK, SK: item.SK })),
          },
        },
      });
      return this.documentClient.send(command);
    });

    const results = await Promise.allSettled(promises);

    return results
      .filter((result) => result.status === 'fulfilled')
      .map(
        (result) => Object.values(result.value.Responses ?? {}).flat() as T[]
      )
      .flat();
  }

  async delete(key: { PK: string; SK: string }): Promise<undefined> {
    const command = new DeleteCommand({
      Key: key,
      TableName: this.tableName,
    });
    void (await this.documentClient.send(command));
  }

  async get<T>(key: { PK: string; SK: string }): Promise<T | undefined> {
    const command = new GetCommand({
      Key: key,
      TableName: this.tableName,
    });
    const response = await this.documentClient.send(command);
    return response.Item as T | undefined;
  }

  async put<T extends { PK: string; SK: string }>(item: T): Promise<undefined> {
    const command = new PutCommand({
      Item: item,
      TableName: this.tableName,
    });
    void (await this.documentClient.send(command));
  }

  async query<T>(params: Omit<QueryCommandInput, 'TableName'>): Promise<{
    items: T[];
    lastEvaluatedKey: QueryCommandOutput['LastEvaluatedKey'];
  }> {
    const command = new QueryCommand({
      ...params,
      TableName: this.tableName,
    });
    const response = await this.documentClient.send(command);
    return {
      items: (response.Items as T[]) ?? [],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  }
}
