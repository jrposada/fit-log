import { Types } from 'mongoose';

import ResourceNotFound from '../infrastructure/not-found-error.ts';
import type { ISession } from '../models/session.ts';
import { Session } from '../models/session.ts';
import { upsertDocument } from '../utils/upsert-document.ts';

const DEFAULT_LIMIT = 20;

/** Keyset cursor for the sessions list, in decoded (plain JSON) form. */
type SessionsCursor = { completedAt: string; id: string };

type GetSessionsOptions = {
  limit?: number;
  cursor?: SessionsCursor | null;
};

async function getSessions(
  options: GetSessionsOptions
): Promise<{ sessions: ISession[]; nextCursor: SessionsCursor | null }> {
  const { limit, cursor } = options;

  const filter: Record<string, unknown> = {};
  if (cursor) {
    const cursorDate = new Date(cursor.completedAt);
    const cursorId = new Types.ObjectId(cursor.id);
    filter.$or = [
      { completedAt: { $lt: cursorDate } },
      { completedAt: cursorDate, _id: { $lt: cursorId } },
    ];
  }

  const pageSize = limit ?? DEFAULT_LIMIT;

  const sessions = await Session.find(filter)
    .sort({ completedAt: -1, _id: -1 })
    .limit(pageSize + 1);

  const hasMore = sessions.length > pageSize;
  const pageSessions = hasMore ? sessions.slice(0, pageSize) : sessions;

  const last = pageSessions[pageSessions.length - 1];
  const nextCursor =
    hasMore && last
      ? { completedAt: last.completedAt.toISOString(), id: last._id.toString() }
      : null;

  return { sessions: pageSessions, nextCursor };
}

async function getSessionById(id: string): Promise<ISession> {
  const session = await Session.findById(id);

  if (!session) {
    throw new ResourceNotFound(`Session with id ${id} not found`);
  }

  return session;
}

type UpsertSessionInput = {
  id?: string;
  completedAt: string;
};

async function upsertSession(input: UpsertSessionInput): Promise<ISession> {
  return upsertDocument(Session, input.id, {
    completedAt: new Date(input.completedAt),
  });
}

async function deleteSession(id: string): Promise<void> {
  await Session.deleteOne({ _id: id });
}

export { deleteSession, getSessionById, getSessions, upsertSession };
export type { SessionsCursor };
