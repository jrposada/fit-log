import { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ClimbingParamList } from '../features/climbing/types';

export type RootParamList = {
  Home: undefined;
  Climbing: NavigatorScreenParams<ClimbingParamList>;
  Training: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  Profile: undefined;
};

export type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;
