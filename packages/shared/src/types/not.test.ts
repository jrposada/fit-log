import { Expect } from './expect';
import { Not } from './not';

export type NotTestA = Expect<Not<false>>;
export type NotTestB = Expect<Not<Not<true>>>;
