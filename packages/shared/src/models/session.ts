import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import z from 'zod';

////////////
// Models //
////////////
export type Session = {
  /**
   * ID `session#<user-id>#<workout-id>#<session-id>`.
   */
  id: string;

  /**
   * Date when session was logged in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  completedAt: string;
};
export const sessionSchema = z.object({
  id: z.string().nonempty(),
  completedAt: z.string().datetime(),
});

/////////
// GET //
/////////
export type SessionsGetResponse = {
  sessions: Session[];
  lastEvaluatedKey: QueryCommandOutput['LastEvaluatedKey'];
};

/////////
// PUT //
/////////
export type SessionsPutRequest = Omit<Session, 'id' | 'workoutId'> & {
  /**
   * ID.
   */
  id?: string;

  /**
   * Related workout ID.
   */
  workoutId?: string;
};
export const sessionsPutRequestSchema = z.object({
  id: z.string().optional(),
  workoutId: z.string().optional(),
  completedAt: z.string().datetime(),
});

export type SessionsPutResponse = {
  session: Session;
};

////////////
// DELETE //
////////////
export type SessionsDeleteResponse = undefined;

///////////////
// GET by ID //
///////////////
export type SessionsGetByIdResponse = {
  session: Session;
};
