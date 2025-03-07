import { Expect } from './expect';
import { IsTrue } from './is-true';
import { Not } from './not';

export type IsTrueTetsA = Expect<IsTrue<true>>;
export type IsTrueTetsB = Expect<Not<IsTrue<false>>>;
