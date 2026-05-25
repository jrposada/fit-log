import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import { MoonboardFetchResult } from '@jrposada/moonboard-sdk';

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
  const total = data.setups.reduce((sum, s) => sum + s.problems.length, 0);
  console.log(`✓ Seeded ${total} Moonboard problems`);
}
