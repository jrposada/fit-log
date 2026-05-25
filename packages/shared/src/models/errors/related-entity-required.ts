import { ApiErrorCode } from '../api-error-code.ts';

export type RelatedEntityRequired = {
  code: ApiErrorCode.RelatedEntityRequired;
  entity: string;
  forcible: boolean;
};
