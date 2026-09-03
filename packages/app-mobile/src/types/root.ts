import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootParamList = {
  Home: undefined;
  Activity: undefined;
  Explore: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootParamList> | undefined;
  Profile: undefined;
  LocationDetail: { initialName?: string; locationId?: string } | undefined;
  ClimbDetail: { climbId?: string; locationId?: string };
  ClimbLog: undefined;
  ClimbingSessionDetail: { sessionId: string };
  MapPointPicker: { latitude?: number; longitude?: number } | undefined;
  ImagePicker: undefined;
  Model3dPicker: undefined;
};

export type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Profile'
>;
