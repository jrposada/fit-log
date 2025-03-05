import { Expect } from './expect';
import { Not } from './not';

type A = Expect<IsTrue<true>>;
type B = Expect<Not<IsTrue<false>>>;

export type IsTrue<T extends boolean> = T extends true ? true : false;
