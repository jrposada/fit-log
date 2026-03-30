export type ClimbingParamList = {
  ClimbingMain: { newLocationId?: string } | undefined;
  LocationDetail: { initialName?: string; locationId?: string } | undefined;
  ClimbDetail: { climbId?: string; locationId?: string };
  MapPointPicker: { latitude?: number; longitude?: number } | undefined;
  ImagePicker: undefined;
};
