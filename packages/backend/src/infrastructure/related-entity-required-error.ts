export class RelatedEntityRequiredError extends Error {
  constructor(
    public readonly entity: string,
    public readonly forcible: boolean = true,
    message?: string
  ) {
    super(message ?? `Related entity required: ${entity}`);
  }
}

export default RelatedEntityRequiredError;
