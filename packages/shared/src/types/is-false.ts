import { Expect } from './expect';
import { Not } from './not';

type A = Expect<IsFalse<false>>;
type B = Expect<Not<IsFalse<true>>>;

export type IsFalse<T extends boolean> = T extends false ? true : false;
