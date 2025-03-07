import { Expect } from './expect';
import { IsEqual } from './is-equal';
import { IsFalse } from './is-false';
import { IsTrue } from './is-true';

export type IsEqualTestA = Expect<IsTrue<IsEqual<true, true>>>;
export type IsEqualTestB = Expect<IsTrue<IsEqual<false, false>>>;
export type IsEqualTestC = Expect<IsFalse<IsEqual<true, false>>>;
export type IsEqualTestD = Expect<IsFalse<IsEqual<false, true>>>;
export type IsEqualTestE = Expect<IsFalse<IsEqual<1, true>>>;
export type IsEqualTestF = Expect<IsFalse<IsEqual<1, 2>>>;
export type IsEqualTestG = Expect<IsTrue<IsEqual<'a', 'a'>>>;
export type IsEqualTestH = Expect<IsFalse<IsEqual<'a', 'b'>>>;
export type IsEqualTestI = Expect<IsFalse<IsEqual<'a', 'a' | 'b'>>>;
export type IsEqualTestJ = Expect<IsFalse<IsEqual<'a' | 'b', 'a'>>>;
export type IsEqualTestK = Expect<
  IsTrue<IsEqual<{ a: string }, { a: string }>>
>;
export type IsEqualTestL = Expect<
  IsTrue<IsEqual<{ a?: string }, { a?: string }>>
>;
