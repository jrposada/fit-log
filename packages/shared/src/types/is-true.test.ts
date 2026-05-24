import { Expect } from './expect.ts';
import { IsTrue } from './is-true.ts';
import { Not } from './not.ts';

export type IsTrueTetsA = Expect<IsTrue<true>>;
export type IsTrueTetsB = Expect<Not<IsTrue<false>>>;
