import type { TrainingPlanSlot } from '@jrposada/fit-log-shared/models/training-plans/training-plan';
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
  TrainingSessionsDetail: { trainingSessionId: string };
  PlanEnroll: undefined;
  PlanOverview: undefined;
  PlannedSessionDetail: {
    week: number;
    day: number;
    slot: TrainingPlanSlot;
    sessionTemplateId: string;
  };
  Benchmarks: undefined;
  MapPointPicker: { latitude?: number; longitude?: number } | undefined;
  ImagePicker: undefined;
  Model3dPicker: undefined;
};

export type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Profile'
>;
