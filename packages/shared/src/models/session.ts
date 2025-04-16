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
  /**
   * Workout name when this session was logged.
   */
  workoutName: string;
  /**
   * Workout description when this session was logged.
   */
  workoutDescription: string;
};
export const sessionSchema = z.object({
  completedAt: z.string().datetime(),
  id: z.string().nonempty(),
  workoutDescription: z.string().nonempty(),
  workoutName: z.string().nonempty(),
});

/////////
// GET //
/////////
export type SessionsGetResponse = {
  sessions: Session[];
  lastEvaluatedKey: QueryCommandOutput['LastEvaluatedKey'];
};

export type SessionsGetParams = {
  workoutId?: string;
};
export const sessionsGetParamsSchema = z.object({
  workoutId: z.string().nonempty().optional(),
});

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
  completedAt: z.string().datetime(),
  id: z.string().optional(),
  workoutDescription: z.string().nonempty(),
  workoutId: z.string().optional(),
  workoutName: z.string().nonempty(),
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
