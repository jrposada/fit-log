import { DynamoDBHelper } from '@backend/aws/dynamodb';
import { assert } from '@shared/utils/assert';

import { Settings } from '../register';

type CommandSettings = Settings<void, Record<string, never>>;

const action: CommandSettings['action'] = async () => {
  assert(process.env.TABLE_NAME, {
    msg: 'Expected env variable `TABLE_NAME` to be defined',
  });

  const db = new DynamoDBHelper(process.env.TABLE_NAME);

  console.log('⚠️  Scanning database for all items...');

  const items = await db.scan<{ PK: string; SK: string }>();

  if (items.length === 0) {
    console.log('✓ Database is already empty');
    return;
  }

  console.log(`⚠️  Found ${items.length} items. Deleting...`);

  const keys = items.map((item) => ({ PK: item.PK, SK: item.SK }));
  await db.batchDelete(keys);

  console.log('✓ Database nuked successfully!');
};

const nukeCommand: CommandSettings = {
  name: 'nuke',
  description: 'Delete all items from the database',
  action,
};

export default nukeCommand;
