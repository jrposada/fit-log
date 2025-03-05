import { Expect } from './expect';

type A = Expect<Not<false>>;
type B = Expect<Not<Not<true>>>;

export type Not<T extends boolean> = T extends true ? false : true;
