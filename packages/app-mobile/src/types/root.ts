import { NavigatorScreenParams } from '@react-navigation/native';

import { ClimbingParamList } from '../features/climbing/types';

export type RootParamList = {
  Home: undefined;
  Climbing: NavigatorScreenParams<ClimbingParamList>;
  Training: undefined;
};
