import { useTrainingSessionsActive } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-active';

export type ActiveTrainingSession = NonNullable<
  ReturnType<typeof useTrainingSessionsActive>['data']
>;
