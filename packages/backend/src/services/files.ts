import fs from 'node:fs/promises';
import path from 'node:path';

import { assert } from '@shared/utils/assert';

export class FilesService {
  private static baseDir(): string {
    assert(process.env.DATA_DIR, {
      msg: 'DATA_DIR environment variable is not set',
    });
    return process.env.DATA_DIR;
  }

  public static publicDir(): string {
    return path.join(FilesService.baseDir(), 'public');
  }

  public static async ensureDirectories(): Promise<void> {
    await fs.mkdir(FilesService.baseDir(), { recursive: true });
    await fs.mkdir(FilesService.publicDir(), { recursive: true });
  }
}
