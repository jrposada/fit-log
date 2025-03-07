import { Expect } from './expect';
import { IsFalse } from './is-false';
import { Not } from './not';

export type IsFalseTestA = Expect<IsFalse<false>>;
export type IsFalseTestB = Expect<Not<IsFalse<true>>>;
