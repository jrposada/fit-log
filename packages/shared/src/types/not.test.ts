import { Expect } from './expect.ts';
import { Not } from './not.ts';

export type NotTestA = Expect<Not<false>>;
export type NotTestB = Expect<Not<Not<true>>>;
