import { NavigatorScreenParams } from '@react-navigation/native';

import { ClimbingParamList } from './climbing';

export type RootParamList = {
  Home: undefined;
  Climbing: NavigatorScreenParams<ClimbingParamList>;
  Training: undefined;
};
