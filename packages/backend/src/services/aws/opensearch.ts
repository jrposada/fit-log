import { Client } from '@opensearch-project/opensearch';
import type { SearchResponse } from '@opensearch-project/opensearch/api/types';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { assert } from '@shared/utils/assert';

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
      ...AwsSigv4Signer({
        region: process.env.AWS_REGION,
        service: 'es',
      }),
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

  async indexDocument<T extends Record<string, unknown>>(
    id: string,
    document: T
  ): Promise<void> {
    await this.client.index({
      index: this.indexName,
      id,
      body: document,
      refresh: true,
    });
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      await this.client.delete({
        index: this.indexName,
        id,
        refresh: true,
      });
    } catch (error) {
      // Ignore 404 errors when deleting non-existent documents
      if ((error as { statusCode?: number }).statusCode !== 404) {
        throw error;
      }
    }
  }
}
