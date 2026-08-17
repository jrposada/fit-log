import { assert } from '@jrposada/fit-log-shared/utils/assert';
import { Redis } from 'ioredis';

/**
 * BullMQ requires `maxRetriesPerRequest: null` on any connection it owns
 * (queue producer or worker) — without it, blocking commands used
 * internally by BullMQ throw instead of blocking.
 */
export function createBullMqRedisConnection(): Redis {
  assert(process.env.REDIS_ENDPOINT, {
    msg: 'REDIS_ENDPOINT environment variable is not set',
  });

  return new Redis(process.env.REDIS_ENDPOINT, {
    maxRetriesPerRequest: null,
  });
}
