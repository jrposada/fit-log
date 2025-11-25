export type ClimbingParamList = {
  ClimbingMain: { newLocationId?: string } | undefined;
  CreateLocation: { initialName?: string } | undefined;
  LocationDetail: { locationId: string };
  EditLocation: { locationId: string };
};
