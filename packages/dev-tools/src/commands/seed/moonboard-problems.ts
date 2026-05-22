import { User } from '@backend/models/user';
import { Types } from 'mongoose';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import { MoonboardFetchResult } from '@jrposada/moonboard-sdk';

const MOONBOARD_SYSTEM_KEYCLOAK_ID = 'moonboard-system';

async function getOrCreateSystemUser(): Promise<Types.ObjectId> {
  let user = await User.findOne({ keycloakId: MOONBOARD_SYSTEM_KEYCLOAK_ID });
  if (!user) {
    user = await User.create({
      keycloakId: MOONBOARD_SYSTEM_KEYCLOAK_ID,
      email: 'moonboard@system.local',
      name: 'Moonboard',
      roles: [],
    });
  }
  return user._id as Types.ObjectId;
}

export async function seedMoonboardProblems(): Promise<void> {
  const dataPath = path.resolve(
    fileURLToPath(import.meta.url),
    '../../mock-data/moonboard-problems.json'
  );

  let data: MoonboardFetchResult;
  try {
    const require = createRequire(import.meta.url);
    data = require(dataPath) as MoonboardFetchResult;
  } catch {
    console.log(
      '⚠ No moonboard-problems.json found — skipping Moonboard seed.'
    );
    console.log(
      '  Run `pnpm dev-tools moonboard fetch > packages/dev-tools/src/commands/seed/mock-data/moonboard-problems.json` to generate it.'
    );
    return;
  }

  // const ownerId = await getOrCreateSystemUser();
  // const { upserted } = await upsertMoonboardProblems(data, ownerId);
  console.log(
    `✓ Seeded ${data.benchmarks.length + data.problems.length} Moonboard problems`
  );
}
