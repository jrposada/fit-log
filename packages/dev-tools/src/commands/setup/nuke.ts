import type { Command } from 'commander';
import { confirm } from '@inquirer/prompts';
import { connectToDatabase, disconnectFromDatabase } from '@backend/database';
import { User } from '@backend/models/user';
import { Workout } from '@backend/models/workout';
import { Location } from '@backend/models/location';
import { Sector } from '@backend/models/sector';
import { Climb } from '@backend/models/climb';
import { ClimbHistory } from '@backend/models/climb-history';
import { Session } from '@backend/models/session';
import { Image } from '@backend/models/image';
import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import assert from 'node:assert';

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

async function nukeKeycloak() {
  const keycloakEndpoint = process.env.KEYCLOAK_ENDPOINT;
  const keycloakRealm = process.env.KEYCLOAK_REALM;
  const keycloakAdmin = process.env.KEYCLOAK_ADMIN;
  const keycloakAdminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD;

  assert(keycloakEndpoint, 'KEYCLOAK_ENDPOINT environment variable is not set');
  assert(keycloakRealm, 'KEYCLOAK_REALM environment variable is not set');
  assert(keycloakAdmin, 'KEYCLOAK_ADMIN environment variable is not set');
  assert(
    keycloakAdminPassword,
    'KEYCLOAK_ADMIN_PASSWORD environment variable is not set'
  );


  console.log('⚠️  Resetting Keycloak...');

  // Get admin token from master realm
  const tokenUrl = `${keycloakEndpoint}/realms/master/protocol/openid-connect/token`;
  const tokenBody = new URLSearchParams({
    grant_type: 'password',
    client_id: 'admin-cli',
    username: keycloakAdmin,
    password: keycloakAdminPassword,
  });

  const tokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenBody.toString(),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(
      `Failed to get Keycloak admin token: ${tokenResponse.status} - ${errorText}`
    );
  }

  const { access_token } = (await tokenResponse.json()) as {
    access_token: string;
  };

  // Delete the realm
  const deleteUrl = `${keycloakEndpoint}/admin/realms/${keycloakRealm}`;
  const deleteResponse = await fetch(deleteUrl, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${access_token}` },
  });
  console.log('DELETE', deleteResponse.status);

  if (
    !deleteResponse.ok &&
    deleteResponse.status !== 404 &&
    deleteResponse.status !== 204
  ) {
    const errorText = await deleteResponse.text();
    throw new Error(
      `Failed to delete Keycloak realm: ${deleteResponse.status} - ${errorText}`
    );
  }

  if (deleteResponse.status === 204) {
    console.log(`✓ Deleted Keycloak realm "${keycloakRealm}"`);
  } else if (deleteResponse.status === 404) {
    console.warn(`✓ Deleted Keycloak realm "${keycloakRealm}" not found`);
  }

  // Restart container so --import-realm re-imports defaults
  console.log('⚠️  Restarting Keycloak container...');
  execSync('docker restart keycloak', { stdio: 'inherit' });
  console.log('✓ Keycloak container restarted (realm will be re-imported)');
}

export function registerNukeCommand(setupCmd: Command): void {
  setupCmd
    .command('nuke')
    .description('Delete all items from the database')
    .requiredOption('--nuke', 'Confirm you want to nuke the database')
    .action(async () => {
      const confirmed = await confirm({
        message:
          'This will permanently delete all data from the database. Are you sure?',
        default: false,
      });

      if (!confirmed) {
        console.log('Aborted.');
        process.exit(0);
      }

      try {
        await nukeDatabase();
        await cleanDataDirectory();
        await nukeKeycloak();
      } finally {
        await disconnectFromDatabase();
      }

      process.exit(0);
    });
}
