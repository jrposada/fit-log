export type ClimbingParamList = {
  ClimbingMain: { newLocationId?: string } | undefined;
  CreateLocation: { initialName?: string } | undefined;
  EditLocation: { locationId: string };
};
