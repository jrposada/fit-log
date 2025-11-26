import { Client } from '@opensearch-project/opensearch';
import type { SearchResponse } from '@opensearch-project/opensearch/api/types';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { assert } from '@shared/utils/assert';
import dotenv from 'dotenv';

if (process.env.IS_OFFLINE) {
  const env = dotenv.config({ path: '.env' }).parsed;
  Object.assign(process.env, env);
}

export class OpenSearchHelper {
  private readonly client: Client;

  constructor(private readonly indexName: string) {
    assert(process.env.AWS_REGION, {
      msg: 'Expected env variable `AWS_REGION` to be defined',
    });
    assert(process.env.OPENSEARCH_ENDPOINT, {
      msg: 'Expected env variable `OPENSEARCH_ENDPOINT` to be defined',
    });

    this.client = new Client({
      node: process.env.OPENSEARCH_ENDPOINT,
      ...(process.env.IS_OFFLINE
        ? {}
        : AwsSigv4Signer({
            region: process.env.AWS_REGION,
            service: 'es',
          })),
    });
  }

  async search<T>(query: Record<string, unknown>): Promise<SearchResponse<T>> {
    const response = await this.client.search({
      index: this.indexName,
      body: {
        query,
      },
    });

    return response.body as SearchResponse<T>;
  }
}
