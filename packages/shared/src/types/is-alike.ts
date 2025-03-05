import { Expect } from './expect';
import { IsEqual } from './is-equal';
import { IsTrue } from './is-true';
import { MergeIntersections } from './merge-intersections';

type A = Expect<
  IsTrue<IsAlike<{ a: string } & { b: string }, { a: string; b: string }>>
>;

export type IsAlike<X, Y> = IsEqual<
  MergeIntersections<X>,
  MergeIntersections<Y>
>;
