import type {
  TrainingPlan,
  TrainingPlanSummary,
} from '@jrposada/fit-log-shared/models/training-plans/training-plan';

import type { ITrainingPlan } from '../../data/models/training-plan.ts';

function toApiTrainingPlanSummary(model: ITrainingPlan): TrainingPlanSummary {
  return {
    id: model.id,
    name: model.name,
    goal: model.goal,
    durationWeeks: model.durationWeeks,
  };
}

function toApiTrainingPlan(model: ITrainingPlan): TrainingPlan {
  return {
    id: model.id,
    name: model.name,
    goal: model.goal,
    discipline: model.discipline,
    durationWeeks: model.durationWeeks,
    athlete: model.athlete,
    exercises: model.exercises,
    sessionTemplates: model.sessionTemplates,
    blocks: model.blocks,
    schedule: model.schedule,
    progressionRules: model.progressionRules,
    tindeq: model.tindeq,
    benchmarks: model.benchmarks,
    glossary: model.glossary,
    coachNotes: model.coachNotes,
  };
}

export { toApiTrainingPlan, toApiTrainingPlanSummary };
