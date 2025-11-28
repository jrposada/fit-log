import z from 'zod';

////////////
// Models //
////////////
export type Session = {
  /**
   * ID.
   */
  id: string;

  /**
   * Date when session was completed.
   *
   * @format date-time
   */
  completedAt: string;

  /**
   * Date when climb was created in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  createdAt: string;

  /**
   * Date when climb was last updated in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  updatedAt: string;
};
export const sessionSchema = z.object({
  id: z.string().nonempty(),
  completedAt: z.string().datetime(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/////////
// GET //
/////////
export type SessionsGetQuery = {
  limit?: number;
};
export const sessionsGetQuerySchema = z.object({
  limit: z.number().int().positive().optional(),
});

export type SessionsGetResponse = {
  sessions: Session[];
};

/////////
// PUT //
/////////
export type SessionsPutRequest = Omit<
  Session,
  'id' | 'createdAt' | 'updatedAt'
> & {
  /**
   * ID.
   */
  id?: string;

  /**
   * Date when climb was created in ISO 8601 format (UTC).
   *
   * @format date-time
   */
  createdAt?: string;
};
export const sessionsPutRequestSchema = z.object({
  id: z.string().optional(),
  completedAt: z.string().datetime(),

  createdAt: z.string().datetime().optional(),
});

export type SessionsPutResponse = {
  session: Session;
};

////////////
// DELETE //
////////////
export type SessionsDeleteParams = {
  id: string;
};
export const sessionsDeleteParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type SessionsDeleteResponse = undefined;

///////////////
// GET by ID //
///////////////
export type SessionsGetByIdParams = {
  id: string;
};
export const sessionsGetByIdParamsSchema = z.object({
  id: z.string().nonempty(),
});

export type SessionsGetByIdResponse = {
  session: Session;
};
