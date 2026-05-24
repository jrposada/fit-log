import { IsEqual } from './is-equal.ts';
import { MergeIntersections } from './merge-intersections.ts';

export type IsAlike<X, Y> = IsEqual<
  MergeIntersections<X>,
  MergeIntersections<Y>
>;
