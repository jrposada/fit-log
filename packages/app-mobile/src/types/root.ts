import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootParamList = {
  Home: undefined;
  History: undefined;
  Stats: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  Profile: undefined;
  Map: undefined;
  LocationDetail: { initialName?: string; locationId?: string } | undefined;
  ClimbDetail: { climbId?: string; locationId?: string };
  ClimbLog: undefined;
  ClimbingSessionDetail: { sessionId: string };
  MapPointPicker: { latitude?: number; longitude?: number } | undefined;
  ImagePicker: undefined;
};

export type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Profile'
>;
