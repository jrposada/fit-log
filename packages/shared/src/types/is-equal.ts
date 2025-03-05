import { Expect } from './expect';
import { IsFalse } from './is-false';
import { IsTrue } from './is-true';

type A = Expect<IsTrue<IsEqual<true, true>>>;
type B = Expect<IsTrue<IsEqual<false, false>>>;
type C = Expect<IsFalse<IsEqual<true, false>>>;
type D = Expect<IsFalse<IsEqual<false, true>>>;
type E = Expect<IsFalse<IsEqual<1, true>>>;
type F = Expect<IsFalse<IsEqual<1, 2>>>;
type G = Expect<IsTrue<IsEqual<'a', 'a'>>>;
type H = Expect<IsFalse<IsEqual<'a', 'b'>>>;
type I = Expect<IsFalse<IsEqual<'a', 'a' | 'b'>>>;
type J = Expect<IsFalse<IsEqual<'a' | 'b', 'a'>>>;
type K = Expect<IsTrue<IsEqual<{ a: string }, { a: string }>>>;
type L = Expect<IsTrue<IsEqual<{ a?: string }, { a?: string }>>>;

/**
 * Transforms a type into its canonical (standard) representation.
 *
 * In TypeScript, there are multiple ways to represent the same type shape—especially
 * when dealing with optional properties. For example, an optional property declared as:
 *
 *   id?: string;
 *
 * is internally equivalent to a property of type `string | undefined`, though their
 * representations may differ when compared directly.
 *
 * By canonicalizing a type, this utility recursively traverses its structure and ensures
 * that every property that might be optional is explicitly represented as a union with
 * `undefined`. This normalization converts different syntactic representations (such as
 * optional shorthand or intersections) into the same standard form, making type equality
 * checks (using utilities like `IsEqual`) more reliable.
 *
 * @template T - The type to canonicalize.
 */
export type Canonicalize<T> = T extends object
  ? {
      [K in keyof T]: {} extends Pick<T, K>
        ? Canonicalize<T[K]> | undefined
        : Canonicalize<T[K]>;
    }
  : T;

export type IsEqual<X, Y> =
  (<T>() => T extends Canonicalize<X> ? 1 : 2) extends <
    T,
  >() => T extends Canonicalize<Y> ? 1 : 2
    ? true
    : false;
