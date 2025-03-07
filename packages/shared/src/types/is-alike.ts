import { IsEqual } from './is-equal';
import { MergeIntersections } from './merge-intersections';

export type IsAlike<X, Y> = IsEqual<
  MergeIntersections<X>,
  MergeIntersections<Y>
>;
