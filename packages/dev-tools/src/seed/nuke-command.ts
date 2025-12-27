import { connectToDatabase, disconnectFromDatabase } from '@backend/database';
import { User } from '@backend/models/user';
import { Workout } from '@backend/models/workout';
import { Location } from '@backend/models/location';
import { Sector } from '@backend/models/sector';
import { Climb } from '@backend/models/climb';
import { ClimbHistory } from '@backend/models/climb-history';
import { Session } from '@backend/models/session';
import { Image } from '@backend/models/image';
import * as fs from 'fs/promises';
import * as path from 'path';

import { Settings } from '../register';

type CommandSettings = Settings<void, Record<string, never>>;

async function countFilesInDirectory(dirPath: string): Promise<number> {
  let count = 0;
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      count += await countFilesInDirectory(fullPath);
    } else {
      count++;
    }
  }

  return count;
}

async function cleanDataDirectory() {
  const dataDir = path.join(process.cwd(), '..', 'backend', '.data');
  console.log(dataDir);

  try {
    await fs.access(dataDir);
  } catch {
    console.log('✓ No .data directory to clean');
    return;
  }

  console.log('⚠️  Cleaning .data directory...');

  try {
    const entries = await fs.readdir(dataDir, { withFileTypes: true });
    let filesDeleted = 0;

    for (const entry of entries) {
      if (entry.name === '.gitkeep') {
        continue;
      }

      const fullPath = path.join(dataDir, entry.name);
      if (entry.isDirectory()) {
        const fileCount = await countFilesInDirectory(fullPath);
        await fs.rm(fullPath, { recursive: true, force: true });
        filesDeleted += fileCount;
      } else {
        await fs.unlink(fullPath);
        filesDeleted++;
      }
    }

    console.log(`✓ Deleted ${filesDeleted} items from .data directory`);
  } catch (error) {
    console.error('❌ Error cleaning .data directory:', error);
  }
}

async function nukeDatabase() {
  await connectToDatabase();

  console.log('⚠️  Deleting all documents from all collections...');

  const models = [
    { name: 'User', model: User },
    { name: 'Workout', model: Workout },
    { name: 'Location', model: Location },
    { name: 'Sector', model: Sector },
    { name: 'Climb', model: Climb },
    { name: 'ClimbHistory', model: ClimbHistory },
    { name: 'Session', model: Session },
    { name: 'Image', model: Image },
  ];

  for (const { name, model } of models) {
    const result = await model.deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} ${name} documents`);
  }

  console.log('✓ Database nuked successfully!');
}

const action: CommandSettings['action'] = async () => {
  try {
    await nukeDatabase();
    await cleanDataDirectory();
  } finally {
    await disconnectFromDatabase();
  }
};

const nukeCommand: CommandSettings = {
  name: 'nuke',
  description: 'Delete all items from the database',
  action,
};

export default nukeCommand;
