import ResourceNotFound from '../infrastructure/not-found-error.ts';
import type { ISession } from '../models/session.ts';
import { Session } from '../models/session.ts';
import { upsertDocument } from '../utils/upsert-document.ts';

type GetSessionsOptions = {
  limit?: number;
};

async function getSessions(options: GetSessionsOptions): Promise<ISession[]> {
  const { limit } = options;

  const query = Session.find();

  if (limit) {
    query.limit(limit);
  }

  return query.exec();
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
