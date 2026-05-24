import { Expect } from './expect.ts';
import { IsFalse } from './is-false.ts';
import { Not } from './not.ts';

export type IsFalseTestA = Expect<IsFalse<false>>;
export type IsFalseTestB = Expect<Not<IsFalse<true>>>;
