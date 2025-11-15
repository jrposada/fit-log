import { Boulder } from '@shared/models/boulder';

/**
 * Navigation types for the app
 */
export type RootStackParamList = {
  Home: undefined;
  ImagePicker: undefined;
  BoulderEditor: {
    imageUri: string;
    boulder?: Boulder;
  };
};
