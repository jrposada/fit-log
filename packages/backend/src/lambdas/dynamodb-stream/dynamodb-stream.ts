import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';

import { OpenSearchHelper } from '../../services/aws/opensearch';


interface DynamoDBItem {
  PK: string;
  SK: string;
  [key: string]: unknown;
}

export const handler = async (
  event: DynamoDBStreamEvent
): Promise<{ batchItemFailures: Array<{ itemIdentifier: string }> }> => {
  console.log('Processing DynamoDB stream records:', event.Records.length);

  const failedRecords: Array<{ itemIdentifier: string }> = [];

  for (const record of event.Records) {
    try {
      await processRecord(record);
    } catch (error) {
      console.error('Failed to process record:', {
        eventID: record.eventID,
        error,
      });

      // Report failure for partial batch failure handling
      if (record.dynamodb?.SequenceNumber) {
        failedRecords.push({
          itemIdentifier: record.dynamodb.SequenceNumber,
        });
      }
    }
  }

  return { batchItemFailures: failedRecords };
};

async function processRecord(record: DynamoDBRecord): Promise<void> {
  const eventName = record.eventName;

  if (!record.dynamodb?.Keys) {
    console.warn('Record has no keys, skipping');
    return;
  }

  const keys = unmarshall(
    record.dynamodb.Keys as Record<string, AttributeValue>
  ) as { PK: string; SK: string };

  const indexName = getIndexName(keys.PK);

  if (!indexName) {
    console.log('Skipping record - entity type not indexed:', keys.PK);
    return;
  }

  const openSearch = new OpenSearchHelper(indexName);
  const documentId = `${keys.PK}#${keys.SK}`;

  switch (eventName) {
    case 'INSERT':
    case 'MODIFY': {
      if (!record.dynamodb.NewImage) {
        console.warn('INSERT/MODIFY record has no NewImage, skipping');
        return;
      }

      const item = unmarshall(
        record.dynamodb.NewImage as Record<string, AttributeValue>
      ) as DynamoDBItem;

      await indexDocument(openSearch, documentId, item);
      console.log(`Indexed document: ${documentId} in index: ${indexName}`);
      break;
    }

    case 'REMOVE': {
      await openSearch.deleteDocument(documentId);
      console.log(`Deleted document: ${documentId} from index: ${indexName}`);
      break;
    }

    default:
      console.warn('Unknown event type:', eventName);
  }
}

/**
 * Determine which OpenSearch index to use based on the entity type (PK)
 */
function getIndexName(pk: string): string | null {
  // Extract entity type from PK (e.g., "session" from "session", "workout#123" from "workout")
  const entityType = pk.split('#')[0];

  // Map entity types to their corresponding OpenSearch indices
  const indexMap: Record<string, string> = {
    session: 'sessions',
    workout: 'workouts',
    location: 'locations',
    climb: 'climbs',
    sector: 'sectors',
    // Add more entity types as needed
  };

  return indexMap[entityType] || null;
}

/**
 * Index a document in OpenSearch
 * Override this function to customize what gets indexed for different entity types
 */
async function indexDocument(
  openSearch: OpenSearchHelper,
  documentId: string,
  item: DynamoDBItem
): Promise<void> {
  // You can add entity-specific transformation logic here
  // For now, we'll index the entire item
  const document = {
    ...item,
    // Add a timestamp for tracking
    _indexedAt: new Date().toISOString(),
  };

  await openSearch.indexDocument(documentId, document);
}
