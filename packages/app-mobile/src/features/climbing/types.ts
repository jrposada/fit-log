export type ClimbingParamList = {
  ClimbingMain: { newLocationId?: string } | undefined;
  LocationDetail: { initialName?: string; locationId?: string } | undefined;
  ClimbDetail: { climbId?: string; locationId?: string };
};
