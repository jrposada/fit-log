import { Expect } from './expect.ts';
import { IsAlike } from './is-alike.ts';
import { IsTrue } from './is-true.ts';

export type IsAlikeTestA = Expect<
  IsTrue<IsAlike<{ a: string } & { b: string }, { a: string; b: string }>>
>;
