import { Expect } from './expect';
import { IsAlike } from './is-alike';
import { IsTrue } from './is-true';

export type IsAlikeTestA = Expect<
  IsTrue<IsAlike<{ a: string } & { b: string }, { a: string; b: string }>>
>;
