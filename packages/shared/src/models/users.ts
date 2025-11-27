import z from 'zod';

//////////
// POST //
//////////
export type UsersPostRequest = {
  email: string;
  password: string;
};
export const usersPostRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type UsersPostResponse = undefined;

///////////////
// AUTHORIZE //
///////////////
export type UsersAuthorizeRequest = {
  email: string;
  password: string;
};
export const usersAuthorizeRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type UsersAuthorizeResponse = undefined;
