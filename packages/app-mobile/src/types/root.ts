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
};

export type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Profile'
>;
